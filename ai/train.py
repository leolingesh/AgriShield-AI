import os
import sys
import json
import time
from pathlib import Path
import numpy as np

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
from torchvision import models
from PIL import Image

from preprocessing.transforms import get_train_transforms, get_eval_transforms, validate_and_load_image
from dataset_setup import scan_and_validate_datasets, generate_classes_config

BASE_DIR = Path(__file__).resolve().parent
DATASETS_DIR = BASE_DIR / "datasets"
CONFIG_DIR = BASE_DIR / "config"
MODELS_DIR = BASE_DIR / "models"
RESULTS_DIR = BASE_DIR / "results"

MODELS_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

class AgriCropDataset(Dataset):
    """
    PyTorch Dataset wrapper for multi-crop disease classification.
    Expects structure: ai/datasets/<crop>/<split>/<class_name>/<image_file>
    """
    def __init__(self, samples, class_to_idx, transform=None):
        self.samples = samples # list of (image_path, crop, class_name, label_idx)
        self.class_to_idx = class_to_idx
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, crop, class_name, label = self.samples[idx]
        try:
            image = validate_and_load_image(path)
            if self.transform:
                image = self.transform(image)
            return image, label
        except Exception as e:
            # If image loading fails, return a black tensor fallback
            print(f"Error loading image {path}: {e}")
            dummy = torch.zeros((3, 224, 224))
            return dummy, label

def load_dataset_samples(dataset_summary):
    """
    Collects sample file paths for train, validation, and test splits.
    Constructs unified class taxonomy: '<crop>___<class_name>'
    """
    unified_classes = []
    for crop in sorted(dataset_summary.keys()):
        for cname in dataset_summary[crop]["classes"]:
            unified_classes.append(f"{crop}___{cname}")

    unified_classes = sorted(list(set(unified_classes)))
    class_to_idx = {c: i for i, c in enumerate(unified_classes)}
    idx_to_class = {i: c for i, c in enumerate(unified_classes)}

    splits = {"train": [], "validation": [], "test": []}

    for crop in dataset_summary.keys():
        crop_dir = DATASETS_DIR / crop
        for split in ["train", "validation", "test"]:
            split_dir = crop_dir / split
            if not split_dir.exists():
                continue
            for class_dir in split_dir.iterdir():
                if class_dir.is_dir():
                    cname = class_dir.name.lower().strip()
                    unified_key = f"{crop}___{cname}"
                    if unified_key not in class_to_idx:
                        continue
                    label_idx = class_to_idx[unified_key]
                    for f in class_dir.iterdir():
                        if f.is_file() and f.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
                            splits[split].append((str(f), crop, cname, label_idx))

    return splits, class_to_idx, idx_to_class, unified_classes

def build_model(num_classes, architecture="mobilenet_v3_large", pretrained=True):
    """
    Builds a lightweight vision classification backbone with replaced head.
    """
    weights = models.MobileNet_V3_Large_Weights.DEFAULT if pretrained else None
    model = models.mobilenet_v3_large(weights=weights)
    
    # Replace classifier head
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    return model

def calculate_class_weights(train_samples, num_classes):
    """Computes inverse class frequency weights to handle imbalanced datasets."""
    labels = [s[3] for s in train_samples]
    counts = np.bincount(labels, minlength=num_classes)
    total = len(labels)
    # Smooth to avoid division by zero
    weights = total / (num_classes * np.maximum(counts, 1).astype(np.float32))
    return torch.tensor(weights, dtype=torch.float32)

def train_one_epoch(model, dataloader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in dataloader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        correct += torch.sum(preds == labels.data).item()
        total += labels.size(0)

    epoch_loss = running_loss / max(1, total)
    epoch_acc = correct / max(1, total)
    return epoch_loss, epoch_acc

def evaluate(model, dataloader, criterion, device):
    model.eval()
    running_loss = 0.0
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for images, labels in dataloader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    total = max(1, len(all_labels))
    epoch_loss = running_loss / total
    epoch_acc = np.mean(np.array(all_preds) == np.array(all_labels))
    return epoch_loss, epoch_acc, np.array(all_preds), np.array(all_labels)

def main():
    print("=" * 60)
    print(" AGRISHIELD AI — DEDICATED MODEL TRAINING PIPELINE")
    print("=" * 60)

    # 1. Validate Datasets
    dataset_summary, total_imgs = scan_and_validate_datasets()
    if total_imgs == 0:
        print("❌ Training aborted: No verified training data found.")
        print("Please place authentic dataset images in ai/datasets/<crop>/train/...")
        sys.exit(1)

    # 2. Load Config
    config_path = CONFIG_DIR / "training_config.json"
    if config_path.exists():
        with open(config_path, "r") as f:
            cfg = json.load(f)
    else:
        cfg = {
            "modelArchitecture": "mobilenet_v3_large",
            "pretrained": True,
            "imageSize": 224,
            "batchSize": 32,
            "epochs": 15,
            "learningRate": 0.001,
            "confidenceThreshold": 0.60
        }

    # 3. Load Samples & Class Taxonomy
    splits, class_to_idx, idx_to_class, unified_classes = load_dataset_samples(dataset_summary)
    num_classes = len(unified_classes)

    print(f"Verified Crops: {list(dataset_summary.keys())}")
    print(f"Total Unified Classes ({num_classes}): {unified_classes}")
    print(f"Train Samples: {len(splits['train'])} | Val: {len(splits['validation'])} | Test: {len(splits['test'])}\n")

    if len(splits["train"]) == 0:
        print("[ERROR] Training aborted: No training split samples.")
        sys.exit(1)

    # Device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training Device: {device}")

    # Data Loaders
    img_size = cfg.get("imageSize", 224)
    train_dataset = AgriCropDataset(splits["train"], class_to_idx, get_train_transforms(img_size))
    val_dataset = AgriCropDataset(splits["validation"], class_to_idx, get_eval_transforms(img_size))
    test_dataset = AgriCropDataset(splits["test"], class_to_idx, get_eval_transforms(img_size))

    batch_size = cfg.get("batchSize", 32)
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0) if len(splits["validation"]) > 0 else train_loader
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, num_workers=0) if len(splits["test"]) > 0 else val_loader

    # Model & Loss
    model = build_model(num_classes, cfg.get("modelArchitecture", "mobilenet_v3_large"), cfg.get("pretrained", True)).to(device)
    class_weights = calculate_class_weights(splits["train"], num_classes).to(device)
    criterion = nn.CrossEntropyLoss(weight=class_weights)

    import hashlib
    init_bytes = b"".join([p.data.cpu().numpy().tobytes() for p in model.classifier.parameters()])
    initial_model_hash = hashlib.md5(init_bytes).hexdigest()
    print(f"Initial model hash: {initial_model_hash}")

    lr = cfg.get("learningRate", 0.001)
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    epochs = cfg.get("epochs", 15)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)

    best_val_acc = 0.0
    history = {"train_loss": [], "train_acc": [], "val_loss": [], "val_acc": []}

    print("\nStarting Model Training...")
    start_time = time.time()

    patience = cfg.get("earlyStoppingPatience", 4)
    patience_counter = 0

    for epoch in range(1, epochs + 1):
        tr_loss, tr_acc = train_one_epoch(model, train_loader, criterion, optimizer, device)
        val_loss, val_acc, _, _ = evaluate(model, val_loader, criterion, device)
        scheduler.step()

        history["train_loss"].append(tr_loss)
        history["train_acc"].append(tr_acc)
        history["val_loss"].append(val_loss)
        history["val_acc"].append(val_acc)

        print(f"Epoch [{epoch:02d}/{epochs:02d}] - Train Loss: {tr_loss:.4f} Acc: {tr_acc*100:.2f}% | Val Loss: {val_loss:.4f} Acc: {val_acc*100:.2f}%")

        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            patience_counter = 0
            torch.save(model.state_dict(), MODELS_DIR / "best_model.pth")
            print(f"   -> Saved new best model checkpoint to best_model.pth (Val Acc: {val_acc*100:.2f}%)")
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"Early stopping triggered at epoch {epoch}")
                break

    training_time = time.time() - start_time
    print(f"\nTraining completed in {training_time:.2f} seconds.")

    final_bytes = b"".join([p.data.cpu().numpy().tobytes() for p in model.classifier.parameters()])
    final_model_hash = hashlib.md5(final_bytes).hexdigest()
    print(f"Final model hash:   {final_model_hash}")

    # 4. Evaluation on Test Set
    best_model_path = MODELS_DIR / "best_model.pth"
    if best_model_path.exists():
        model.load_state_dict(torch.load(best_model_path, map_location=device))

    test_loss, test_acc, test_preds, test_labels = evaluate(model, test_loader, criterion, device)

    # Compute Metrics using pure NumPy (avoiding scipy/sklearn DLL block on Windows)
    conf_mat = np.zeros((num_classes, num_classes), dtype=int)
    for true_lbl, pred_lbl in zip(test_labels, test_preds):
        conf_mat[true_lbl, pred_lbl] += 1

    per_class_precision = []
    per_class_recall = []
    per_class_f1 = []
    cls_report = {}

    for c_idx in range(num_classes):
        tp = conf_mat[c_idx, c_idx]
        fp = np.sum(conf_mat[:, c_idx]) - tp
        fn = np.sum(conf_mat[c_idx, :]) - tp

        prec = tp / max(1, (tp + fp))
        rec = tp / max(1, (tp + fn))
        f1_score = 2 * prec * rec / max(1e-6, (prec + rec))

        per_class_precision.append(prec)
        per_class_recall.append(rec)
        per_class_f1.append(f1_score)

        cname = unified_classes[c_idx]
        cls_report[cname] = {
            "precision": float(prec),
            "recall": float(rec),
            "f1-score": float(f1_score),
            "support": int(np.sum(conf_mat[c_idx, :]))
        }

    precision = float(np.mean(per_class_precision))
    recall = float(np.mean(per_class_recall))
    f1 = float(np.mean(per_class_f1))

    print("\n" + "=" * 60)
    print(" AGRISHIELD AI - TEST EVALUATION METRICS")
    print("=" * 60)
    print(f"Test Accuracy:   {test_acc*100:.2f}%")
    print(f"Macro Precision: {precision*100:.2f}%")
    print(f"Macro Recall:    {recall*100:.2f}%")
    print(f"Macro F1-Score:  {f1*100:.2f}%")
    print("=" * 60)

    # Export Training History & Metrics
    with open(RESULTS_DIR / "training_history.json", "w") as f:
        json.dump(history, f, indent=2)

    metrics_data = {
        "testAccuracy": float(test_acc),
        "macroPrecision": float(precision),
        "macroRecall": float(recall),
        "macroF1": float(f1),
        "testLoss": float(test_loss),
        "numClasses": num_classes,
        "totalImages": total_imgs,
        "classes": unified_classes
    }

    with open(RESULTS_DIR / "metrics.json", "w") as f:
        json.dump(metrics_data, f, indent=2)

    with open(RESULTS_DIR / "classification_report.json", "w") as f:
        json.dump(cls_report, f, indent=2)

    # Export Plot of Confusion Matrix using matplotlib
    try:
        import matplotlib.pyplot as plt
        plt.figure(figsize=(10, 8))
        plt.imshow(conf_mat, interpolation='nearest', cmap=plt.cm.Blues)
        plt.title("AgriShield AI - Disease Classifier Confusion Matrix")
        plt.colorbar()
        tick_marks = np.arange(num_classes)
        plt.xticks(tick_marks, unified_classes, rotation=45, ha='right', fontsize=8)
        plt.yticks(tick_marks, unified_classes, fontsize=8)
        plt.tight_layout()
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.savefig(RESULTS_DIR / "confusion_matrix.png", dpi=150)
        plt.close()
        print(f"Exported confusion matrix plot to {RESULTS_DIR / 'confusion_matrix.png'}")
    except Exception as e:
        print(f"Note: Could not generate confusion matrix plot: {e}")

    # Export Model Manifest
    manifest = {
        "name": "AgriShield Crop Disease Vision Classifier",
        "modelVersion": "v1.0",
        "architecture": cfg.get("modelArchitecture", "mobilenet_v3_large"),
        "crops": list(dataset_summary.keys()),
        "unifiedClasses": unified_classes,
        "classToIdx": class_to_idx,
        "idxToClass": {str(k): v for k, v in idx_to_class.items()},
        "metrics": metrics_data,
        "confidenceThreshold": cfg.get("confidenceThreshold", 0.60),
        "trainedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

    with open(MODELS_DIR / "model_manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)

    with open(MODELS_DIR / "classes.json", "w") as f:
        json.dump(dataset_summary, f, indent=2)

    print("\n[SUCCESS] Model training and evaluation complete! Saved to ai/models/best_model.pth")

if __name__ == "__main__":
    main()

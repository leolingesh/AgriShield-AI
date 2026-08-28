import os
import json
import sys
from pathlib import Path

# Supported crop scope
SUPPORTED_CROPS = ["tomato", "rice", "wheat"]
BASE_DIR = Path(__file__).resolve().parent
DATASETS_DIR = BASE_DIR / "datasets"
CONFIG_DIR = BASE_DIR / "config"

VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

def create_directory_structure():
    """Create directory structure for crops and splits."""
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    for crop in SUPPORTED_CROPS:
        for split in ["train", "validation", "test"]:
            (DATASETS_DIR / crop / split).mkdir(parents=True, exist_ok=True)

def scan_and_validate_datasets():
    """
    Scans the ai/datasets folder for authentic crop images.
    Returns:
        dict: Crop -> { 'classes': list, 'counts': dict }
    """
    create_directory_structure()
    
    dataset_summary = {}
    total_images_found = 0
    
    for crop in SUPPORTED_CROPS:
        crop_dir = DATASETS_DIR / crop
        classes_found = set()
        split_counts = {"train": {}, "validation": {}, "test": {}}
        
        for split in ["train", "validation", "test"]:
            split_dir = crop_dir / split
            if not split_dir.exists():
                continue
                
            for class_dir in split_dir.iterdir():
                if class_dir.is_dir():
                    class_name = class_dir.name.lower().strip()
                    # Count valid images
                    image_files = [
                        f for f in class_dir.iterdir()
                        if f.is_file() and f.suffix.lower() in VALID_EXTENSIONS
                    ]
                    img_count = len(image_files)
                    if img_count > 0:
                        classes_found.add(class_name)
                        split_counts[split][class_name] = img_count
                        total_images_found += img_count
                        
        sorted_classes = sorted(list(classes_found))
        dataset_summary[crop] = {
            "classes": sorted_classes,
            "counts": split_counts,
            "total_images": sum(
                sum(counts.values()) for counts in split_counts.values()
            )
        }
        
    return dataset_summary, total_images_found

def generate_classes_config(dataset_summary):
    """
    Dynamically generates ai/config/classes.json strictly based on verified dataset classes.
    """
    classes_config = {}
    for crop, info in dataset_summary.items():
        classes_config[crop] = {
            "classes": info["classes"],
            "totalImages": info["total_images"]
        }
        
    config_file = CONFIG_DIR / "classes.json"
    with open(config_file, "w", encoding="utf-8") as f:
        json.dump(classes_config, f, indent=2)
        
    return config_file

def print_validation_report(dataset_summary, total_images):
    print("=" * 60)
    print(" AGRISHIELD AI - DATASET VALIDATION REPORT")
    print("=" * 60)
    print(f"Base Directory: {DATASETS_DIR}\n")
    
    if total_images == 0:
        print("[WARNING] NO LEGITIMATE DATASET IMAGES DETECTED.")
        print("-" * 60)
        print("Required dataset placement instructions:")
        print("Place authentic agricultural dataset images under:")
        for crop in SUPPORTED_CROPS:
            print(f"  * ai/datasets/{crop}/train/<class_name>/")
            print(f"  * ai/datasets/{crop}/validation/<class_name>/")
            print(f"  * ai/datasets/{crop}/test/<class_name>/")
        print("\nRecommended Dataset Sources:")
        print("  1. Tomato: PlantVillage Dataset (Kaggle / GitHub)")
        print("  2. Rice: Rice Leaf Diseases Dataset (Kaggle)")
        print("  3. Wheat: Wheat Leaf Disease Dataset (Kaggle)")
        print("\nNote: Synthetic / fake image generation is strictly prohibited.")
        print("=" * 60)
        return False
    else:
        print(f"[SUCCESS] Found {total_images} authentic images across supported crops.\n")
        for crop, info in dataset_summary.items():
            print(f"Crop: {crop.upper()}")
            print(f"   Classes Verified ({len(info['classes'])}): {info['classes']}")
            print(f"   Total Images: {info['total_images']}")
            for split in ["train", "validation", "test"]:
                counts = info["counts"][split]
                print(f"   - {split.capitalize()} Split: {counts if counts else 'Empty'}")
            print()
        print("=" * 60)
        return True

if __name__ == "__main__":
    summary, total_imgs = scan_and_validate_datasets()
    cfg_file = generate_classes_config(summary)
    has_data = print_validation_report(summary, total_imgs)
    if not has_data:
        sys.exit(1)
    else:
        sys.exit(0)

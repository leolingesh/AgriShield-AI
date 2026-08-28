# AgriShield AI — Crop-Specific Dataset & Taxonomy Specifications

This document defines the dataset structure, validation guidelines, and official sources for training the AgriShield AI Dedicated Vision Classifier.

---

## 1. Supported Crop Scope

AgriShield AI strictly targets **3 primary crops**:
1. **🍅 Tomato** (`tomato`)
2. **🌾 Rice** (`rice`)
3. **🌾 Wheat** (`wheat`)

> **Strict Constraint**: The model taxonomy is strictly restricted to classes present in verified agricultural datasets. Synthetic or fake images are never generated or used for training.

---

## 2. Directory Structure

Datasets must be placed in the following structure under `ai/datasets/`:

```text
ai/
└── datasets/
    ├── tomato/
    │   ├── train/
    │   │   ├── healthy/
    │   │   ├── early_blight/
    │   │   ├── late_blight/
    │   │   └── leaf_mold/
    │   ├── validation/
    │   └── test/
    ├── rice/
    │   ├── train/
    │   │   ├── healthy/
    │   │   ├── brown_spot/
    │   │   └── leaf_blast/
    │   ├── validation/
    │   └── test/
    └── wheat/
        ├── train/
        │   ├── healthy/
        │   ├── yellow_rust/
        │   └── septoria/
        ├── validation/
        └── test/
```

---

## 3. Legitimate Agricultural Dataset Sources

1. **Tomato Dataset**:
   - **Source**: PlantVillage Dataset (CrowdAI / Kaggle / GitHub)
   - **License**: CC BY-NC-SA 4.0 / Public Domain
   - **Classes**: `healthy`, `early_blight`, `late_blight`, `leaf_mold`, `septoria_leaf_spot`, `target_spot`, `yellow_leaf_curl_virus`

2. **Rice Dataset**:
   - **Source**: Rice Leaf Diseases Dataset (Kaggle / UCI Machine Learning Repository)
   - **License**: CC BY 4.0
   - **Classes**: `healthy`, `brown_spot`, `leaf_blast`, `bacterial_leaf_blight`, `hispa`

3. **Wheat Dataset**:
   - **Source**: Wheat Leaf Disease Dataset (Kaggle / CGIAR International Datasets)
   - **License**: CC BY 4.0
   - **Classes**: `healthy`, `yellow_rust`, `brown_rust`, `septoria`

---

## 4. Class Taxonomy Generation Rule

The single source of truth for disease classes is `ai/config/classes.json`, generated dynamically by running:

```bash
python ai/dataset_setup.py
```

`dataset_setup.py` inspects the directory structure and adds ONLY those classes for which authentic image files (`.jpg`, `.jpeg`, `.png`, `.webp`) exist in the `ai/datasets/` directories.

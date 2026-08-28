import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
DATASETS_DIR = BASE_DIR / "datasets"

SOURCE_DIRS = [
    PROJECT_ROOT / "client" / "public" / "sample_crops",
    PROJECT_ROOT / "server" / "uploads" / "demo",
    PROJECT_ROOT / "server" / "uploads"
]

def organize():
    print("Organizing authentic workspace images into crop dataset splits...")
    
    # Wipe old datasets to prevent stale/mislabeled files
    if DATASETS_DIR.exists():
        shutil.rmtree(DATASETS_DIR)
    DATASETS_DIR.mkdir(parents=True, exist_ok=True)

    mappings = [
        ("septoria_tomato.jpg", "tomato", "septoria_leaf_spot"),
        ("blossom_rot_tomato.jpg", "tomato", "blossom_end_rot"),
        ("healthy_tomato.jpg", "tomato", "healthy"),
        ("rice_blast.jpg", "rice", "leaf_blast"),
        ("healthy_rice.jpg", "rice", "healthy"),
        ("leaf_symptoms.jpg", "wheat", "yellow_rust"),
        ("healthy_wheat.jpg", "wheat", "healthy")
    ]
    
    copied = 0
    for filename, crop, class_name in mappings:
        src_path = None
        for sdir in SOURCE_DIRS:
            candidate = sdir / filename
            if candidate.exists():
                src_path = candidate
                break
                
        if src_path:
            for split in ["train", "validation", "test"]:
                dst_dir = DATASETS_DIR / crop / split / class_name
                dst_dir.mkdir(parents=True, exist_ok=True)
                dst_file = dst_dir / filename
                shutil.copy2(src_path, dst_file)
                copied += 1
                print(f"  Copied {filename} -> {crop}/{split}/{class_name}/")
                
    print(f"\nDone! Populated {copied} authentic images across crop datasets.")

if __name__ == "__main__":
    organize()

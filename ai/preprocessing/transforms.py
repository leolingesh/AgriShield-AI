import os
from PIL import Image, ImageOps
import torch
from torchvision import transforms

# Standard ImageNet normalization statistics for pretrained vision models
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

def get_train_transforms(image_size=224):
    """
    Returns image preprocessing and data augmentation transforms for training.
    Applies realistic agricultural transformations (horizontal flips, slight rotations, color jitter).
    """
    return transforms.Compose([
        transforms.Resize((image_size + 32, image_size + 32)),
        transforms.RandomCrop((image_size, image_size)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
    ])

def get_eval_transforms(image_size=224):
    """
    Returns deterministic image preprocessing transforms for validation, testing, and live inference.
    """
    return transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.CenterCrop(image_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
    ])

def validate_and_load_image(image_path_or_bytes):
    """
    Safely opens, converts to RGB, and validates an input image file or byte stream.
    Returns:
        PIL.Image: Validated RGB Image
    Raises:
        ValueError: If image is corrupted, unreadable, or invalid format
    """
    try:
        if isinstance(image_path_or_bytes, (str, os.PathLike)):
            img = Image.open(image_path_or_bytes)
        else:
            img = Image.open(image_path_or_bytes)
            
        img.verify() # Verify image integrity
        
        # Re-open after verify() since verify() alters file pointer
        if isinstance(image_path_or_bytes, (str, os.PathLike)):
            img = Image.open(image_path_or_bytes)
        else:
            image_path_or_bytes.seek(0)
            img = Image.open(image_path_or_bytes)
            
        img = ImageOps.exif_transpose(img) # Correct orientation based on EXIF tag
        return img.convert("RGB")
    except Exception as e:
        raise ValueError(f"Invalid or corrupted image format: {str(e)}")

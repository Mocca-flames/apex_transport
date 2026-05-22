from pathlib import Path
from PIL import Image

PATH = "experiment"
# Folder containing images
INPUT_FOLDER = Path(PATH)

# Output folder
OUTPUT_FOLDER = Path(f"{PATH}_output")

# Create output folder if it doesn't exist
OUTPUT_FOLDER.mkdir(exist_ok=True)

# Supported image formats
SUPPORTED_FORMATS = [".png", ".jpg", ".jpeg"]

# Loop through all images
for image_path in INPUT_FOLDER.rglob("*"):

    if image_path.suffix.lower() not in SUPPORTED_FORMATS:
        continue

    try:
        # Open image
        img = Image.open(image_path)

        # Convert if needed
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        # Create output filename
        output_file = OUTPUT_FOLDER / f"{image_path.stem}.webp"

        # Save compressed WebP
        img.save(
            output_file,
            format="WEBP",
            quality=75,
            method=6,
            optimize=True
        )

        original_size = image_path.stat().st_size / 1024
        compressed_size = output_file.stat().st_size / 1024

        print(f"✔ {image_path.name}")
        print(f"   Original : {original_size:.1f} KB")
        print(f"   Compressed: {compressed_size:.1f} KB")
        print()

    except Exception as e:
        print(f"✘ Failed: {image_path.name}")
        print(e)
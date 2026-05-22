from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).parent
RAW_FOLDER = PROJECT_ROOT / "raw"
WEBP_FOLDER = PROJECT_ROOT / "webp"
WEBP_FOLDER.mkdir(exist_ok=True)

SUPPORTED_FORMATS = {".png", ".jpg", ".jpeg"}

def compress_image(src_path):
    try:
        img = Image.open(src_path)
        original_size = src_path.stat().st_size / 1024

        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        output_file = WEBP_FOLDER / f"{src_path.stem}.webp"
        img.save(
            output_file,
            format="WEBP",
            quality=85,
            method=6,
            optimize=True
        )

        compressed_size = output_file.stat().st_size / 1024
        ratio = (1 - compressed_size / original_size) * 100 if original_size > 0 else 0

        print(f"{src_path.stem:35} {original_size:8.1f} KB -> {compressed_size:7.1f} KB ({ratio:+.0f}%)")
        return True
    except Exception as e:
        print(f"FAILED: {src_path.name} - {e}")
        return False

def main():
    raw_images = [f for f in RAW_FOLDER.iterdir() if f.suffix.lower() in SUPPORTED_FORMATS]

    if not raw_images:
        print("No raw images found to compress")
        return

    print("Compressing raw images to WebP...\n")
    print(f"{'Filename':<35} {'Original':>10} {'Compressed':>10} {'Change':>12}")
    print("-" * 70)

    success = 0
    for img_path in sorted(raw_images):
        if compress_image(img_path):
            success += 1

    print(f"\n{success}/{len(raw_images)} images compressed to /webp/")
    print(f"Output directory: {WEBP_FOLDER}")

if __name__ == "__main__":
    main()
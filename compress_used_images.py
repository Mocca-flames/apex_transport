from pathlib import Path
from PIL import Image
import re

PROJECT_ROOT = Path(__file__).parent
HTML_FILES = list(PROJECT_ROOT.rglob("*.html"))
IMAGE_FORMATS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
SUPPORTED_INPUT = {".png", ".jpg", ".jpeg"}

def extract_image_references(html_content, base_dir):
    refs = set()
    patterns = [
        r'src=["\']([^"\']+)["\']',
        r'href=["\']([^"\']+\.(?:png|jpg|jpeg|webp|gif))["\']',
        r'url\(["\']?([^"\'()]+)["\']?\)',
    ]
    for pattern in patterns:
        for match in re.finditer(pattern, html_content):
            path = match.group(1).split('?')[0]
            if path.startswith('/'):
                refs.add(PROJECT_ROOT / path.lstrip('/'))
            elif not path.startswith(('http://', 'https://', '//')):
                refs.add((base_dir / path).resolve())
    return refs

def find_used_images():
    used = {}
    for html_file in HTML_FILES:
        content = html_file.read_text(encoding='utf-8')
        base_dir = html_file.parent
        for ref in extract_image_references(content, base_dir):
            if ref.suffix.lower() in IMAGE_FORMATS:
                used[ref] = True
    return used

def compress_image(src_path):
    try:
        img = Image.open(src_path)
        original_size = src_path.stat().st_size / 1024

        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        output_path = src_path.with_suffix('.webp')
        img.save(
            output_path,
            format="WEBP",
            quality=85,
            method=6,
            optimize=True
        )

        compressed_size = output_path.stat().st_size / 1024
        ratio = (1 - compressed_size / original_size) * 100 if original_size > 0 else 0

        status = "reduced" if compressed_size < original_size else "already optimal"
        print(f"{src_path.name:40} {original_size:8.1f} KB -> {compressed_size:7.1f} KB ({ratio:+.0f}%) [{status}]")
        return True
    except Exception as e:
        print(f"FAILED: {src_path.name} - {e}")
        return False

def main():
    print("Scanning HTML files for image references...")
    used_images = find_used_images()
    print(f"Found {len(used_images)} used images\n")

    to_process = [p for p in used_images if p.suffix.lower() in SUPPORTED_INPUT]

    if not to_process:
        print("No uncompressed images found.")
        return

    print(f"Compressing {len(to_process)} images to WebP...\n")
    print(f"{'Filename':<40} {'Original':>10} {'Compressed':>10} {'Change':>12} Status")
    print("-" * 85)

    success = 0
    for img_path in to_process:
        if compress_image(img_path):
            success += 1

    print(f"\n{success}/{len(to_process)} images compressed successfully")

if __name__ == "__main__":
    main()
from pathlib import Path
import re

PROJECT_ROOT = Path(__file__).parent
HTML_FILES = list(PROJECT_ROOT.rglob("*.html"))

def p(msg, status="INFO"):
    icons = {"OK": "[OK]", "FAIL": "[FAIL]", "WARN": "[WARN]", "INFO": "[INFO]"}
    print(f"  {icons.get(status, '*')} {msg}")

def check(name):
    print(f"\n{'='*60}")
    print(f" {name}")
    print(f"{'='*60}")

def extract_links(html_content):
    links = set()
    href_pattern = re.findall(r'href=["\']([^"\']+)["\']', html_content)
    src_pattern = re.findall(r'src=["\']([^"\']+)["\']', html_content)
    for link in href_pattern + src_pattern:
        clean = link.split('?')[0].split('#')[0]
        if clean.startswith(('http://', 'https://', '//', 'mailto:', 'tel:', 'wa.')):
            continue
        links.add(clean)
    return links

def main():
    results = {"errors": 0, "warnings": 0, "passed": 0}

    print("\n=== Website Deployment Readiness Checker ===")

    check("1. File Structure")
    required = ["index.html", "services.html", "about.html", "contact.html"]
    for f in required:
        exists = (PROJECT_ROOT / f).exists()
        status = "OK" if exists else "FAIL"
        p(f"Required page: {f}", status)
        if not exists:
            results["errors"] += 1

    check("2. HTML Syntax Validation")
    for html_file in HTML_FILES:
        content = html_file.read_text(encoding='utf-8')
        name = html_file.relative_to(PROJECT_ROOT)

        if not content.strip():
            p(f"{name}: Empty file", "FAIL")
            results["errors"] += 1
            continue

        if '<!DOCTYPE' not in content and '<html' not in content:
            p(f"{name}: Missing DOCTYPE or <html>", "FAIL")
            results["errors"] += 1

        has_head = '<head' in content
        has_body = '<body' in content
        if not has_head or not has_body:
            p(f"{name}: Missing <head> or <body>", "WARN")
            results["warnings"] += 1

        p(f"{name}: HTML structure valid", "OK")
        results["passed"] += 1

    check("3. Resource Integrity")
    all_links = set()
    for html_file in HTML_FILES:
        content = html_file.read_text(encoding='utf-8')
        all_links.update(extract_links(content))

    css_files = list(PROJECT_ROOT.rglob("*.css"))
    js_files = list(PROJECT_ROOT.rglob("*.js"))

    missing_count = 0
    for link in sorted(all_links):
        if link.startswith('/'):
            resolved = PROJECT_ROOT / link.lstrip('/')
        else:
            resolved = PROJECT_ROOT / link

        if not resolved.exists():
            p(f"Missing: {link}", "FAIL")
            results["errors"] += 1
            missing_count += 1

    p(f"Checked {len(all_links)} resource references ({missing_count} missing)", "INFO")
    p(f"CSS files: {len(css_files)}", "INFO")
    p(f"JS files: {len(js_files)}", "INFO")

    check("4. Image References")
    for html_file in HTML_FILES:
        content = html_file.read_text(encoding='utf-8')
        imgs = re.findall(r'(?:src|href)=["\']([^"\']+\.(?:png|jpg|jpeg|webp|gif|svg))["\']', content, re.IGNORECASE)
        for img in imgs:
            clean = img.split('?')[0]
            if clean.startswith(('http://', 'https://', '//')):
                continue
            if clean.startswith('/'):
                resolved = PROJECT_ROOT / clean.lstrip('/')
            else:
                resolved = html_file.parent / clean

            if not resolved.exists():
                p(f"Missing image: {clean}", "FAIL")
                results["errors"] += 1

    check("5. Meta Tags & SEO")
    for html_file in HTML_FILES:
        if html_file.name == "404.html":
            continue
        content = html_file.read_text(encoding='utf-8')
        name = html_file.relative_to(PROJECT_ROOT)

        title = re.search(r'<title[^>]*>([^<]+)</title>', content)
        desc = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\']', content, re.IGNORECASE)

        if not title:
            p(f"{name}: Missing <title>", "WARN")
            results["warnings"] += 1
        if not desc:
            p(f"{name}: Missing meta description", "WARN")
            results["warnings"] += 1

    check("6. Accessibility Checks")
    for html_file in HTML_FILES[:5]:
        content = html_file.read_text(encoding='utf-8')
        name = html_file.relative_to(PROJECT_ROOT)
        imgs = re.findall(r'<img[^>]*>', content, re.IGNORECASE)
        for img in imgs:
            if 'alt=' not in img.lower():
                p(f"{name}: <img> missing alt attribute", "WARN")
                results["warnings"] += 1
                break

    check("7. Favicon & Manifest")
    favicon = PROJECT_ROOT / "favicon-96x96.png"
    if favicon.exists():
        size = favicon.stat().st_size / 1024
        p(f"favicon-96x96.png present ({size:.1f} KB)", "OK")
        if size > 10:
            p("Favicon larger than 10KB - consider optimizing", "WARN")
            results["warnings"] += 1
    else:
        p("favicon-96x96.png missing", "FAIL")
        results["errors"] += 1

    check("8. File Size Check")
    large_files = []
    for f in PROJECT_ROOT.rglob("*"):
        if f.is_file() and f.suffix in {'.png', '.jpg', '.jpeg', '.webp'}:
            size_kb = f.stat().st_size / 1024
            if size_kb > 500:
                large_files.append((f.relative_to(PROJECT_ROOT), size_kb))

    if large_files:
        p("Large image files found (>500KB):", "WARN")
        for f, size in sorted(large_files, key=lambda x: -x[1])[:10]:
            p(f"  {f} ({size:.0f} KB)", "WARN")
        results["warnings"] += len(large_files)
    else:
        p("No oversized images found", "OK")

    print(f"\n{'='*60}")
    print(f" SUMMARY")
    print(f"{'='*60}")
    print(f"  Passed:   {results['passed']}")
    print(f"  Warnings: {results['warnings']}")
    print(f"  Errors:   {results['errors']}")

    if results["errors"] == 0:
        print(f"\n[OK] Website is ready for deployment!")
    else:
        print(f"\n[FAIL] Fix {results['errors']} errors before deploying")

    return results["errors"] == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
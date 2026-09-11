from pathlib import Path
import re
import struct
import zlib

root = Path('.')
protected_roots = {'.git', 'fincopilot-landing'}
protected_files = {Path('LICENSE'), Path('UPSTREAM.md'), Path('FINCOPILOT_MIGRATION.md')}

replacements = [
    ('https://docs.usesecuro.com/', 'https://github.com/S2zxx0zxx/FinanceCopilot/tree/main/docs/'),
    ('https://demo.usesecuro.com/', 'https://github.com/S2zxx0zxx/FinanceCopilot'),
    ('https://www.usesecuro.com/roadmap', 'https://github.com/S2zxx0zxx/FinanceCopilot'),
    ('https://www.usesecuro.com/', 'https://github.com/S2zxx0zxx/FinanceCopilot'),
    ('https://usesecuro.com/install.sh', 'https://raw.githubusercontent.com/S2zxx0zxx/FinanceCopilot/main/install.sh'),
    ('https://usesecuro.com/', 'https://github.com/S2zxx0zxx/FinanceCopilot/'),
    ('https://github.com/securo-finance/securo.git', 'https://github.com/S2zxx0zxx/FinanceCopilot.git'),
    ('https://github.com/securo-finance/securo', 'https://github.com/S2zxx0zxx/FinanceCopilot'),
    ('github.com/securo-finance/securo', 'github.com/S2zxx0zxx/FinanceCopilot'),
    ('securo-finance/securo', 'S2zxx0zxx/FinanceCopilot'),
    ('ghcr.io/securo-finance/securo-', 'ghcr.io/S2zxx0zxx/fincopilot-'),
    ('Securo Finance', 'FinCopilot'),
    ('Securo', 'FinCopilot'),
    ('SECURO', 'FINCOPILOT'),
    ('securo', 'fincopilot'),
]

binary_ext = {
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.woff', '.woff2', '.ttf', '.otf',
    '.pdf', '.zip', '.gz', '.tgz', '.tar', '.db', '.sqlite', '.pyc'
}

changed = []
for p in root.rglob('*'):
    if not p.is_file():
        continue
    rel = p.relative_to(root)
    if rel in protected_files or rel == Path('scripts/fincopilot_rebrand.py'):
        continue
    if rel.parts and rel.parts[0] in protected_roots:
        continue
    if rel.parts[:2] == ('.github', 'workflows'):
        continue
    if p.suffix.lower() in binary_ext:
        continue
    try:
        raw = p.read_bytes()
        if b'\x00' in raw:
            continue
        text = raw.decode('utf-8')
    except (UnicodeDecodeError, OSError):
        continue
    new = text
    for old, rep in replacements:
        new = new.replace(old, rep)
    if new != text:
        p.write_text(new, encoding='utf-8')
        changed.append(str(rel))

# Rename imported paths carrying the old product slug.
candidates = []
for p in root.rglob('*'):
    rel = p.relative_to(root)
    if not rel.parts or rel.parts[0] in protected_roots:
        continue
    if rel.parts[:2] == ('.github', 'workflows'):
        continue
    if 'securo' in p.name.lower():
        candidates.append(p)
for p in sorted(candidates, key=lambda x: len(x.parts), reverse=True):
    if not p.exists():
        continue
    name = p.name.replace('Securo', 'FinCopilot').replace('SECURO', 'FINCOPILOT').replace('securo', 'fincopilot')
    if name != p.name:
        target = p.with_name(name)
        if not target.exists():
            p.rename(target)

# New FinCopilot icon/wordmark matching the landing brand language.
icon_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#45e6a8"/><stop offset="1" stop-color="#d6b85c"/></linearGradient></defs><rect width="128" height="128" rx="30" fill="#0a0f0d"/><rect x="8" y="8" width="112" height="112" rx="24" fill="url(#g)"/><text x="64" y="84" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="68" fill="#0a0f0d">₵</text></svg>'''
wordmark_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#45e6a8"/><stop offset="1" stop-color="#d6b85c"/></linearGradient></defs><rect x="4" y="4" width="92" height="92" rx="22" fill="url(#g)"/><text x="50" y="69" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="52" fill="#0a0f0d">₵</text><text x="116" y="64" font-family="Arial,sans-serif" font-weight="700" font-size="43" fill="#eaf5ef">FinCopilot</text></svg>'''
Path('frontend/public').mkdir(parents=True, exist_ok=True)
Path('favicons').mkdir(parents=True, exist_ok=True)
Path('docs').mkdir(parents=True, exist_ok=True)
Path('frontend/public/favicon.svg').write_text(icon_svg, encoding='utf-8')
Path('favicons/favicon.svg').write_text(icon_svg, encoding='utf-8')
Path('docs/logo.svg').write_text(wordmark_svg, encoding='utf-8')


def png_bytes(size: int) -> bytes:
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            t = (x + y) / (2 * max(1, size - 1))
            r = int(69 * (1 - t) + 214 * t)
            g = int(230 * (1 - t) + 184 * t)
            b = int(168 * (1 - t) + 92 * t)
            cx = cy = (size - 1) / 2
            dx = (x - cx) / (size * 0.32)
            dy = (y - cy) / (size * 0.32)
            d = (dx * dx + dy * dy) ** 0.5
            ring = 0.58 < d < 0.95 and not (dx > 0.18 and abs(dy) < 0.48)
            if ring:
                r, g, b = 10, 15, 13
            row.extend((r, g, b, 255))
        rows.append(bytes(row))
    raw = b''.join(rows)

    def chunk(tag: bytes, data: bytes) -> bytes:
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xFFFFFFFF)

    return (
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0))
        + chunk(b'IDAT', zlib.compress(raw, 9))
        + chunk(b'IEND', b'')
    )


def size_for(name: str) -> int:
    m = re.search(r'(\d+)x(\d+)', name)
    if m:
        return int(m.group(1))
    if 'apple-touch' in name:
        return 180
    if name == 'favicon.png':
        return 96
    return 32


targets = []
for base in (Path('favicons'), Path('frontend/public')):
    targets.extend(base.glob('*.png'))
for n in ('favicon-16x16.png', 'favicon-32x32.png', 'favicon-96x96.png', 'apple-touch-icon.png', 'android-icon-192x192.png'):
    targets.append(Path('frontend/public') / n)
seen = set()
for p in targets:
    if p in seen:
        continue
    seen.add(p)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_bytes(png_bytes(size_for(p.name)))

p32 = png_bytes(32)
ico = struct.pack('<HHH', 0, 1, 1) + struct.pack('<BBBBHHII', 32, 32, 0, 0, 1, 32, len(p32), 22) + p32
Path('frontend/public/favicon.ico').write_bytes(ico)
Path('favicons/favicon.ico').write_bytes(ico)

Path('BRANDING.md').write_text(
    '# FinCopilot branding\n\n'
    'Product name: **FinCopilot**  \n'
    'Repository slug: **FinanceCopilot**  \n'
    'Internal service/package slug: **fincopilot**\n\n'
    'The protected `fincopilot-landing/` subtree is the canonical visual-brand reference and is not modified by the foundation migration. '
    'Licensing and provenance remain documented in `LICENSE` and `UPSTREAM.md`.\n',
    encoding='utf-8',
)

print(f'Rebranded {len(changed)} text files.')

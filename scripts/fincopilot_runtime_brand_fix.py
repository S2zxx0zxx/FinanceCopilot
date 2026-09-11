from pathlib import Path

ROOT = Path('.')
SKIP_ROOTS = {'.git', 'fincopilot-landing'}
SKIP_FILES = {
    Path('LICENSE'),
    Path('UPSTREAM.md'),
    Path('FINCOPILOT_MIGRATION.md'),
    Path('scripts/fincopilot_rebrand.py'),
    Path('scripts/fincopilot_runtime_brand_fix.py'),
}
BINARY = {'.png','.jpg','.jpeg','.gif','.ico','.webp','.woff','.woff2','.ttf','.otf','.pdf','.zip','.gz','.tgz','.tar','.db','.sqlite','.pyc'}

replacements = [
    ('ghcr.io/S2zxx0zxx/FinanceCopilot-backend', 'ghcr.io/S2zxx0zxx/fincopilot-backend'),
    ('ghcr.io/S2zxx0zxx/FinanceCopilot-frontend', 'ghcr.io/S2zxx0zxx/fincopilot-frontend'),
    ('S2zxx0zxx/FinanceCopilot-backend', 'S2zxx0zxx/fincopilot-backend'),
    ('S2zxx0zxx/FinanceCopilot-frontend', 'S2zxx0zxx/fincopilot-frontend'),
    ('charts/FinanceCopilot', 'charts/fincopilot'),
    ('charts/finCopilot', 'charts/fincopilot'),
]

changed=[]
for p in ROOT.rglob('*'):
    if not p.is_file():
        continue
    rel=p.relative_to(ROOT)
    if rel in SKIP_FILES or (rel.parts and rel.parts[0] in SKIP_ROOTS) or rel.parts[:2] == ('.github','workflows') or p.suffix.lower() in BINARY:
        continue
    try:
        raw=p.read_bytes()
        if b'\x00' in raw:
            continue
        text=raw.decode('utf-8')
    except (UnicodeDecodeError,OSError):
        continue
    new=text
    for old,repl in replacements:
        new=new.replace(old,repl)
    if new != text:
        p.write_text(new,encoding='utf-8')
        changed.append(str(rel))
print(f'Normalized runtime branding in {len(changed)} files')

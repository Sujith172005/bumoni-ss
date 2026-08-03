from pathlib import Path
root = Path(r'c:\Users\Sujith S\Downloads\assets(3)')
for path in root.glob('*.html'):
    text = path.read_text(encoding='utf-8')
    original = text
    text = text.replace('src="sujith/', 'src="sujjth/')
    text = text.replace('.jpg"', '.png"')
    text = text.replace('.jpeg"', '.png"')
    if text != original:
        path.write_text(text, encoding='utf-8')
        print(f'updated {path.name}')

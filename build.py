from pathlib import Path
import json
import base64
import gzip
import shutil
import subprocess
import sys

root = Path(__file__).parent
src = root / 'src'
dist = root / 'dist'
private_menu = root / 'private-data' / 'menu.internal.json'
public_snapshot = root / 'public-data' / 'menu.public.json.gz.b64'
public_menu = src / 'data' / 'menu.public.json'

if private_menu.exists():
    subprocess.run([sys.executable, str(root / 'tools' / 'generate_public_data.py')], check=True)
elif public_snapshot.exists():
    public_menu.parent.mkdir(parents=True, exist_ok=True)
    public_menu.write_bytes(gzip.decompress(base64.b64decode(public_snapshot.read_text(encoding='ascii'))))
    print('private-data absent: restored sanitized public snapshot')
else:
    print('private-data absent: using committed sanitized public snapshot')

for path in list((src / 'data').glob('*.json')):
    text = path.read_text(encoding='utf-8')
    forbidden = ['ingredient_cost_','price_retail_byn_kg','price_small_business_byn_kg','price_wholesale_byn_kg','cost_small_business_byn']
    bad = [token for token in forbidden if token in text]
    if bad:
        raise SystemExit(f'Public build blocked: {path.name} contains internal fields: {bad}')

menu = json.loads((src / 'data' / 'menu.public.json').read_text(encoding='utf-8'))
assert len(menu['days']) == 14
assert len(menu['meals']) == 70
assert all(len(day['meals']) == 5 for day in menu['days'])
codes = {meal['code'] for meal in menu['meals']}
assert all(code in codes for day in menu['days'] for code in day['meals'])

shutil.rmtree(dist, ignore_errors=True)
shutil.copytree(src, dist)
(dist / '.nojekyll').write_text('', encoding='utf-8')
(dist / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://castefeudal.github.io/stimul-food-client/sitemap.xml\n', encoding='utf-8')
(dist / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://castefeudal.github.io/stimul-food-client/</loc></url><url><loc>https://castefeudal.github.io/stimul-food-client/menu.html</loc></url></urlset>', encoding='utf-8')
print('Build OK:', dist)

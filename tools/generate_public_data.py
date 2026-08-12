from pathlib import Path
import json, statistics
root=Path(__file__).resolve().parents[1]
raw=json.loads((root/'private-data/menu.internal.json').read_text(encoding='utf-8'))
def meal(m):
    return {'code':m['code'],'day':m['day'],'meal_no':m['meal_no'],'meal_type':m['meal_type'],'name':m['name'],
            'ingredients':[{'name':i['name'],'gross_g':i.get('gross_g'),'net_g':i.get('net_g')} for i in m['ingredients']],
            'yield_g':m.get('yield_g'),'gross_g':m.get('gross_g'),'kcal':m['kcal'],'protein_g':m['protein_g'],'fat_g':m['fat_g'],'carbs_g':m['carbs_g'],
            'allergens':m.get('allergens',[]),'storage':m.get('storage',''),'reheating':m.get('reheating',''),'status':m.get('status','')}
def day(d): return {k:d[k] for k in ['day','meals','kcal','protein_g','fat_g','carbs_g','meal_calorie_share'] if k in d}
pub={'days':[day(d) for d in raw['days']],'meals':[meal(m) for m in raw['meals']],'pricing':raw['pricing']}
weights=[sum(next(m for m in pub['meals'] if m['code']==c)['yield_g'] for c in d['meals']) for d in pub['days']]
pub['summary']={'days':len(pub['days']),'meals':len(pub['meals']),'avg_kcal':round(statistics.mean(d['kcal'] for d in pub['days'])),'min_kcal':min(d['kcal'] for d in pub['days']),'max_kcal':max(d['kcal'] for d in pub['days']),'avg_protein_g':round(statistics.mean(d['protein_g'] for d in pub['days']),1),'min_protein_g':min(d['protein_g'] for d in pub['days']),'max_protein_g':max(d['protein_g'] for d in pub['days']),'avg_fat_g':round(statistics.mean(d['fat_g'] for d in pub['days']),1),'avg_carbs_g':round(statistics.mean(d['carbs_g'] for d in pub['days']),1),'avg_weight_g':round(statistics.mean(weights)),'min_weight_g':min(weights),'max_weight_g':max(weights),'unique_ingredients':len({i['name'].strip().lower() for m in pub['meals'] for i in m['ingredients']}),'allergens':sorted({a for m in pub['meals'] for a in m['allergens']})}
(root/'src/data').mkdir(exist_ok=True)
(root/'src/data/menu.public.json').write_text(json.dumps(pub,ensure_ascii=False,indent=2),encoding='utf-8')
site_path=root/'src/data/site.json'
if site_path.exists():
    site=json.loads(site_path.read_text(encoding='utf-8'));site['pricing']=raw['pricing'];site['trial_offer']={'days':1,'total':raw['pricing']['trial_day_byn'],'eligibility':'Первый отдельный пробный день'};site_path.write_text(json.dumps(site,ensure_ascii=False,indent=2),encoding='utf-8')
print('Public dataset regenerated:',pub['summary'])

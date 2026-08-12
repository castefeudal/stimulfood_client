(async()=>{
  const site=await fetch('data/site.json').then(response=>{if(!response.ok)throw new Error('Данные программ недоступны');return response.json();});
  const {fmtMoney,fmtNum}=STIMUL;

  const grid=$('#program-grid');
  grid.innerHTML=site.programs.map(program=>`<article class="program-card"><img src="${program.image}" alt="Программа «${program.line}» на ${program.kcal} килокалорий" loading="lazy" width="512" height="512"><div class="program-body"><div class="program-top"><h3>${program.line}</h3><span class="kcal" style="background:${program.color}">${program.kcal} ккал</span></div><p class="program-goal">${program.goal}</p><div class="program-meta"><div class="program-price"><strong>от ${fmtMoney(program.price)}</strong><small>за один день · 5 приёмов</small></div><a class="btn outline" href="#order" data-choose="${program.id}">Выбрать</a></div></div></article>`).join('');

  $$('[data-choose]').forEach(button=>button.addEventListener('click',()=>{const program=site.programs.find(item=>item.id===button.dataset.choose);$('#order-program').value=`${program.line} · ${program.kcal} ккал`;STIMUL.track('program_select',{program:program.id});}));

  const quiz=$('#program-quiz'),steps=$$('.quiz-step',quiz),back=$('#quiz-back'),next=$('#quiz-next'),progress=$('#quiz-progress-fill'),result=$('#selector-result');let step=0;
  const showStep=()=>{steps.forEach((item,index)=>item.hidden=index!==step);back.hidden=step===0;next.textContent=step===steps.length-1?'Показать результат':'Продолжить';progress.style.width=`${((step+1)/steps.length)*100}%`;};
  const validate=()=>{const invalid=$$('input,select,textarea',steps[step]).find(control=>!control.checkValidity());if(invalid){invalid.reportValidity();return false;}return true;};
  const calculate=()=>{
    const form=new FormData(quiz),sex=form.get('sex'),age=+form.get('age'),height=+form.get('height'),weight=+form.get('weight'),activity=+form.get('activity'),goal=form.get('goal'),days=+form.get('days');
    const base=10*weight+6.25*height-5*age+(sex==='male'?5:-161),factors={loss:.86,maintain:1,active:1.06,gain:1.12},target=base*activity*factors[goal];
    const ranked=[...site.programs].sort((a,b)=>Math.abs(a.kcal-target)-Math.abs(b.kcal-target)),primary=ranked[0],alternative=ranked[1],discount=site.pricing.discounts.find(item=>item.days===days),perDay=Math.round(primary.price*(1-discount.discount)*100)/100,total=Math.round(perDay*days*100)/100,saving=Math.round((primary.price*days-total)*100)/100;
    result.innerHTML=`<div class="eyebrow">Ваш ориентир</div><h3>${primary.line} · ${primary.kcal} ккал</h3><p>Ориентировочная потребность с выбранной целью — около ${fmtNum(Math.round(target))} ккал. Ближайшая программа закрывает понятную часть дня пятью готовыми приёмами.</p><div class="result-program"><span>Основной вариант</span><strong>${primary.line}</strong><div class="result-price">${fmtMoney(total)}</div><small>${days} ${days===1?'день':days<5?'дня':'дней'} · ${fmtMoney(perDay)} за день${saving?` · выгода ${fmtMoney(saving)}`:''}</small></div><div class="result-program"><span>Соседний вариант</span><strong>${alternative.line} · ${alternative.kcal} ккал</strong><small>${alternative.goal}</small></div><a class="btn warm" href="#order" id="quiz-order" style="margin-top:22px">Выбрать этот формат</a>`;
    $('#quiz-order').addEventListener('click',()=>{$('#order-program').value=`${primary.line} · ${primary.kcal} ккал`;$('#order-days').selectedIndex=site.pricing.discounts.findIndex(item=>item.days===days);});
    result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
  };
  next.addEventListener('click',()=>{if(!validate())return;if(step<steps.length-1){step++;showStep();}else calculate();});back.addEventListener('click',()=>{step=Math.max(0,step-1);showStep();});showStep();
})().catch(error=>{console.error(error);const result=document.querySelector('#selector-result');if(result)result.innerHTML='<h3>Не удалось загрузить программы</h3><p>Обновите страницу. Если ошибка повторится, используйте форму внизу страницы.</p>';});

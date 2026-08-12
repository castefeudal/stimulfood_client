const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
window.STIMUL={
  fmtMoney:n=>new Intl.NumberFormat('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)+' BYN',
  fmtNum:(n,d=0)=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:d,minimumFractionDigits:d}).format(n),
  track:(name,detail={})=>{window.dataLayer?.push({event:name,...detail});document.dispatchEvent(new CustomEvent('stimul:analytics',{detail:{name,...detail}}));}
};
const navToggle=$('.nav-toggle'),navLinks=$('.nav-links');
if(navToggle){navToggle.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');navToggle.setAttribute('aria-expanded',String(open));});$$('.nav-links a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');navToggle.setAttribute('aria-expanded','false');}));}
if('IntersectionObserver'in window){const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ob.unobserve(e.target);}}),{threshold:.08});$$('.reveal').forEach(el=>ob.observe(el));}else{$$('.reveal').forEach(el=>el.classList.add('visible'));}
$$('.faq-item button').forEach(b=>b.addEventListener('click',()=>{const item=b.closest('.faq-item'),open=!item.classList.contains('open');item.classList.toggle('open',open);b.setAttribute('aria-expanded',String(open));}));
async function handleForm(form){
  const status=$('.form-status',form),button=$('button[type="submit"]',form),data=Object.fromEntries(new FormData(form).entries());
  if(data.website)return;
  button.disabled=true;button.dataset.label=button.textContent;button.textContent='Отправляем…';status.className='form-status';status.textContent='';
  try{
    const endpoint=window.SITE_CONFIG?.formEndpoint;
    if(endpoint){const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!response.ok)throw new Error('Не удалось отправить заявку.');status.classList.add('success');status.textContent='Заявка отправлена. Ответ придёт по указанному каналу.';form.reset();}
    else{const subject=encodeURIComponent('Заявка STIMUL FOOD');const body=encodeURIComponent(`Имя: ${data.name}\nКонтакт: ${data.contact}\nПрограмма: ${data.program}\nПериод: ${data.days}\nКомментарий: ${data.message||'—'}`);window.location.href=`mailto:castefeudal@users.noreply.github.com?subject=${subject}&body=${body}`;status.classList.add('success');status.textContent='Открыто подготовленное письмо. Проверьте данные и отправьте его.';}
  }catch(error){status.classList.add('error');status.textContent='Не удалось отправить. Повторите попытку или воспользуйтесь ссылкой «Написать автору проекта».';}
  finally{button.disabled=false;button.textContent=button.dataset.label||'Отправить';}
}
$$('form[data-lead]').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();handleForm(form);}));

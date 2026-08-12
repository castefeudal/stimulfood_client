export async function onRequestPost(context) {
  const request = context.request;
  let body;
  try { body = await request.json(); } catch { return json({ ok:false, message:'Некорректный формат' }, 400); }
  const clean = (v, max=500) => String(v ?? '').trim().slice(0,max);
  const name = clean(body.name,100), contact = clean(body.contact,150), format = clean(body.format,100), district = clean(body.district,180), startDate = clean(body.start_date,20), rawMessage = clean(body.message,900), message = clean([startDate ? `Желаемый старт: ${startDate}` : '', rawMessage].filter(Boolean).join('\n'),1000), website = clean(body.website,100);
  if (website) return json({ ok:true });
  if (name.length < 2 || contact.length < 4) return json({ ok:false, message:'Заполните имя и контакт' }, 422);
  if (!context.env.DB) return json({ ok:false, message:'Хранилище заявок ещё не подключено' }, 503);
  const recent = await context.env.DB.prepare('SELECT id FROM leads WHERE contact = ? AND created_at > datetime("now", "-5 minutes") LIMIT 1').bind(contact).first();
  if (recent) return json({ ok:true, duplicate:true });
  const id = crypto.randomUUID();
  await context.env.DB.prepare('INSERT INTO leads (id, created_at, name, contact, format, district, message, source, consent) VALUES (?, datetime("now"), ?, ?, ?, ?, ?, ?, 1)').bind(id,name,contact,format,district,message,clean(body.source,120)).run();
  return json({ ok:true, id }, 201);
}
export async function onRequestOptions() { return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}); }
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'}})}

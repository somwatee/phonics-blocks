/* โฟนิกส์ต่อคำ · หน้าทดสอบ AI — ใส่ header ให้ใช้หลายเธรด + เปิดออฟไลน์ได้ */
const C="torkum-ai-page-v1";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
function iso(res){
  if(!res||res.status===0||res.type==="opaque")return res;
  const h=new Headers(res.headers);
  h.set("Cross-Origin-Opener-Policy","same-origin");
  h.set("Cross-Origin-Embedder-Policy","require-corp");
  h.set("Cross-Origin-Resource-Policy","cross-origin");
  return new Response(res.body,{status:res.status,statusText:res.statusText,headers:h});
}
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put("page",cp));}return iso(res);})
      .catch(()=>caches.open(C).then(c=>c.match("page")).then(hit=>hit?iso(hit):Response.error())));
    return;
  }
  if(u.origin===location.origin){
    if(/\.bin$/.test(u.pathname))return;               // ไฟล์โมเดล: หน้าเว็บจัดการแคชเอง
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return iso(res);})
      .catch(()=>caches.match(r).then(hit=>hit?iso(hit):Response.error())));
    return;
  }
  if(u.host==="cdn.jsdelivr.net"){
    e.respondWith(caches.open(C).then(c=>c.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res;}))));
  }
});

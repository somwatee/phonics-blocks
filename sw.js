const C="torkum-v3";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-maskable-512.png"];
const ROOT=new URL("./",self.registration.scope).pathname;
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>/^torkum-v\d+$/.test(k)&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin===location.origin&&u.pathname.startsWith(ROOT+"ai/"))return;   // หน้าทดสอบ AI มีตัวจัดการของตัวเอง
  if(r.mode==="navigate"){
    if(u.pathname!==ROOT&&u.pathname!==ROOT+"index.html")return;
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put("index.html",cp));}return res;}).catch(()=>caches.match("index.html")));return;}
  if(u.origin===location.origin||/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.host)){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})));}
});

function parseFallback(request){
  const cookie=request.headers.get('Cookie')||'';
  const m=cookie.match(/(?:^|;\s*)horizonte_fallback=([^;]+)/);
  if(!m) return null;
  try{ const x=JSON.parse(atob(decodeURIComponent(m[1]))); if(x.exp && Number(x.exp)<Date.now()) return null; return x; }catch(e){ return null; }
}
export async function getSession(request, env) {
  const cookie=request.headers.get('Cookie')||'';
  const m=cookie.match(/(?:^|;\s*)horizonte_session=([^;]+)/);
  if(m && env.DB){
    const now=Math.floor(Date.now()/1000);
    const row=await env.DB.prepare('SELECT s.user,u.name,u.role FROM sessions s JOIN users u ON u.user=s.user WHERE s.token=? AND s.expires_at>?').bind(m[1],now).first();
    if(row) return row;
  }
  return parseFallback(request);
}
export function unauthorized(){return Response.json({error:'Não autenticado.'},{status:401});}
export function forbidden(){return Response.json({error:'Acesso negado.'},{status:403});}

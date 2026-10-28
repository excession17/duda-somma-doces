import {products as defaults,type Product} from '../../src/lib/catalog.ts';
type User={id:string;email?:string;name?:string};
export type State={cart:Record<string,number>;profile:{name:string};operations:string[]};
type Storage={getWithMetadata:(key:string,options:{type:'json'})=>Promise<{data:State;etag:string}|null>;setJSON:(key:string,data:State,options:{onlyIfMatch?:string;onlyIfNew?:boolean})=>Promise<{modified:boolean}>};
const empty=():State=>({cart:{},profile:{name:''},operations:[]});
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
export async function handleStore(request:Request,user:User|null,storage:()=>Storage,products:Product[]=defaults){
 if(!['GET','POST'].includes(request.method))return json({error:'Método não permitido.'},405);
 if(request.method==='POST'){
  if(request.headers.get('origin')!==new URL(request.url).origin||request.headers.get('sec-fetch-site')==='cross-site')return json({error:'Solicitação não autorizada.'},403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Formato inválido.'},415);
 }
 if(!user)return request.method==='GET'?json({user:null,cart:{},profile:{name:''}}):json({error:'Entre novamente para salvar sua sacola.'},401);
 const key=`customers/${encodeURIComponent(user.id)}`;
 const db=storage();
 const snapshot=(state:State)=>({user:{email:user.email||'',name:user.name||null},cart:state.cart,profile:state.profile});
 if(request.method==='GET')return json(snapshot((await db.getWithMetadata(key,{type:'json'}))?.data||empty()));
 if(Number(request.headers.get('content-length')||0)>6000)return json({error:'Solicitação muito grande.'},413);
 const raw=await request.text();if(raw.length>6000)return json({error:'Solicitação muito grande.'},413);
 let body;try{body=JSON.parse(raw)}catch{return json({error:'Dados inválidos.'},400)}
 if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'Dados inválidos.'},400);
 if(body.action==='profile'){
  if(typeof body.name!=='string'||body.name.trim().length<2||body.name.trim().length>80)return json({error:'Informe um nome entre 2 e 80 caracteres.'},400);
 }else{
  if(!['change','import'].includes(body.action)||typeof body.operationId!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(body.operationId))return json({error:'Operação inválida.'},400);
  const changes=body.action==='import'?body.items:[{id:body.id,delta:body.delta}];
  if(!Array.isArray(changes)||!changes.length||changes.length>products.length||changes.some(c=>!c||!products.some(p=>p.id===c.id)||!Number.isInteger(c.delta)||c.delta===0||Math.abs(c.delta)>99||(body.action==='import'&&c.delta<1))||new Set(changes.map(c=>c.id)).size!==changes.length)return json({error:'Itens inválidos.'},400);
 }
 // Compare-and-swap keeps updates from two tabs/devices from overwriting each other.
 for(let attempt=0;attempt<8;attempt++){
  const current=await db.getWithMetadata(key,{type:'json'});const state=current?.data||empty();
  if(body.action==='profile')state.profile={name:body.name.trim()};
  else{
   if(state.operations.includes(body.operationId))return json(snapshot(state));
   // Preserve every operation ID: delayed retries must never add products twice.
   const changes=body.action==='import'?body.items:[{id:body.id,delta:body.delta}];
   for(const c of changes){const quantity=Math.min(99,Math.max(0,(state.cart[c.id]||0)+c.delta));if(quantity)state.cart[c.id]=quantity;else delete state.cart[c.id];}
   for(const p of products){const q=state.cart[p.id]||0;if(q>0&&(p.hidden||p.checkAvailability||q>(p.stock??99))&&changes.some((c:{id:number;delta:number})=>c.id===p.id&&c.delta>0))return json({error:'Quantidade indisponível no estoque.'},409);}
   state.operations.push(body.operationId);
  }
  const result=await db.setJSON(key,state,current?{onlyIfMatch:current.etag}:{onlyIfNew:true});
  if(result.modified)return json(snapshot(state));
 }
 return json({error:'Sua sacola recebeu outra atualização. Tente novamente.'},409);
}

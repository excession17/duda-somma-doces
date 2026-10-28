import {products as defaults,type Product} from '../../src/lib/catalog.ts';
export type Catalog={products:Product[]};
export type CatalogDB={get:()=>Promise<{data:Catalog;etag:string}|null>;save:(data:Catalog,etag:string|null)=>Promise<{modified:boolean}>};
export const catalogDefaults=()=>structuredClone(defaults);
export function validProduct(p:Product){
 if(!p||!Number.isSafeInteger(p.id)||p.id<1||typeof p.price!=='number'||!Number.isFinite(p.price)||p.price<0.01||p.price>100000||Math.abs(p.price*100-Math.round(p.price*100))>0.00001)return false;
 for(const [key,max] of [['name',120],['cat',80],['unit',160],['tag',60],['desc',2000]] as const)if(typeof p[key]!=='string'||p[key].length>max)return false;
 if(!p.name.trim()||!p.cat.trim()||!(p.stock===null||p.stock===undefined||(Number.isInteger(p.stock)&&p.stock>=0&&p.stock<=99999))||!(p.hidden===undefined||typeof p.hidden==='boolean'))return false;
 if(p.checkAvailability!==undefined&&typeof p.checkAvailability!=='boolean')return false;
 if(p.deal!==undefined&&!(p.deal==='bolo'&&p.price===13)&&!(p.deal==='pudim'&&p.price===8))return false;
 return p.img===null||(typeof p.img==='string'&&(/^[a-z0-9-]+$/.test(p.img)||/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p.img)&&p.img.length<=700000));
}
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
export async function handleCatalog(request:Request,owner:boolean,db:CatalogDB,adminAccess?:string){
 if(request.method==='GET'){const row=await db.get();return json({products:row?.data.products??catalogDefaults(),version:row?.etag??null,canManage:owner,...(adminAccess?{adminAccess}:{})});}
 if(request.method!=='PUT')return json({error:'Método não permitido.'},405);
 if(!owner)return json({error:'Somente a dona da loja pode editar o cardápio.'},403);
 if(request.headers.get('origin')!==new URL(request.url).origin||request.headers.get('sec-fetch-site')==='cross-site')return json({error:'Origem inválida.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Formato inválido.'},415);
 const raw=await request.text();if(raw.length>4000000)return json({error:'Fotos muito grandes. Reduza o tamanho.'},413);
 let body;try{body=JSON.parse(raw)}catch{return json({error:'Dados inválidos.'},400)}
 if(!body||!(body.version===null||typeof body.version==='string')||!Array.isArray(body.products)||body.products.length>150||!body.products.every(validProduct)||new Set(body.products.map((p:Product)=>p.id)).size!==body.products.length)return json({error:'Confira os dados dos produtos.'},400);
 const current=await db.get();if((current?.etag??null)!==body.version)return json({error:'O cardápio mudou em outra tela. Recarregue antes de editar novamente.'},409);
 // Existing IDs remain available to saved carts. Hide instead of deleting.
 if((current?.data.products??defaults).some(p=>!body.products.some((n:Product)=>n.id===p.id)))return json({error:'Oculte os produtos que deseja retirar da vitrine.'},400);
 const products=body.products.map((p:Product)=>({id:p.id,name:p.name.trim(),cat:p.cat.trim(),price:p.price,unit:p.unit,tag:p.tag,desc:p.desc,img:p.img,stock:p.stock??null,hidden:!!p.hidden,checkAvailability:!!p.checkAvailability,...(p.deal?{deal:p.deal}:{})}));
 if(!(await db.save({products},body.version)).modified)return json({error:'Outra atualização foi salva. Recarregue o painel.'},409);
 return json({ok:true});
}

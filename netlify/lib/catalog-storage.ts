import {getStore} from '@netlify/blobs';
import {catalogDefaults,type Catalog,type CatalogDB} from './catalog-core.ts';
export function catalogStorage():CatalogDB{const db=getStore({name:'duda-catalog',consistency:'strong'});return {
 async get(){const row=await db.getWithMetadata('catalog',{type:'json'});if(!row)return null;if(!row.etag)throw new Error('Missing version');return {data:row.data as Catalog,etag:row.etag};},
 save:(data,etag)=>db.setJSON('catalog',data,etag?{onlyIfMatch:etag}:{onlyIfNew:true})
};}
export async function readCatalog(){return (await catalogStorage().get())?.data.products??catalogDefaults();}

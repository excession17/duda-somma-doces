import {getUser,refreshSession} from '@netlify/identity';
import {readCatalog} from '../lib/catalog-storage';
import {getStore} from '@netlify/blobs';
import {handleStore,type State} from '../lib/store-core';

export default async(request:Request)=>{
  try{
    if(request.headers.get('cookie')?.includes('nf_refresh='))await refreshSession();
    const user=await getUser();
    const products=await readCatalog();
    return await handleStore(request,user,()=>{
      const db=getStore({name:'duda-customer-carts',consistency:'strong'});
      return {
        async getWithMetadata(key,options){
          const row=await db.getWithMetadata(key,options);
          if(!row)return null;
          if(!row.etag)throw new Error('Missing storage version');
          return {data:row.data as State,etag:row.etag};
        },
        setJSON:(key,data,options)=>db.setJSON(key,data,
          options.onlyIfMatch?{onlyIfMatch:options.onlyIfMatch}:{onlyIfNew:true}),
      };
    },products);
  }catch{
    return Response.json({error:'Não foi possível acessar sua sacola. Tente novamente.'},
      {status:503,headers:{'Cache-Control':'private, no-store'}});
  }
};

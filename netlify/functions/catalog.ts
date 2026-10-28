import {getUser,refreshSession} from '@netlify/identity';
import {handleCatalog,isOwner} from '../lib/catalog-core';
import {catalogStorage} from '../lib/catalog-storage';
export default async(request:Request)=>{try{
 if(request.headers.get('cookie')?.includes('nf_refresh='))await refreshSession();
 return await handleCatalog(request,isOwner(await getUser(),process.env.DUDA_OWNER_USER_ID),catalogStorage());
}catch{return Response.json({error:'Não foi possível acessar o cardápio. Tente novamente.'},{status:503,headers:{'Cache-Control':'no-store'}});}};

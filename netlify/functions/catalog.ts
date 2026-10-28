import {getUser,refreshSession} from '@netlify/identity';
import {handleCatalog} from '../lib/catalog-core';
import {ownerAccess} from '../lib/owner-access';
import {catalogStorage} from '../lib/catalog-storage';
export default async(request:Request)=>{try{
 if(request.headers.get('cookie')?.includes('nf_refresh='))await refreshSession();
 const access=ownerAccess(await getUser(),process.env.DUDA_OWNER_USER_ID);
 return await handleCatalog(request,access.allowed,catalogStorage(),access.status);
}catch{return Response.json({error:'Não foi possível acessar o cardápio. Tente novamente.'},{status:503,headers:{'Cache-Control':'no-store'}});}};

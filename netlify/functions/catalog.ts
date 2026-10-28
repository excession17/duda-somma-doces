import {refreshSession} from '@netlify/identity';
import {handleCatalog} from '../lib/catalog-core';
import {verifiedIdentityUser} from '../lib/identity-user';
import {ownerAccess} from '../lib/owner-access';
import {catalogStorage} from '../lib/catalog-storage';
export default async(request:Request)=>{try{
 const refreshed=request.headers.get('cookie')?.includes('nf_refresh=')?await refreshSession():null;
 const access=ownerAccess(await verifiedIdentityUser(request,refreshed),process.env.DUDA_OWNER_USER_ID);
 return await handleCatalog(request,access.allowed,catalogStorage(),access.status);
}catch{return Response.json({error:'Não foi possível acessar o cardápio. Tente novamente.'},{status:503,headers:{'Cache-Control':'no-store'}});}};

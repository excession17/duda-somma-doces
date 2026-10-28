export type VerifiedIdentityUser={id:string;confirmedAt?:string};
const identityUserURL='https://sommadoces.netlify.app/.netlify/identity/user';
function accessToken(request:Request){
 const value=request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith('nf_jwt='))?.slice(7);
 if(!value)return null;
 try{return decodeURIComponent(value)}catch{return null}
}
// Ask Identity to validate the bearer token and return the complete account.
// Decoded JWT claims and editable user_metadata are never proof of confirmation.
export async function verifiedIdentityUser(request:Request,refreshedToken?:string|null,fetcher:typeof fetch=fetch):Promise<VerifiedIdentityUser|null>{
 const token=refreshedToken||accessToken(request);
 if(!token)return null;
 const response=await fetcher(identityUserURL,{headers:{Authorization:`Bearer ${token}`},redirect:'error',signal:AbortSignal.timeout(10000)});
 if(response.status===401||response.status===403)return null;
 if(!response.ok)throw new Error('Identity verification unavailable');
 const data=await response.json();
 if(!data||typeof data.id!=='string'||!data.id)throw new Error('Invalid Identity response');
 const confirmedAt=typeof data.confirmed_at==='string'&&Number.isFinite(Date.parse(data.confirmed_at))?data.confirmed_at:undefined;
 return {id:data.id,confirmedAt};
}

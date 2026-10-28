// Authorize the immutable account ID supplied privately through Netlify.
// Never accept owner IDs or confirmation flags from request bodies or user metadata.
type User={id:string;confirmedAt?:string};
export function ownerAccess(user:User|null,configuredOwnerId:string|undefined){
 if(!user)return {allowed:false,status:'signed_out' as const};
 const ownerId=configuredOwnerId?.trim();
 if(!ownerId)return {allowed:false,status:'not_configured' as const};
 if(user.id!==ownerId)return {allowed:false,status:'account_mismatch' as const};
 if(!user.confirmedAt)return {allowed:false,status:'confirmation_unavailable' as const};
 return {allowed:true,status:'allowed' as const};
}

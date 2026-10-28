import assert from 'node:assert/strict';
import {ownerAccess} from '../netlify/lib/owner-access.ts';
import {handleCatalog,catalogDefaults} from '../netlify/lib/catalog-core.ts';
const ownerId='test-owner-id';
const owner={id:ownerId,confirmedAt:'2026-10-28T21:00:00Z'};
assert.equal(ownerAccess(null,ownerId).status,'signed_out');
assert.equal(ownerAccess(owner,undefined).status,'not_configured');
assert.equal(ownerAccess(owner,'  ').allowed,false);

assert.equal(ownerAccess({...owner,id:'other'},ownerId).status,'account_mismatch');
assert.equal(ownerAccess({...owner,confirmedAt:undefined},ownerId).status,'confirmation_unavailable');
assert.equal(ownerAccess(owner,ownerId).allowed,true);
assert.equal(ownerAccess(owner,'  '+ownerId+'  ').allowed,true);

const db={get:async()=>null,save:async()=>({modified:true})};
const r=await handleCatalog(new Request('https://shop.test/api/catalog'),true,db,'allowed');
const data=await r.json();assert.equal(data.canManage,true);assert.equal(data.adminAccess,'allowed');
const attack=new Request('https://shop.test/api/catalog',{method:'PUT',headers:{origin:'https://shop.test','Content-Type':'application/json'},body:JSON.stringify({products:catalogDefaults(),version:null,canManage:true,id:ownerId})});
assert.equal((await handleCatalog(attack,false,db,'customer')).status,403);
console.log('Administração: ID configurado, ausência de configuração, confirmação, diagnóstico e bloqueio de permissões enviadas pelo cliente verificados.');

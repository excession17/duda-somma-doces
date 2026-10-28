import {useEffect,useState} from 'react';
import {type Product} from '@/lib/catalog';
export function useCatalog(){const [products,setProducts]=useState<Product[]>([]),[version,setVersion]=useState<string|null>(null),[canManage,setCanManage]=useState(false),[error,setError]=useState(''),[ready,setReady]=useState(false);
 async function reload(){try{const r=await fetch('/api/catalog',{cache:'no-store'});const d=await r.json();if(!r.ok)throw Error(d.error);setProducts(d.products);setVersion(d.version);setCanManage(d.canManage);setReady(true);setError('');}catch{setReady(false);setError('Não foi possível atualizar o cardápio. Tente novamente.');}}
 useEffect(()=>{void reload();const refresh=()=>{if(document.visibilityState==='visible')void reload()};document.addEventListener('visibilitychange',refresh);return()=>document.removeEventListener('visibilitychange',refresh)},[]);
 return {products,version,canManage,error,ready,reload};}

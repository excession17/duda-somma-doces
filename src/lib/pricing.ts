type Item={id:number;price:number;deal?:'bolo'|'pudim'};
export function priceCart(products:Item[],cart:Record<number,number>){
 const quantity=(id:number)=>Number.isInteger(cart[id])?Math.min(99,Math.max(0,cart[id])):0;
 const subtotalCents=products.reduce((sum,p)=>sum+Math.round(p.price*100)*quantity(p.id),0);
 const offers=[{group:'bolo',label:'Bolos: 2 por R$ 25',saving:100},{group:'pudim',label:'Pudins: 2 por R$ 15',saving:100}];
 const discounts=offers.map(offer=>({label:offer.label,pairs:Math.floor(products.filter(p=>p.deal===offer.group).reduce((sum,p)=>sum+quantity(p.id),0)/2),saving:offer.saving})).filter(d=>d.pairs>0).map(d=>({label:d.label,pairs:d.pairs,amount:d.pairs*d.saving/100}));
 const discountCents=discounts.reduce((sum,d)=>sum+Math.round(d.amount*100),0);
 return {subtotal:subtotalCents/100,discount:discountCents/100,total:(subtotalCents-discountCents)/100,discounts};
}

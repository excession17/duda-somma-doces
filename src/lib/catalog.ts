export type Product={id:number;name:string;cat:string;price:number;unit:string;img:string|null;tag:string;desc:string;deal?:'bolo'|'pudim'};
export const products:Product[]=[
{id:1,name:'Bolo de cenoura no pote',cat:'Bolos no pote',price:13,unit:'1 por R$ 13 · 2 por R$ 25',img:'bolo-pote-v2',tag:'Cenoura',desc:'Bolo de cenoura servido no pote. Combine com o chocolatudo na promoção de duas unidades.',deal:'bolo'},
{id:7,name:'Bolo chocolatudo no pote',cat:'Bolos no pote',price:13,unit:'1 por R$ 13 · 2 por R$ 25',img:'bolo-pote-v2',tag:'Chocolatudo',desc:'Bolo chocolatudo servido no pote. Combine com o de cenoura na promoção de duas unidades.',deal:'bolo'},
{id:2,name:'Copo da felicidade de uva',cat:'Copos da felicidade',price:12,unit:'Unidade · uva',img:'copos-felicidade-v2',tag:'Com uva',desc:'Brigadeiro cremoso de leite Ninho com uvas verdes sem sementes, ganache de chocolate e granulado.'},
{id:8,name:'Copo da felicidade de morango',cat:'Copos da felicidade',price:12,unit:'Unidade · morango',img:'copos-felicidade-v2',tag:'Com morango',desc:'Copo da felicidade na versão de morango.'},
{id:3,name:'Pudim de leite Ninho',cat:'Pudins',price:8,unit:'1 por R$ 8 · 2 por R$ 15',img:'pudim-ninho-v2',tag:'Leite Ninho',desc:'Pudim cremoso de leite Ninho com calda de caramelo.',deal:'pudim'},
{id:4,name:'Caixinha com 4 brigadeiros',cat:'Caixinhas',price:15,unit:'4 brigadeiros · sabores à escolha',img:'caixinha',tag:'Monte sua caixinha',desc:'Caixinha com quatro brigadeiros. Informe os sabores de sua preferência nas observações do pedido.'},
{id:5,name:'Morango cravejado',cat:'Bombons',price:15,unit:'Unidade',img:'bombom-cravejado',tag:'Cravejado',desc:'Morango cravejado da Duda Somma Doces.'},
{id:6,name:'Bombom de morango',cat:'Bombons',price:10,unit:'Unidade',img:'bombom-morango',tag:'Com morango',desc:'Bombom de morango com cobertura de chocolate.'},
{id:9,name:'Bombom de uva',cat:'Bombons',price:10,unit:'Unidade',img:null,tag:'Com uva',desc:'Bombom de uva da Duda Somma Doces.'}
];
export const cats=['Todos os doces','Bolos no pote','Copos da felicidade','Pudins','Caixinhas','Bombons'];

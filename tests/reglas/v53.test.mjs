import {initializeTestEnvironment} from '@firebase/rules-unit-testing';
import {doc,setDoc,getDoc,updateDoc,deleteDoc,getDocs,collection} from 'firebase/firestore';import fs from 'fs';import crypto from 'crypto';
// v53: inventario de mueblería: pedidos por encargo en fer/<uid>/pedidos/<id>, con los mismos permisos que productos, dias y sys.
const now=Date.now(),h=s=>crypto.createHash('sha256').update(s).digest('hex');
const env=await initializeTestEnvironment({projectId:'demo-qhep53',firestore:{rules:fs.readFileSync(process.env.RULES,'utf8'),host:'127.0.0.1',port:8089}});
await env.clearFirestore();
const ctx=(uid,tok)=>env.authenticatedContext(uid,tok).firestore();
const pw=(email,ver=true)=>({email,email_verified:ver,firebase:{sign_in_provider:'password'}});
const A=ctx('uA',pw('a@x.co'));                       // Comerciante vigente
const B=ctx('uB',pw('b@x.co'));                       // Comerciante vencido
const D=ctx('uD',{email:'d@x.co',email_verified:true,firebase:{sign_in_provider:'google.com'}}); // sin rol
const ADM=ctx('KUowZZ25CePVc9IXGmhCLVbbSIB3',pw('admin@x.co'));
const ANON=env.unauthenticatedContext().firestore();
await env.withSecurityRulesDisabled(async c=>{const f=c.firestore();
  await setDoc(doc(f,'plans/'+h('mail:a@x.co')),{k:h('mail:a@x.co'),uid:'uA',email:'a@x.co',plan:'free',acc:{merc:now+30*864e5}});
  await setDoc(doc(f,'plans/'+h('mail:b@x.co')),{k:h('mail:b@x.co'),uid:'uB',email:'b@x.co',plan:'free',acc:{merc:now-864e5}});
  await setDoc(doc(f,'fer/uB/pedidos/o1'),{num:1,cliente:'Ana',total:900000,estado:'fabricar'});
});
const out=[];const t=async(n,want,fn)=>{let ok;try{await fn();ok=true}catch(e){ok=false}out.push([n,ok,want])};
const ped={num:1,cliente:'Juan Pérez',cel:'3001234567',dir:'Calle 10 # 5-20',fecha:'2026-12-15',origen:'encargo',items:[{pid:'m1',nombre:'Sofá Milán',m:'',c:'Gris',cant:1,precio:1290000}],total:1290000,abonos:[{t:'2026-11-28T10:00:00Z',v:500000,nota:'Abono inicial'}],estado:'fabricar',nota:'',descontado:false,creado:'x',actualizado:'x'};
const mue={tipo:'mue',nombre:'Colchón Orthopack',categoria:'Colchones de una cara',medidas:['Doble 140 x 190','King 200 x 200'],colores:[],precios:[{m:'King 200 x 200',p:1990000}],vars:[{m:'Doble 140 x 190',c:'',s:3},{m:'King 200 x 200',c:'',s:0}],stock:3,precio:1311000,antes:0,enc:false,dias:0,oculto:false,fotos:[]};
await t('Comerciante registra un pedido',true,()=>setDoc(doc(A,'fer/uA/pedidos/o1'),ped));
await t('Comerciante lee sus pedidos',true,()=>getDocs(collection(A,'fer/uA/pedidos')));
await t('Comerciante registra un abono y cambia el estado',true,()=>updateDoc(doc(A,'fer/uA/pedidos/o1'),{estado:'listo',abonos:[...ped.abonos,{t:'y',v:790000,nota:''}]}));
await t('Comerciante borra un pedido',true,()=>deleteDoc(doc(A,'fer/uA/pedidos/o1')));
await t('Comerciante guarda la ficha de un mueble con medidas y colores',true,()=>setDoc(doc(A,'fer/uA/productos/m1'),mue));
await t('Pedido de otra persona: no se escribe',false,()=>setDoc(doc(A,'fer/uB/pedidos/o2'),ped));
await t('Pedido de otra persona: no se lee',false,()=>getDoc(doc(A,'fer/uB/pedidos/o1')));
await t('Sin sesión no se leen pedidos',false,()=>getDoc(doc(ANON,'fer/uB/pedidos/o1')));
await t('Rol vencido: ve sus pedidos',true,()=>getDoc(doc(B,'fer/uB/pedidos/o1')));
await t('Rol vencido: no los cambia',false,()=>updateDoc(doc(B,'fer/uB/pedidos/o1'),{estado:'listo'}));
await t('Sin el rol Comerciante: no registra pedidos',false,()=>setDoc(doc(D,'fer/uD/pedidos/o1'),ped));
await t('Pedido con más de 40 campos: rechazado',false,()=>setDoc(doc(A,'fer/uA/pedidos/o3'),Object.fromEntries(Array.from({length:41},(_,i)=>['k'+i,i]))));
await t('Administrador lee un pedido',true,()=>getDoc(doc(ADM,'fer/uB/pedidos/o1')));
await t('Sigue rechazada una colección que no es del inventario',false,()=>setDoc(doc(A,'fer/uA/clientes/x'),{a:1}));
fs.writeFileSync(process.env.OUT,JSON.stringify(out));await env.cleanup();

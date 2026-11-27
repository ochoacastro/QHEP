import {initializeTestEnvironment} from '@firebase/rules-unit-testing';
import {doc,setDoc,getDoc,updateDoc,deleteDoc,collectionGroup,getDocs} from 'firebase/firestore';import fs from 'fs';import crypto from 'crypto';
// v52: inventario de ferretería (fer/<uid>/... privado y ferPub/<uid> público). Escribir pide el rol Comerciante vigente.
const now=Date.now(),h=s=>crypto.createHash('sha256').update(s).digest('hex');
const env=await initializeTestEnvironment({projectId:'demo-qhep52',firestore:{rules:fs.readFileSync(process.env.RULES,'utf8'),host:'127.0.0.1',port:8089}});
await env.clearFirestore();
const ctx=(uid,tok)=>env.authenticatedContext(uid,tok).firestore();
const pw=(email,ver=true)=>({email,email_verified:ver,firebase:{sign_in_provider:'password'}});
const A=ctx('uA',pw('a@x.co'));                       // Comerciante vigente (merc)
const B=ctx('uB',pw('b@x.co'));                       // Comerciante vencido
const C=ctx('uC',pw('3001112233@cel.qhep.app'));      // cuenta por celular con «Comerciante · Un negocio» (merc1)
const D=ctx('uD',{email:'d@x.co',email_verified:true,firebase:{sign_in_provider:'google.com'}}); // sin rol
const N=ctx('uN',pw('a2@x.co',false));                // correo sin verificar (su ficha tiene rol)
const ADM=ctx('KUowZZ25CePVc9IXGmhCLVbbSIB3',pw('admin@x.co'));
const ANON=env.unauthenticatedContext().firestore();
await env.withSecurityRulesDisabled(async c=>{const f=c.firestore();
  await setDoc(doc(f,'plans/'+h('mail:a@x.co')),{k:h('mail:a@x.co'),uid:'uA',email:'a@x.co',plan:'free',acc:{merc:now+30*864e5}});
  await setDoc(doc(f,'plans/'+h('mail:b@x.co')),{k:h('mail:b@x.co'),uid:'uB',email:'b@x.co',plan:'free',acc:{merc:now-864e5}});
  await setDoc(doc(f,'plans/'+h('wa:3001112233')),{k:h('wa:3001112233'),uid:'uC',plan:'free',acc:{merc1:now+30*864e5}});
  await setDoc(doc(f,'plans/'+h('mail:a2@x.co')),{k:h('mail:a2@x.co'),uid:'uN',plan:'free',acc:{merc:now+30*864e5}});
  await setDoc(doc(f,'plans/'+h('mail:d@x.co')),{k:h('mail:d@x.co'),uid:'uD',plan:'free',acc:{home:now+30*864e5}});
  await setDoc(doc(f,'fer/uB/productos/p1'),{nombre:'Martillo',stock:3});
});
const out=[];const t=async(n,want,fn)=>{let ok;try{await fn();ok=true}catch(e){ok=false}out.push([n,ok,want])};
const pr={codigo:'HMA-001',nombre:'Martillo',categoria:'Herramientas',unidad:'und',stock:5,minimo:2,costo:12000,precio:18000};
const pub={nombre:'Ferretería A',tema:'amarillo',whatsapp:'573001234567',direccion:'',ciudad:'',horario:'',domicilio:false,bienvenida:'',url:'https://mipradera.com.co/ferreteria?t=uA',ejemplo:false,productos:[{id:'p1',nombre:'Martillo',categoria:'',unidad:'und',precio:18000,disp:'ok',foto:''}],publicado:new Date().toISOString()};
await t('Comerciante crea un producto en su inventario',true,()=>setDoc(doc(A,'fer/uA/productos/p1'),pr));
await t('Comerciante lee su producto',true,()=>getDoc(doc(A,'fer/uA/productos/p1')));
await t('Comerciante cambia existencias',true,()=>updateDoc(doc(A,'fer/uA/productos/p1'),{stock:4}));
await t('Comerciante guarda el día de movimientos',true,()=>setDoc(doc(A,'fer/uA/dias/2026-11-27'),{dia:'2026-11-27',items:[{id:'m1',tipo:'salida',cant:1}]}));
await t('Comerciante guarda config, patrón y turno (sys)',true,async()=>{await setDoc(doc(A,'fer/uA/sys/config'),{nombre:'Ferretería A'});await setDoc(doc(A,'fer/uA/sys/acceso'),{hash:'x',salt:'y',iter:150000});await setDoc(doc(A,'fer/uA/sys/lock'),{holder:'t1',exp:now+5000})});
await t('Comerciante borra un día de movimientos',true,()=>deleteDoc(doc(A,'fer/uA/dias/2026-11-27')));
await t('Colección que no es del inventario: rechazada',false,()=>setDoc(doc(A,'fer/uA/otra/x'),{a:1}));
await t('Escribir en el inventario de otra persona: rechazado',false,()=>setDoc(doc(A,'fer/uB/productos/p9'),pr));
await t('Leer el inventario de otra persona: rechazado',false,()=>getDoc(doc(A,'fer/uB/productos/p1')));
await t('Sin sesión no se lee un inventario',false,()=>getDoc(doc(ANON,'fer/uA/productos/p1')));
await t('Rol vencido: lee su inventario',true,()=>getDoc(doc(B,'fer/uB/productos/p1')));
await t('Rol vencido: no lo cambia',false,()=>updateDoc(doc(B,'fer/uB/productos/p1'),{stock:9}));
await t('Cuenta por celular con Comerciante · Un negocio escribe',true,()=>setDoc(doc(C,'fer/uC/productos/p1'),pr));
await t('Cuenta sin el rol Comerciante (otro rol): rechazada',false,()=>setDoc(doc(D,'fer/uD/productos/p1'),pr));
await t('Correo sin verificar: rechazado aunque su ficha tenga rol',false,()=>setDoc(doc(N,'fer/uN/productos/p1'),pr));
await t('Administrador lee un inventario',true,()=>getDoc(doc(ADM,'fer/uA/productos/p1')));
await t('Administrador corrige un inventario',true,()=>updateDoc(doc(ADM,'fer/uA/productos/p1'),{stock:6}));
await t('Administrador lista los productos de todas las ferreterías',true,()=>getDocs(collectionGroup(ADM,'productos')));
await t('Un comerciante no lista los de todas las ferreterías',false,()=>getDocs(collectionGroup(A,'productos')));
await t('Comerciante publica su catálogo',true,()=>setDoc(doc(A,'ferPub/uA'),pub));
await t('Cualquiera, sin sesión, ve el catálogo',true,()=>getDoc(doc(ANON,'ferPub/uA')));
await t('Catálogo con un campo de más: rechazado',false,()=>setDoc(doc(A,'ferPub/uA'),{...pub,hack:true}));
await t('Publicar el catálogo de otra persona: rechazado',false,()=>setDoc(doc(A,'ferPub/uB'),pub));
await t('Rol vencido: no publica',false,()=>setDoc(doc(B,'ferPub/uB'),pub));
await t('Sin sesión no se publica',false,()=>setDoc(doc(ANON,'ferPub/uA'),pub));
await t('La persona quita su catálogo',true,()=>deleteDoc(doc(A,'ferPub/uA')));
fs.writeFileSync(process.env.OUT,JSON.stringify(out));await env.cleanup();

import {initializeTestEnvironment} from '@firebase/rules-unit-testing';
import {doc,setDoc} from 'firebase/firestore';import fs from 'fs';
// v51: los pedidos aceptan el medio de pago 'siste' (Sistecrédito).
const now=Date.now();
const env=await initializeTestEnvironment({projectId:'demo-qhep51',firestore:{rules:fs.readFileSync(process.env.RULES,'utf8'),host:'127.0.0.1',port:8089}});
await env.clearFirestore();
const C=env.authenticatedContext('uC',{email:'c@x.co',email_verified:true,firebase:{sign_in_provider:'password'}}).firestore();
await env.withSecurityRulesDisabled(async c=>{await setDoc(doc(c.firestore(),'stores/s1'),{id:'s1',name:'Tienda',ownerUid:'uT',ownerKey:'kT',pexp:now+30*864e5})});
const out=[];const t=async(n,want,fn)=>{let ok;try{await fn();ok=true}catch(e){ok=false}out.push([n,ok,want])};
const pd=x=>({sid:'s1',sname:'Tienda',to:'uT',from:'uC',fromName:'Ana',fromWa:'3001234567',items:[{n:'Pan',q:2,p:1000}],total:2000,pay:'cash',note:'Casa 5',st:'nuevo',pst:'pend',ts:now,...x});
await t('Pedido con Sistecrédito',true,()=>setDoc(doc(C,'pedidos/p1'),pd({pay:'siste'})));
await t('Pedido con efectivo sigue igual',true,()=>setDoc(doc(C,'pedidos/p2'),pd()));
await t('Medio de pago raro sigue rechazado',false,()=>setDoc(doc(C,'pedidos/p3'),pd({pay:'sistecredito'})));
fs.writeFileSync(process.env.OUT,JSON.stringify(out));await env.cleanup();

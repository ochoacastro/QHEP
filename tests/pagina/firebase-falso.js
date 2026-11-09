(function(){
const docs=Object.assign({},window.__seed||{}),docL={},colL={};
function snapDoc(path,fc){const d=docs[path];return {exists:!!d,id:path.split('/').pop(),ref:docRef0(path),data:()=>d,metadata:{fromCache:!!fc,hasPendingWrites:false}}}
function snapCol(c){const l=Object.keys(docs).filter(p=>p.startsWith(c+'/')&&p.split('/').length===c.split('/').length+1).map(p=>snapDoc(p));return {forEach:f=>l.forEach(f),docs:l,size:l.length,empty:!l.length,docChanges:()=>[],metadata:{fromCache:false}}}
function notify(path,fc){(docL[path]||[]).forEach(cb=>cb(snapDoc(path,fc)));const c=path.slice(0,path.lastIndexOf('/'));(colL[c]||[]).forEach(cb=>cb(snapCol(c)))}
function docRef0(path){return docRef(path.slice(0,path.lastIndexOf('/')),path.split('/').pop())}
function docRef(c,id){const path=c+'/'+id;return {id,path,
 get:async(o)=>{window.__gets=(window.__gets||0)+1;return snapDoc(path)},set:async(d,o)=>{docs[path]=o&&o.merge?Object.assign({},docs[path],d):d;notify(path)},update:async d=>{if(!docs[path])throw{code:'not-found'};Object.assign(docs[path],d);notify(path)},delete:async()=>{delete docs[path];notify(path)},
 onSnapshot:(cb,eb)=>{(docL[path]=docL[path]||[]).push(cb);setTimeout(()=>cb(snapDoc(path)),0);return ()=>{docL[path]=(docL[path]||[]).filter(x=>x!==cb)}},
 collection:(sub)=>col(path+'/'+sub)}}
function col(c){const q={doc:id=>docRef(c,id||('a'+Math.random().toString(36).slice(2))),add:async d=>{const r=docRef(c,'a'+Math.random().toString(36).slice(2));await r.set(d);return r},
 onSnapshot:(cb)=>{(colL[c]=colL[c]||[]).push(cb);setTimeout(()=>cb(snapCol(c)),0);return ()=>{colL[c]=(colL[c]||[]).filter(x=>x!==cb)}},get:async()=>snapCol(c),where:()=>q,orderBy:()=>q,limit:()=>q,startAfter:()=>q};return q}
const db={collection:col,doc:p=>docRef0(p),enablePersistence:()=>Promise.resolve(),runTransaction:async f=>f({get:r=>r.get(),set:(r,d,o)=>r.set(d,o),update:(r,d)=>r.update(d),delete:r=>r.delete()}),batch:()=>{const ops=[];return {set:(r,d,o)=>ops.push(()=>r.set(d,o)),update:(r,d)=>ops.push(()=>r.update(d)),delete:r=>ops.push(()=>r.delete()),commit:async()=>{for(const o of ops)await o()}}}};
const cbs=[];const auth={currentUser:window.__authUser||null,onAuthStateChanged:cb=>{cbs.push(cb);setTimeout(()=>cb(auth.currentUser),0);return ()=>{}},signInAnonymously:async()=>{auth.currentUser={uid:'anon',isAnonymous:true};cbs.forEach(c=>c(auth.currentUser))},signOut:async()=>{window.__signedOut=(window.__signedOut||0)+1;auth.currentUser=null;cbs.forEach(c=>c(null))},signInWithEmailAndPassword:async()=>({user:auth.currentUser}),onIdTokenChanged:()=>()=>{}};
window.firebase={initializeApp:()=>({}),apps:[],firestore:Object.assign(()=>db,{FieldValue:{serverTimestamp:()=>Date.now(),increment:n=>n,arrayUnion:(...a)=>a,arrayRemove:()=>[],delete:()=>undefined},FieldPath:{documentId:()=>'__id'}}),auth:Object.assign(()=>auth,{})};
window.__fake={docs,notify,auth,db,silentDel:p=>{delete docs[p]}};
})();

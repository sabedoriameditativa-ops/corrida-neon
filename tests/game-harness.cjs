// Deterministic logic harness: fake DOM/canvas/storage. NOT a browser gameplay run.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function createGame(sourcePath='../index.html') {
 const html=fs.readFileSync(path.join(__dirname,sourcePath),'utf8');
 const code=html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i)[1];
 const nodes=new Map(),winEvents={},docEvents={},storage=new Map();
 const noop=()=>{};
 const ctx2d=new Proxy({measureText:s=>({width:String(s).length*8}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>k in o?o[k]:noop});
 function node(id='') {
  const classes=new Set();
  const n={id,tagName:'DIV',textContent:'',innerHTML:'',value:'',style:{setProperty:noop},dataset:{},attributes:{},children:[],hidden:false,disabled:false,
   classList:{add:(...v)=>v.forEach(x=>classes.add(x)),remove:(...v)=>v.forEach(x=>classes.delete(x)),contains:x=>classes.has(x),toggle:(x,on)=>{if(on===undefined)on=!classes.has(x);on?classes.add(x):classes.delete(x);return on;}},
   setAttribute(k,v){this.attributes[k]=String(v);if(k.startsWith('data-'))this.dataset[k.slice(5)]=String(v);},getAttribute(k){return this.attributes[k]??null;},
   removeAttribute(k){delete this.attributes[k];},append(...v){this.children.push(...v);},appendChild(v){this.children.push(v);return v;},replaceChildren(...v){this.children=v;},
   addEventListener:noop,removeEventListener:noop,querySelector:()=>null,querySelectorAll:()=>[],getBoundingClientRect:()=>({x:0,y:0,top:0,left:0,right:480,bottom:640,width:480,height:640}),
   getContext:()=>ctx2d,focus:noop,blur:noop,scrollIntoView:noop,setPointerCapture:noop,releasePointerCapture:noop,hasPointerCapture:()=>false};
  return n;
 }
 for(const m of html.matchAll(/\bid=["']([^"']+)["']/g))nodes.set(m[1],node(m[1]));
 const body=node('body');body.tagName='BODY';
 const document={body,documentElement:node(),hidden:false,activeElement:body,getElementById:id=>{if(!nodes.has(id))nodes.set(id,node(id));return nodes.get(id);},createElement:tag=>{const n=node();n.tagName=tag.toUpperCase();return n;},querySelector:sel=>/^#[\w-]+$/.test(sel)?nodes.get(sel.slice(1)):null,querySelectorAll:()=>[],addEventListener:(type,fn)=>(docEvents[type]??=[]).push(fn)};
 const window={innerWidth:1280,innerHeight:800,devicePixelRatio:1,addEventListener:(type,fn)=>(winEvents[type]??=[]).push(fn),scrollTo:noop,matchMedia:()=>({matches:false,addEventListener:noop}),visualViewport:{height:800,addEventListener:noop}};
 let clock=1000,seed=12345;
 const seededMath=Object.create(Math);seededMath.random=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
 const sandbox={window,document,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)},performance:{now:()=>clock},requestAnimationFrame:noop,cancelAnimationFrame:noop,matchMedia:window.matchMedia,ResizeObserver:class{observe(){}},navigator:{},console,Math:seededMath,Date,Set,Map,JSON,Number,String,Array,Object,Boolean,Infinity,parseInt,parseFloat,isFinite,setTimeout:noop,clearTimeout:noop};
 window.document=document;const context=vm.createContext(sandbox);vm.runInContext(code,context,{timeout:2000});
 return {nodes,storage,context,run:s=>vm.runInContext(s,context,{timeout:2000}),advance:seconds=>{clock+=seconds*1000;vm.runInContext(`for(let qaT=0;qaT<${seconds};qaT+=1/60)tick(1/60)`,context,{timeout:2000});},key:(code,extra={})=>{const e={code,target:body,repeat:false,preventDefault:noop,...extra};for(const f of winEvents.keydown??[])f(e);},keyup:code=>{for(const f of winEvents.keyup??[])f({code});},blur:()=>{for(const f of winEvents.blur??[])f();},visibility:hidden=>{document.hidden=hidden;for(const f of docEvents.visibilitychange??[])f();}};
}
module.exports={createGame};
if(require.main===module){const g=createGame();console.log(g.run('({state,lane,best,gameMode})'));}

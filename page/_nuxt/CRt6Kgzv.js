import{q as y}from"./DboLrS-p.js";import{f as h,r,g as k,o as V,c as b,b as l,w as s,u as t,F as w,a as F,H as f,D as p,Z as x,h as C,E as B,i as D}from"./-5gcj2zS.js";import"./CPjQGjmr.js";const E=F("h1",null,"Hangoskönyvek",-1),U=h({__name:"index",setup(H){const d=r([{}]),n=r(1),u=r(100),c=r(50),i=r(""),m=[{key:"title",sortable:!0},{key:"author",sortable:!0}];async function g(){try{y("/full_list").findOne().then(a=>{let e=a.body;e.sort((o,_)=>o.title.localeCompare(_.title)),u.value=e.length,d.value=e})}catch(a){console.log(a)}}k(()=>{g()});function v(a){u.value=a.length}return(a,e)=>(V(),b(w,null,[E,l(t(D),null,{default:s(()=>[l(t(f),null,{default:s(()=>[l(t(p),null,{default:s(()=>[l(t(x),{modelValue:i.value,"onUpdate:modelValue":e[0]||(e[0]=o=>i.value=o),placeholder:"Keresés"},null,8,["modelValue"])]),_:1})]),_:1}),l(t(C),{"sort-by":[{key:"author",order:"asc"}],"sort-internal":!0,items:d.value,fields:m,filter:i.value,"per-page":c.value,"current-page":n.value,onFiltered:v},null,8,["items","filter","per-page","current-page"]),l(t(f),null,{default:s(()=>[l(t(p),null,{default:s(()=>[l(t(B),{modelValue:n.value,"onUpdate:modelValue":e[1]||(e[1]=o=>n.value=o),"total-rows":u.value,"per-page":c.value,align:"fill",size:"sm",class:"my-0"},null,8,["modelValue","total-rows","per-page"])]),_:1})]),_:1})]),_:1})],64))}});export{U as default};

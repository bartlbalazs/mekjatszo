import{f as k,r as l,h as _,o as w,c as y,b as a,w as o,u as t,y as V,F as z,a as x,H as p,D as m,Z as F,z as R,E as C,A as L}from"./0GUZhBaH.js";import{a as c}from"./C8DqakIB.js";const U=x("h1",null,"Hangoskönyvek",-1),H=k({__name:"index",setup(B){const d=l([{}]),n=l(1),r=l(100),f=l(50),u=l(""),g=[{key:"title",sortable:!0,label:"Cím"},{key:"author",sortable:!0,label:"Szerző"}];async function b(){try{window.location.href.startsWith("http://localhost")?c.defaults.baseURL="http://localhost:3000":c.defaults.baseURL="https://bartlbalazs.github.io/mekjatszo/";const e=await c.get("/static/full_list.json");e.data&&(r.value=e.data.length,d.value=e.data)}catch(e){console.log(e)}}_(()=>{b()});function h(e){r.value=e.length}async function v(e){await L("/books/"+e.id)}return(e,s)=>(w(),y(z,null,[U,a(t(V),null,{default:o(()=>[a(t(p),null,{default:o(()=>[a(t(m),null,{default:o(()=>[a(t(F),{modelValue:u.value,"onUpdate:modelValue":s[0]||(s[0]=i=>u.value=i),placeholder:"Keresés"},null,8,["modelValue"])]),_:1})]),_:1}),a(t(R),{"sort-by":[{key:"title",order:"asc"}],"sort-internal":!0,items:d.value,fields:g,filter:u.value,"per-page":f.value,"current-page":n.value,onFiltered:h,"select-mode":"single",ref:"selectableTable",selectable:"",onRowClicked:v},null,8,["items","filter","per-page","current-page"]),a(t(p),null,{default:o(()=>[a(t(m),null,{default:o(()=>[a(t(C),{modelValue:n.value,"onUpdate:modelValue":s[1]||(s[1]=i=>n.value=i),"total-rows":r.value,"per-page":f.value,align:"fill",size:"sm",class:"my-0"},null,8,["modelValue","total-rows","per-page"])]),_:1})]),_:1})]),_:1})],64))}});export{H as default};

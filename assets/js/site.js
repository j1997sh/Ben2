
(function(){
  const AREAS = window.BEN_CAMPAIGN_AREAS || {};
  const postcodeMap = [
    [/^CW1|^CW2/i,"crewe"]
  ];
  const localData = {
    crewe:{
      name:"Crewe",
      story:["What Ben is hearing in Crewe","Growth, infrastructure and what local people want from the new mayor.","assets/images/crewe-hero.jpg","journeys/crewe-story.html"],
      campaign:["Better transport for Crewe","Better bus connections, tackling bottlenecks and backing Crewe’s role as a gateway for the region.","assets/images/crewe-hero.jpg","better-transport.html?area=crewe&issue=transport"],
      event:["Crewe Town Centre Walkabout","25 September · 10:30am · Market Square, Crewe","assets/images/ben-events-hero.jpg","events.html?area=crewe"]
    }
  };

  function resolveArea(value){
    if(!value) return "";
    const v=value.trim();
    if(AREAS[v]) return v;
    for(const [rx,key] of postcodeMap){ if(rx.test(v)) return key; }
    if(v.toLowerCase().includes("crewe")) return "crewe";
    return "";
  }
  function getArea(){
    const q=new URLSearchParams(location.search).get("area");
    if(q && AREAS[q]) return q;
    try{return sessionStorage.getItem("benArea") || localStorage.getItem("benArea") || ""}catch(e){return ""}
  }
  function setArea(area, persistent){
    if(!AREAS[area]) return;
    try{
      sessionStorage.setItem("benArea",area);
      if(persistent) localStorage.setItem("benArea",area);
    }catch(e){}
    applyArea(area);
  }
  function clearArea(){
    try{sessionStorage.removeItem("benArea");localStorage.removeItem("benArea")}catch(e){}
    const u=new URL(location.href);u.searchParams.delete("area");location.href=u.pathname+(u.search||"");
  }
  function captureSource(){
    const p=new URLSearchParams(location.search);
    const keys=["utm_source","utm_medium","utm_campaign","utm_content","utm_term","issue"];
    const data={}; keys.forEach(k=>{if(p.get(k))data[k]=p.get(k)});
    if(Object.keys(data).length) try{sessionStorage.setItem("benSource",JSON.stringify(data))}catch(e){}
  }
  function applyArea(key){
    const a=AREAS[key]; if(!a) return;
    document.documentElement.dataset.area=key;
    const status=document.getElementById("localStatus");
    const name=document.getElementById("localStatusName");
    if(status&&name){name.textContent=a.name;status.classList.add("visible")}
    document.querySelectorAll("[data-area-name]").forEach(el=>el.textContent=a.name);
    document.querySelectorAll("[data-area-copy]").forEach(el=>el.textContent=(el.dataset.areaCopy||"").replace(/\{area\}/g,a.name));
    const block=document.getElementById("homeLocalBlock");
    const data=localData[key];
    if(block&&data){
      block.classList.add("visible");
      const ids = {
        localStoryTitle:data.story[0],localStoryText:data.story[1],
        localCampaignTitle:data.campaign[0],localCampaignText:data.campaign[1],
        localEventTitle:data.event[0],localEventText:data.event[1]
      };
      Object.entries(ids).forEach(([id,val])=>{const e=document.getElementById(id);if(e)e.textContent=val});
      [["localStoryImage",data.story[2]],["localCampaignImage",data.campaign[2]],["localEventImage",data.event[2]]].forEach(([id,val])=>{const e=document.getElementById(id);if(e)e.style.backgroundImage=`url("${val}")`});
      [["localStoryLink",data.story[3]],["localCampaignLink",data.campaign[3]],["localEventLink",data.event[3]]].forEach(([id,val])=>{const e=document.getElementById(id);if(e)e.href=val});
    }
    const areaHub=document.getElementById("areaHub");
    if(areaHub){
      const generic=document.getElementById("areaGeneric");
      if(generic) generic.style.display="none";
      areaHub.style.display="block";
      const h=document.getElementById("areaHubTitle"); if(h) h.textContent=`Ben in ${a.name}`;
      const p=document.getElementById("areaHubIntro"); if(p) p.textContent=a.heroSupport || `Local campaign updates for ${a.name}.`;
    }
    decorateLinks(key);
  }
  function decorateLinks(area){
    document.querySelectorAll('a[href]').forEach(a=>{
      const raw=a.getAttribute("href");
      if(!raw||raw.startsWith("#")||raw.startsWith("mailto:")||raw.startsWith("tel:")||/^https?:/i.test(raw))return;
      if(!/(plan|news|events|tell-ben|area|business|volunteer|journeys)/.test(raw))return;
      try{
        const u=new URL(raw,location.href);
        if(area&&!u.searchParams.has("area"))u.searchParams.set("area",area);
        a.href=u.pathname.split("/").slice(-2).join("/") + u.search + u.hash;
      }catch(e){}
    });
  }
  function initAreaForms(){
    document.querySelectorAll("[data-area-form]").forEach(form=>{
      form.addEventListener("submit",e=>{
        e.preventDefault();
        const input=form.querySelector("input");
        const area=resolveArea(input?.value||"");
        if(!area){if(input){input.value="";input.placeholder="Try CW1 2AB";input.focus()}return}
        setArea(area,true);
        if(document.body.dataset.page==="area"){
          const u=new URL(location.href);u.searchParams.set("area",area);location.href=u.toString();
        }
      });
    });
  }
  function initForms(){
    document.querySelectorAll("form[data-demo-form]").forEach(form=>{
      form.addEventListener("submit",e=>{
        e.preventDefault();
        const pc=form.querySelector('[name="postcode"]');
        if(pc){const area=resolveArea(pc.value); if(area)setArea(area,true)}
        try{
          const source=JSON.parse(sessionStorage.getItem("benSource")||"{}");
          sessionStorage.setItem("lastBenAction",JSON.stringify({type:form.dataset.demoForm,source,area:getArea()}));
        }catch(e){}
        location.href=(form.dataset.thanks||"thanks.html");
      });
    });
  }
  function initChips(){
    document.querySelectorAll(".action-chip").forEach(btn=>btn.addEventListener("click",()=>btn.classList.toggle("selected")));
  }
  function initMobile(){
    const b=document.getElementById("menuButton"),m=document.getElementById("mobileNav");
    if(!b||!m)return;
    b.addEventListener("click",()=>{const o=m.classList.toggle("open");b.setAttribute("aria-expanded",o?"true":"false");b.textContent=o?"Close":"Menu"});
  }
  captureSource();
  initMobile();
  initAreaForms();
  initForms();
  initChips();
  const area=getArea(); if(area&&AREAS[area])applyArea(area);
  document.getElementById("clearArea")?.addEventListener("click",clearArea);
})();

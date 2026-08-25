
(function(){
  const AREAS = window.BEN_CAMPAIGN_AREAS || {};
  const postcodeMap = Object.keys(AREAS).filter(k=>k!=="regional").flatMap(function(key){
    return (AREAS[key].postcodePrefixes || []).map(function(prefix){
      return [new RegExp("^"+prefix,"i"), key];
    });
  });
  const localData = {
  "crewe": {
    "name": "Crewe",
    "story": [
      "Crewe’s transport links must work for local people",
      "Ben sets out why buses, roads and rail need to be planned together around everyday journeys.",
      "assets/images/crewe-hero.jpg",
      "area.html?area=crewe"
    ],
    "campaign": [
      "Fix Crewe’s transport bottlenecks",
      "A local campaign for better junctions, bus reliability and stronger connections.",
      "better-transport.html?area=crewe&issue=transport",
      "assets/images/ben-home-intro.jpg"
    ],
    "event": [
      "Crewe Town Centre Walkabout",
      "25 September · 10:30am · Market Square",
      "assets/images/crewe-hero.jpg",
      "events.html?area=crewe"
    ]
  },
  "chester": {
    "name": "Chester",
    "story": [
      "Ben meets city-centre businesses in Chester",
      "Retail, tourism and footfall are at the heart of a discussion about the future of the city centre.",
      "assets/images/ben-about-hero.jpg",
      "area.html?area=chester"
    ],
    "campaign": [
      "Protect Chester’s city-centre vitality",
      "Back local businesses, tourism and a stronger plan for the city centre.",
      "stronger-economy.html?area=chester&issue=economy",
      "assets/images/ben-area.jpg"
    ],
    "event": [
      "Chester: Homes, Towns & Opportunity",
      "2 October · 7:00pm · Chester",
      "assets/images/ben-about-hero.jpg",
      "events.html?area=chester"
    ]
  },
  "warrington": {
    "name": "Warrington",
    "story": [
      "What Warrington businesses want from the new mayor",
      "Employers highlight congestion, skills and the need for faster infrastructure delivery.",
      "assets/images/ben-experience-hero.jpg",
      "area.html?area=warrington"
    ],
    "campaign": [
      "Cut Warrington congestion",
      "Target the junctions and corridors that waste residents’ and businesses’ time.",
      "better-transport.html?area=warrington&issue=transport",
      "assets/images/ben-plan-hero.jpg"
    ],
    "event": [
      "Warrington Business Breakfast",
      "28 September · 8:00am · Central Warrington",
      "assets/images/ben-experience-hero.jpg",
      "events.html?area=warrington"
    ]
  },
  "macclesfield": {
    "name": "Macclesfield",
    "story": [
      "Ben talks town-centre renewal in Macclesfield",
      "Local traders and residents discuss footfall, empty units and how the mayor can support stronger high streets.",
      "assets/images/ben-events-hero.jpg",
      "area.html?area=macclesfield"
    ],
    "campaign": [
      "Revive Macclesfield town centre",
      "Back practical regeneration and stronger local high streets.",
      "stronger-economy.html?area=macclesfield&issue=economy",
      "assets/images/ben-plan-hero.jpg"
    ],
    "event": [
      "Macclesfield Doorstep Session",
      "30 September · 5:30pm · Macclesfield",
      "assets/images/ben-volunteer-hero.jpg",
      "events.html?area=macclesfield"
    ]
  },
  "ellesmere-port": {
    "name": "Ellesmere Port",
    "story": [
      "Ellesmere Port can lead the region’s industrial future",
      "Ben visits local employers to discuss manufacturing, energy and investment.",
      "assets/images/ben-experience-hero.jpg",
      "area.html?area=ellesmere-port"
    ],
    "campaign": [
      "Back Ellesmere Port industry",
      "Make the area a priority for investment, advanced manufacturing and clean energy.",
      "stronger-economy.html?area=ellesmere-port&issue=economy",
      "assets/images/ben-home-intro.jpg"
    ],
    "event": [
      "Skills & Apprenticeships Forum",
      "9 October · 4:00pm · Ellesmere Port",
      "assets/images/ben-plan-hero.jpg",
      "events.html?area=ellesmere-port"
    ]
  }
};

  function resolveArea(value){
    if(!value) return "";
    const v=value.trim();
    if(AREAS[v]) return v;
    for(const [rx,key] of postcodeMap){ if(rx.test(v)) return key; }
    const lower=v.toLowerCase();
    for(const key of Object.keys(AREAS)){
      if(key==="regional") continue;
      if(lower.includes((AREAS[key].name||"").toLowerCase())) return key;
    }
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

  function renderAreaHub(key){
    const area=AREAS[key];
    const hub=(window.BEN_AREA_HUBS||{})[key];
    if(!area||!hub) return;

    const hero=document.getElementById("areaPageHero");
    if(hero && area.heroImage) hero.style.backgroundImage='url("'+area.heroImage+'")';
    const heroTitle=document.getElementById("areaHeroTitle");
    const heroText=document.getElementById("areaHeroText");
    if(heroTitle) heroTitle.textContent="Ben in "+area.name;
    if(heroText) heroText.textContent=area.heroSupport || "";

    const generic=document.getElementById("areaGeneric");
    const chooser=document.getElementById("areaChooser");
    renderAreaHub(key);


    const news=document.getElementById("areaNewsGrid");
    if(news){
      news.innerHTML=hub.news.map(function(n){
        return card(n[2],n[0],n[1],"news.html?area="+key,"Read story");
      }).join("");
    }

    const campaigns=document.getElementById("areaCampaignGrid");
    if(campaigns){
      campaigns.innerHTML=hub.campaigns.map(function(c,i){
        const image=(hub.news[i%hub.news.length]||hub.news[0])[2];
        return card(image,c[0],c[1],c[3]+"?area="+key+"&issue="+c[2],"Explore campaign");
      }).join("");
    }

    const policy=document.getElementById("areaPolicyGrid");
    if(policy){
      const policies=[
        ["Better transport","How buses, roads and rail can work better for "+area.name+".","better-transport.html","assets/images/ben-plan-hero.jpg"],
        ["A stronger economy","Jobs, skills and investment priorities for "+area.name+".","stronger-economy.html","assets/images/ben-experience-hero.jpg"],
        ["Safer communities","Neighbourhood confidence and practical local safety.","safer-communities.html","assets/images/ben-area.jpg"],
        ["Homes & opportunity","Growth, infrastructure and the places people live.","homes-opportunity.html","assets/images/ben-about-hero.jpg"]
      ];
      policy.innerHTML=policies.map(function(p){
        return `<article class="policy-local-card"><div class="policy-local-image" style="background-image:url('${p[3]}')"></div><div><h3>${p[0]}</h3><p>${p[1]}</p><a href="${p[2]}?area=${key}">Read the policy</a></div></article>`;
      }).join("");
    }

    const events=document.getElementById("areaEventGrid");
    if(events){
      events.innerHTML=hub.events.map(function(e){
        return card(e[2],e[0],e[1],"events.html?area="+key,"View event");
      }).join("");
    }
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
        const rel = raw.split("?")[0].split("#")[0];
        a.setAttribute("href", rel + u.search + u.hash);
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
          const fields={};
          new FormData(form).forEach((value,key)=>{
            if(fields[key]!==undefined){
              if(!Array.isArray(fields[key])) fields[key]=[fields[key]];
              fields[key].push(value);
            }else{
              fields[key]=value;
            }
          });
          sessionStorage.setItem("lastBenAction",JSON.stringify({
            type:form.dataset.demoForm,
            source,
            area:getArea(),
            fields
          }));
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

  document.querySelectorAll("[data-area-choice]").forEach(function(button){
    button.addEventListener("click",function(){
      const key=button.dataset.areaChoice;
      if(!AREAS[key]) return;
      setArea(key,true);
      const u=new URL(location.href);
      u.searchParams.set("area",key);
      history.replaceState({}, "", u);
      renderAreaHub(key);
      window.scrollTo({top:0,behavior:"smooth"});
    });
  });

  const area=getArea(); if(area&&AREAS[area])applyArea(area);
  document.getElementById("clearArea")?.addEventListener("click",clearArea);
})();

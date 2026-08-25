
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
    const keys=["utm_source","utm_medium","utm_campaign","utm_content","utm_term","issue","source","qr"];
    const data={}; keys.forEach(k=>{if(p.get(k))data[k]=p.get(k)});
    if(Object.keys(data).length) try{sessionStorage.setItem("benSource",JSON.stringify(data))}catch(e){}
  }

  function areaCard(image,title,copy,href,button){
    return `<article class="card">
      <div class="card-image" style="background-image:url('${image}')"></div>
      <div class="card-body">
        <h3>${title}</h3>
        <p>${copy}</p>
        <a class="btn navy" href="${href}">${button}</a>
      </div>
    </article>`;
  }

  function renderAreaHub(key){
    const area=AREAS[key];
    const hub=(window.BEN_AREA_HUBS||{})[key];
    if(!area||!hub) return;

    const hero=document.getElementById("areaPageHero");
    if(hero && area.heroImage) hero.style.backgroundImage=`url("${area.heroImage}")`;

    const heroTitle=document.getElementById("areaHeroTitle");
    const heroText=document.getElementById("areaHeroText");
    if(heroTitle) heroTitle.textContent="Ben in "+area.name;
    if(heroText) heroText.textContent=area.heroSupport || "";

    const generic=document.getElementById("areaGeneric");
    const chooser=document.getElementById("areaChooser");
    const areaHub=document.getElementById("areaHub");
    if(generic) generic.style.display="none";
    if(chooser) chooser.style.display="none";
    if(areaHub) areaHub.style.display="block";

    const title=document.getElementById("areaHubTitle");
    const intro=document.getElementById("areaHubIntro");
    const focus=document.getElementById("areaHubFocus");
    if(title) title.textContent="The campaign in "+area.name;
    if(intro) intro.textContent=area.heroSupport || "";
    if(focus) focus.textContent=area.localFocus ? "Local focus: "+area.localFocus : "";

    const news=document.getElementById("areaNewsGrid");
    if(news){
      news.innerHTML=(hub.news||[]).map(function(n){
        const links=(window.BEN_AREA_LINKS||{})[key]; const idx=(hub.news||[]).indexOf(n); return areaCard(n[2],n[0],n[1],links&&links.news[idx] ? links.news[idx]+"?area="+key : `news.html?area=${key}`,"Read story");
      }).join("");
    }

    const campaigns=document.getElementById("areaCampaignGrid");
    if(campaigns){
      campaigns.innerHTML=(hub.campaigns||[]).map(function(c,i){
        const image=((hub.news||[])[i % Math.max((hub.news||[]).length,1)] || [null,null,"assets/images/ben-area.jpg"])[2];
        const links=(window.BEN_AREA_LINKS||{})[key]; const idx=(hub.campaigns||[]).indexOf(c); return areaCard(image,c[0],c[1],links&&links.campaigns[idx] ? links.campaigns[idx]+"?area="+key+"&issue="+c[2] : `${c[3]}?area=${key}&issue=${c[2]}`,"Explore campaign");
      }).join("");
    }

    const policy=document.getElementById("areaPolicyGrid");
    if(policy){
      const policies=[
        ["Better transport",`How buses, roads and rail can work better for ${area.name}.`,"better-transport.html","assets/images/ben-plan-hero.jpg"],
        ["A stronger economy",`Jobs, skills and investment priorities for ${area.name}.`,"stronger-economy.html","assets/images/ben-experience-hero.jpg"],
        ["Safer communities",`Neighbourhood confidence and practical local safety in ${area.name}.`,"safer-communities.html","assets/images/ben-area.jpg"],
        ["Homes & opportunity",`Growth, infrastructure and the places people live in ${area.name}.`,"homes-opportunity.html","assets/images/ben-about-hero.jpg"]
      ];
      policy.innerHTML=policies.map(function(p){
        return `<article class="policy-local-card">
          <div class="policy-local-image" style="background-image:url('${p[3]}')"></div>
          <div>
            <h3>${p[0]}</h3>
            <p>${p[1]}</p>
            <a href="${p[2]}?area=${key}">Read the policy</a>
          </div>
        </article>`;
      }).join("");
    }

    const events=document.getElementById("areaEventGrid");
    if(events){
      events.innerHTML=(hub.events||[]).map(function(e){
        const image=e[2] || "assets/images/ben-events-hero.jpg";
        const links=(window.BEN_AREA_LINKS||{})[key]; const idx=(hub.events||[]).indexOf(e); return areaCard(image,e[0],e[1],links&&links.events[idx] ? links.events[idx]+"?area="+key : `events.html?area=${key}`,"View event");
      }).join("");
    }
  }

  function splitAreaContent(key){
    const area=AREAS[key];
    if(!area) return;

    [
      {source:"newsAllGrid",local:"newsLocalGrid",rest:"newsRestGrid",section:"newsLocalSection",title:"newsLocalTitle"},
      {source:"eventsAllGrid",local:"eventsLocalGrid",rest:"eventsRestGrid",section:"eventsLocalSection",title:"eventsLocalTitle"}
    ].forEach(function(cfg){
      const source=document.getElementById(cfg.source);
      const local=document.getElementById(cfg.local);
      const rest=document.getElementById(cfg.rest);
      const section=document.getElementById(cfg.section);
      if(!source||!local||!rest||!section) return;

      const cards=Array.from(source.children);
      local.innerHTML="";
      rest.innerHTML="";

      cards.forEach(function(card){
        card.querySelectorAll(".area-card-badge").forEach(function(b){b.remove()});
        const clone=card.cloneNode(true);
        if(card.dataset.area===key){
          const body=clone.querySelector(".card-body");
          if(body){
            const badge=document.createElement("div");
            badge.className="area-card-badge";
            badge.textContent="In "+area.name;
            body.insertBefore(badge,body.firstChild);
          }
          local.appendChild(clone);
        } else {
          rest.appendChild(clone);
        }
      });

      if(local.children.length){
        section.style.display="";
        const heading=document.getElementById(cfg.title);
        if(heading) heading.textContent=(cfg.source==="newsAllGrid" ? "Latest from " : "Events in ")+area.name;
      }
      source.style.display="none";
    });

    const newsRestHeading=document.getElementById("newsRestTitle");
    if(newsRestHeading) newsRestHeading.textContent="More from across Cheshire & Warrington";
    const eventRestHeading=document.getElementById("eventsRestTitle");
    if(eventRestHeading) eventRestHeading.textContent="More events across Cheshire & Warrington";
  }

  function applyArea(key){
    const a=AREAS[key]; if(!a) return;
    document.documentElement.dataset.area=key;

    const status=document.getElementById("localStatus");
    const name=document.getElementById("localStatusName");
    if(status&&name){
      name.textContent=a.name;
      status.classList.add("visible");
    }

    document.querySelectorAll("[data-area-name]").forEach(function(el){el.textContent=a.name});
    document.querySelectorAll("[data-area-copy]").forEach(function(el){
      el.textContent=(el.dataset.areaCopy||"").replace(/\{area\}/g,a.name);
    });

    const block=document.getElementById("homeLocalBlock");
    const data=localData[key];
    if(block&&data){
      block.classList.add("visible");
      const ids={
        localStoryTitle:data.story[0],localStoryText:data.story[1],
        localCampaignTitle:data.campaign[0],localCampaignText:data.campaign[1],
        localEventTitle:data.event[0],localEventText:data.event[1]
      };
      Object.entries(ids).forEach(function(pair){
        const el=document.getElementById(pair[0]);
        if(el) el.textContent=pair[1];
      });
      [["localStoryImage",data.story[2]],["localCampaignImage",data.campaign[3]],["localEventImage",data.event[2]]].forEach(function(pair){
        const el=document.getElementById(pair[0]);
        if(el) el.style.backgroundImage=`url("${pair[1]}")`;
      });
      [["localStoryLink",data.story[3]],["localCampaignLink",data.campaign[2]],["localEventLink",data.event[3]]].forEach(function(pair){
        const el=document.getElementById(pair[0]);
        if(el) el.href=pair[1];
      });
    }
      const policyTitle=document.getElementById("localPolicyTitle");
      const policyText=document.getElementById("localPolicyText");
      const policyImage=document.getElementById("localPolicyImage");
      const policyLink=document.getElementById("localPolicyLink");
      const issue=(data.campaign[2].match(/issue=([^&]+)/)||[])[1] || "transport";
      const policyMap={
        transport:["Better transport",`What better transport would mean for ${a.name}.`,"assets/images/ben-plan-hero.jpg","better-transport.html"],
        economy:["A stronger economy",`Jobs, skills and investment priorities for ${a.name}.`,"assets/images/ben-experience-hero.jpg","stronger-economy.html"],
        safety:["Safer communities",`Practical action on local safety in ${a.name}.`,"assets/images/ben-area.jpg","safer-communities.html"],
        homes:["Homes & opportunity",`Growth and infrastructure priorities for ${a.name}.`,"assets/images/ben-about-hero.jpg","homes-opportunity.html"]
      };
      const pd=policyMap[issue]||policyMap.transport;
      if(policyTitle) policyTitle.textContent=pd[0];
      if(policyText) policyText.textContent=pd[1];
      if(policyImage) policyImage.style.backgroundImage=`url("${pd[2]}")`;
      if(policyLink) policyLink.href=pd[3]+"?area="+key;

    renderAreaHub(key);
    splitAreaContent(key);
    decorateLinks(key);
  }


  function sourceContext(){
    try{return JSON.parse(sessionStorage.getItem("benSource")||"{}")}catch(e){return {}}
  }

  function buildJourneyUrl(raw, area){
    try{
      const u=new URL(raw,location.href);
      if(area && !u.searchParams.has("area")) u.searchParams.set("area",area);
      const source=sourceContext();
      Object.keys(source).forEach(function(key){
        if(source[key] && !u.searchParams.has(key)) u.searchParams.set(key,source[key]);
      });
      return raw.split("?")[0].split("#")[0] + u.search + u.hash;
    }catch(e){return raw}
  }

  function renderSourceBar(){
    const s=sourceContext();
    const source=s.utm_source || s.source;
    if(!source) return;
    let bar=document.getElementById("sourceContextBar");
    if(!bar){
      bar=document.createElement("div");
      bar.id="sourceContextBar";
      bar.className="source-context";
      bar.innerHTML='<div class="container"></div>';
      const status=document.getElementById("localStatus");
      if(status) status.insertAdjacentElement("afterend",bar);
    }
    const text=(source+" "+(s.utm_campaign||"")).replace(/[-_]/g," ").trim();
    bar.querySelector(".container").textContent="You arrived via "+text+".";
    bar.classList.add("visible");
  }

  function decorateLinks(area){
    document.querySelectorAll('a[href]').forEach(function(a){
      const raw=a.getAttribute("href");
      if(!raw||raw.startsWith("#")||raw.startsWith("mailto:")||raw.startsWith("tel:")||/^https?:/i.test(raw))return;
      if(!/(plan|news|events|tell-ben|area|business|volunteer|journeys|campaigns|preferences|thanks)/.test(raw))return;
      a.setAttribute("href",buildJourneyUrl(raw,area));
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
  renderSourceBar();
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


  /* V10 preferences and thank-you journeys */
  (function(){
    const form=document.getElementById("preferencesForm");
    if(form){
      const area=getArea();
      if(area && AREAS[area]){
        const t=document.getElementById("prefAreaTitle");
        if(t)t.textContent="Updates from "+AREAS[area].name;
      }
      try{
        const saved=JSON.parse(sessionStorage.getItem("benPreferences")||"{}");
        Object.keys(saved).forEach(function(k){
          const el=form.querySelector(`[name="${k}"]`);
          if(el)el.checked=!!saved[k];
        });
      }catch(e){}
      form.addEventListener("submit",function(ev){
        ev.preventDefault();
        const prefs={};
        new FormData(form).forEach(function(v,k){prefs[k]=true});
        ["area_updates","plan","events","campaigns","monthly"].forEach(function(k){if(!(k in prefs))prefs[k]=false});
        try{sessionStorage.setItem("benPreferences",JSON.stringify(prefs))}catch(e){}
        const saved=document.getElementById("prefSaved");if(saved)saved.style.display="inline";
      });
    }

    const context=document.body.dataset.thanksContext;
    if(context){
      let action={};
      try{action=JSON.parse(sessionStorage.getItem("lastBenAction")||"{}")}catch(e){}
      const area=action.area||getArea();
      if(area && AREAS[area]){
        const lt=document.getElementById("thanksLocalTitle");
        const ll=document.getElementById("thanksLocalLink");
        const ltx=document.getElementById("thanksLocalText");
        if(lt)lt.textContent="What’s happening in "+AREAS[area].name;
        if(ltx)ltx.textContent="See local news, campaigns, events and policy priorities.";
        if(ll)ll.href="area.html?area="+area;
      }
      const nt=document.getElementById("thanksNextTitle");
      const nl=document.getElementById("thanksNextLink");
      const nx=document.getElementById("thanksNextText");
      if(context==="campaign"){if(nt)nt.textContent="Tell Ben why this matters";if(nx)nx.textContent="Add a quick survey response on the same issue.";if(nl)nl.href="tell-ben.html"+(area?"?area="+area:"")}
      if(context==="survey"){if(nt)nt.textContent="See the related local campaign";if(nx)nx.textContent="Your response can lead straight into relevant local action.";if(nl)nl.href=area?"area.html?area="+area:"plan.html"}
      if(context==="event"){if(nt)nt.textContent="See another local action";if(nx)nx.textContent="Explore another campaign or event near you.";if(nl)nl.href=area?"area.html?area="+area:"events.html"}
      if(context==="signup"){if(nt)nt.textContent="Choose your updates";if(nx)nx.textContent="Fine-tune what you receive from the campaign.";if(nl)nl.href="preferences.html"}
      if(context==="donation"){if(nt)nt.textContent="Stay connected";if(nx)nx.textContent="Choose which campaign updates you want to receive.";if(nl)nl.href="preferences.html"}
    }
  })();

(function(){
  const AREAS=window.BEN_CAMPAIGN_AREAS||{};
  const P=window.BEN_PERSONALISATION||{};
  const META=P.areas||{};
  const ISSUES=P.issues||{};

  function safeGet(store,key){try{return store.getItem(key)||''}catch(e){return ''}}
  function safeSet(store,key,val){try{store.setItem(key,val)}catch(e){}}
  function getArea(){
    const q=new URLSearchParams(location.search).get('area');
    if(q&&AREAS[q]) return q;
    return safeGet(sessionStorage,'benArea')||safeGet(localStorage,'benArea');
  }
  function setArea(key,persist){
    if(!AREAS[key])return;
    safeSet(sessionStorage,'benArea',key);
    if(persist)safeSet(localStorage,'benArea',key);
  }
  function getSource(){try{return JSON.parse(safeGet(sessionStorage,'benSource')||'{}')}catch(e){return {}}}
  function getProfile(){
    try{return JSON.parse(safeGet(localStorage,'benProfile')||'{}')}catch(e){return {}}
  }
  function saveProfile(profile){safeSet(localStorage,'benProfile',JSON.stringify(profile))}
  function currentIssue(){
    const p=new URLSearchParams(location.search);
    const q=p.get('issue'); if(ISSUES[q])return q;
    const source=getSource();
    if(ISSUES[source.issue])return source.issue;
    const campaign=(source.utm_campaign||'').toLowerCase();
    for(const key of Object.keys(ISSUES)){if(campaign.includes(key))return key;}
    return getProfile().issue||'';
  }
  function inferContextFromSource(){
    const source=getSource();
    const campaign=(source.utm_campaign||'').toLowerCase();
    if(!getArea()){
      for(const key of Object.keys(AREAS)){
        if(key==='regional')continue;
        const aliases=[key,(AREAS[key].name||'').toLowerCase().replace(/\s+/g,'-')];
        if(aliases.some(a=>campaign.includes(a))){setArea(key,false);break;}
      }
    }
    const issue=currentIssue();
    if(issue){
      const profile=getProfile();
      profile.issue=issue;
      profile.lastSource=source;
      saveProfile(profile);
      safeSet(sessionStorage,'benIssue',issue);
    }
  }
  function addParams(href,extra){
    try{
      const u=new URL(href,location.href);
      const area=getArea(),issue=currentIssue(),source=getSource();
      if(area&&!u.searchParams.has('area'))u.searchParams.set('area',area);
      if(issue&&!u.searchParams.has('issue'))u.searchParams.set('issue',issue);
      Object.keys(source).forEach(k=>{if(source[k]&&!u.searchParams.has(k))u.searchParams.set(k,source[k])});
      Object.keys(extra||{}).forEach(k=>{if(extra[k])u.searchParams.set(k,extra[k])});
      return u.pathname.split('/').pop()+u.search+u.hash;
    }catch(e){return href}
  }

  function sourceLabel(){
    const s=getSource(), area=getArea(), issue=currentIssue();
    if(!s.utm_source&&!s.source&&!s.utm_campaign)return '';
    const bits=[];
    if(area&&AREAS[area])bits.push(AREAS[area].name);
    if(issue&&ISSUES[issue])bits.push(ISSUES[issue].label.toLowerCase());
    return bits.length?`Showing you the ${bits.join(' · ')} campaign first.`:'Showing you the campaign most relevant to the link you followed.';
  }
  function improveSourceBar(){
    const bar=document.getElementById('sourceContextBar');
    if(!bar)return;
    const text=sourceLabel(); if(text)bar.querySelector('.container').textContent=text;
  }

  function localIssueOrder(area){
    const meta=META[area]||{};
    return meta.priorityOrder||['transport','economy','safety','homes'];
  }

  function renderListening(container,area){
    if(!container||!META[area])return;
    const items=META[area].responses||[];
    container.innerHTML=items.map(x=>`<article class="listening-card"><span>${x[0]}</span><p>${x[1]}</p></article>`).join('');
  }


  function renderAreaListening(){
    const area=getArea(); if(!area||!META[area])return;
    const title=document.querySelector('#areaListening h2');
    if(title)title.textContent=`What people in ${AREAS[area].name} are telling Ben`;
    renderListening(document.getElementById('areaListeningGrid'),area);
    const add=document.querySelector('#areaListening a'); if(add){add.textContent=`Tell Ben about ${AREAS[area].name}`;add.href=addParams('tell-ben.html');}
  }

  function applyCampaignJourney(){
    const area=getArea(),issue=currentIssue();
    if(!issue||!ISSUES[issue])return;
    document.documentElement.dataset.issue=issue;
    // Keep the issue someone arrived for prominent on the homepage.
    if(document.body.dataset.page==='home'&&area&&AREAS[area]){
      const title=document.getElementById('localCampaignTitle');
      const text=document.getElementById('localCampaignText');
      const link=document.getElementById('localCampaignLink');
      if(title)title.textContent=ISSUES[issue].campaign;
      if(text)text.textContent=`The ${ISSUES[issue].label.toLowerCase()} campaign for ${AREAS[area].name}, shown first because it matches how you arrived.`;
      if(link){link.href=addParams(ISSUES[issue].page,{issue});link.textContent='View this campaign';}
    }
    if(document.body.dataset.page==='tell-ben'){
      const input=document.querySelector(`#tellBenIssueGrid [data-issue="${issue}"] input`);if(input)input.checked=true;
    }
  }

  function personaliseTellBen(){
    if(document.body.dataset.page!=='tell-ben')return;
    const area=getArea(),meta=META[area];
    const heroTitle=document.getElementById('tellBenHeroTitle');
    const heroText=document.getElementById('tellBenHeroText');
    const priorityTitle=document.getElementById('tellBenPriorityTitle');
    const prompt=document.getElementById('tellBenPrompt');
    const pc=document.querySelector('#tellBenForm [name="postcode"]');
    const message=document.querySelector('#tellBenForm [name="message"]');
    if(area&&meta){
      if(heroTitle)heroTitle.textContent=`Tell Ben about ${AREAS[area].name}`;
      if(heroText)heroText.textContent=`What should Ben focus on in ${AREAS[area].name}? Share what matters to you and help shape the local campaign.`;
      if(priorityTitle)priorityTitle.textContent=`What should Ben focus on in ${AREAS[area].name}?`;
      if(prompt)prompt.textContent=`Choose the issues that matter most in ${AREAS[area].name}.`;
      if(pc)pc.placeholder=`Your ${AREAS[area].name} postcode`;
      if(message)message.placeholder=`What would you most like Ben to change in ${AREAS[area].name}?`;
      const grid=document.getElementById('tellBenIssueGrid');
      if(grid){
        const nodes={}; Array.from(grid.children).forEach(n=>{nodes[n.dataset.issue]=n});
        localIssueOrder(area).forEach(key=>{
          const n=nodes[key]; if(!n)return;
          const copy=n.querySelector('[data-issue-copy]'); if(copy)copy.textContent=meta.issueCopy[key]||copy.textContent;
          grid.appendChild(n);
        });
      }
      const listeningTitle=document.getElementById('tellBenListeningTitle');
      if(listeningTitle)listeningTitle.textContent=`What people in ${AREAS[area].name} are telling Ben`;
      renderListening(document.getElementById('tellBenListeningGrid'),area);
      document.getElementById('tellBenListening')?.classList.add('visible');
    }

    const form=document.getElementById('tellBenForm');
    if(form){
      form.addEventListener('submit',function(){
        const checked=Array.from(form.querySelectorAll('input[name="issues"]:checked')).map(x=>x.value);
        const issue=checked[0]||currentIssue()||'';
        const profile=getProfile();
        profile.area=getArea()||profile.area||'';
        profile.issue=issue||profile.issue||'';
        profile.issues=checked;
        profile.toldBen=true;
        profile.lastAction='survey';
        profile.lastActionAt=new Date().toISOString();
        saveProfile(profile);
        safeSet(sessionStorage,'benIssue',issue);
      });
    }
  }

  function personalisePlan(){
    const area=getArea(); if(!area||!META[area])return;
    const box=document.getElementById('localPlanIntro'); if(!box)return;
    const meta=META[area]; box.classList.add('visible');
    const title=box.querySelector('h2'); if(title)title.textContent=`What Ben’s plan means for ${AREAS[area].name}`;
    const copy=box.querySelector('[data-local-plan-copy]'); if(copy)copy.textContent=meta.planIntro;
    const examples=box.querySelector('[data-local-plan-examples]');
    if(examples){
      const planImages={transport:'assets/images/ben-plan-hero.jpg',economy:'assets/images/ben-experience-hero.jpg',safety:'assets/images/ben-area.jpg',homes:'assets/images/ben-about-hero.jpg'};
      examples.innerHTML=localIssueOrder(area).map(k=>`<a class="local-plan-chip image-card" href="${addParams(ISSUES[k].page,{issue:k})}" style="background-image:url('${planImages[k]||'assets/images/ben-plan-hero.jpg'}')"><strong>${ISSUES[k].label}</strong><span>${meta.planExamples[k]}</span></a>`).join('');
    }
    const issue=currentIssue();
    if(issue){
      const section=document.querySelector(`[data-plan-issue="${issue}"]`);
      const parent=section?.parentNode;
      if(section&&parent){
        const first=parent.querySelector('.plan-section');
        if(first&&first!==section)parent.insertBefore(section,first);
        section.classList.add('journey-priority');
      }
    }
  }

  function smartCTAData(){
    const area=getArea(),profile=getProfile(),issue=currentIssue()||profile.issue;
    const areaName=area&&AREAS[area]?AREAS[area].name:'your area';
    if(profile.backedIssue){return {title:`Help us campaign in ${areaName}`,copy:'You’ve already backed a campaign. The next step is helping locally.',label:`Help in ${areaName}`,href:addParams('volunteer.html')}}
    if(profile.toldBen&&issue&&ISSUES[issue])return {title:ISSUES[issue].campaign,copy:`You told Ben this matters. See the campaign and what it means for ${areaName}.`,label:'Back this campaign',href:addParams(ISSUES[issue].page,{issue})};
    return {title:`Tell Ben what matters in ${areaName}`,copy:'Start by telling the campaign which local issues matter most to you.',label:`Tell Ben about ${areaName}`,href:addParams('tell-ben.html')};
  }
  function renderSmartCTAs(){
    const d=smartCTAData();
    document.querySelectorAll('[data-smart-cta]').forEach(el=>{
      el.querySelector('[data-smart-title]')?.replaceChildren(document.createTextNode(d.title));
      el.querySelector('[data-smart-copy]')?.replaceChildren(document.createTextNode(d.copy));
      const a=el.querySelector('[data-smart-link]');if(a){a.textContent=d.label;a.href=d.href;}
    });
  }

  function renderDashboard(){
    const area=getArea(); if(!area||!AREAS[area])return;
    const dash=document.getElementById('backBenDashboard'); if(!dash)return;
    const meta=META[area],profile=getProfile(),issue=currentIssue()||profile.issue;
    dash.classList.add('visible');
    dash.querySelector('[data-dashboard-area]').textContent=AREAS[area].name;
    dash.querySelector('[data-dashboard-issue]').textContent=issue&&ISSUES[issue]?ISSUES[issue].label:(profile.toldBen?'Your priorities':'Not yet');
    const hub=(window.BEN_AREA_HUBS||{})[area]||{};
    const event=(hub.events||[])[0],news=(hub.news||[])[0];
    const ev=dash.querySelector('[data-dashboard-event]'); if(ev)ev.textContent=event?event[0]:'See local events';
    const nl=dash.querySelector('[data-dashboard-news]'); if(nl)nl.textContent=news?news[0]:'See the latest local update';
    const action=smartCTAData();
    const at=dash.querySelector('[data-dashboard-action]'); if(at)at.textContent=action.title;
    const al=dash.querySelector('[data-dashboard-action-link]'); if(al){al.textContent=action.label;al.href=action.href;}
  }

  function personaliseVolunteer(){
    const area=getArea(),meta=META[area]; if(!area||!meta)return;
    const title=document.getElementById('localVolunteerTitle'); if(title)title.textContent=meta.volunteer;
    const copy=document.getElementById('localVolunteerCopy'); if(copy)copy.textContent=meta.volunteerDetail;
    const pc=document.querySelector('form[data-demo-form="volunteer"] [name="postcode"]'); if(pc)pc.placeholder=`Your ${AREAS[area].name} postcode`;
    document.querySelectorAll('[data-local-volunteer-area]').forEach(x=>x.textContent=AREAS[area].name);
  }

  function personalisePreferences(){
    const area=getArea(); if(!area||!AREAS[area])return;
    const title=document.getElementById('prefAreaTitle');if(title)title.textContent=`Updates from ${AREAS[area].name}`;
    const issue=currentIssue()||getProfile().issue;
    const issueTitle=document.getElementById('prefIssueTitle');
    if(issueTitle&&issue&&ISSUES[issue])issueTitle.textContent=`Updates on ${ISSUES[issue].label.toLowerCase()}`;
  }

  function personaliseThanks(){
    const context=document.body.dataset.thanksContext; if(!context)return;
    const area=getArea(),profile=getProfile();
    let action={};try{action=JSON.parse(safeGet(sessionStorage,'lastBenAction')||'{}')}catch(e){}
    const fields=action.fields||{};
    const issue=(Array.isArray(fields.issues)?fields.issues[0]:fields.issues)||fields.issue||currentIssue()||profile.issue||'';
    const areaName=area&&AREAS[area]?AREAS[area].name:'your area';
    const confirm=document.querySelector('.thanks-confirm h2');
    const cp=document.querySelector('.thanks-confirm p');
    if(context==='survey'&&confirm){confirm.textContent=issue&&ISSUES[issue]?`Thanks for telling Ben about ${ISSUES[issue].label.toLowerCase()} in ${areaName}`:`Thanks for telling Ben about ${areaName}`;}
    if(context==='survey'&&cp)cp.textContent=`Here’s what Ben is already doing on this in ${areaName}, and a useful next step.`;
    const localTitle=document.getElementById('thanksLocalTitle'),localText=document.getElementById('thanksLocalText'),localLink=document.getElementById('thanksLocalLink');
    if(area&&localTitle)localTitle.textContent=`What Ben is doing in ${areaName}`;
    if(area&&localText)localText.textContent=issue&&ISSUES[issue]?`${META[area]?.planExamples?.[issue]||'See the local campaign and plan.'}`:'See local news, campaigns, events and priorities.';
    if(localLink)localLink.href=issue&&ISSUES[issue]?addParams(ISSUES[issue].page,{issue}):addParams('area.html');
    const ntitle=document.getElementById('thanksNextTitle'),ntext=document.getElementById('thanksNextText'),nlink=document.getElementById('thanksNextLink');
    if(context==='survey'){
      if(ntitle)ntitle.textContent=`Get involved in ${areaName}`;
      if(ntext)ntext.textContent='Take the next step: back the campaign, come to an event or help locally.';
      if(nlink){nlink.textContent='See the local campaign';nlink.href=addParams('area.html');}
    }
  }

  function recordCampaignBacks(){
    document.querySelectorAll('form[data-demo-form^="plan-survey-"]').forEach(form=>form.addEventListener('submit',function(){
      const issue=form.querySelector('[name="issue"]')?.value||currentIssue();
      const profile=getProfile();profile.backedIssue=issue;profile.issue=issue;profile.lastAction='campaign';profile.area=getArea()||profile.area;saveProfile(profile);
    }));
    document.querySelectorAll('form[data-demo-form="volunteer"]').forEach(form=>form.addEventListener('submit',function(){const p=getProfile();p.volunteer=true;p.lastAction='volunteer';p.area=getArea()||p.area;saveProfile(p)}));
  }

  function localSupporterVoice(){
    const area=getArea(),meta=META[area]; if(!meta)return;
    document.querySelectorAll('[data-local-supporter]').forEach(el=>{
      el.querySelector('[data-supporter-quote]').textContent=meta.supporter[1];
      el.querySelector('[data-supporter-label]').textContent=meta.supporter[0];
    });
  }

  function renderDynamicProof(){
    const area=getArea(); if(!area||!META[area])return;
    document.querySelectorAll('[data-dynamic-proof]').forEach(el=>{
      const tags=META[area].listening||[];
      el.innerHTML=`<div class="proof-heading"><span>What ${AREAS[area].name} is talking about</span></div><div class="proof-tags">${tags.map(t=>`<span>${t}</span>`).join('')}</div>`;
      el.classList.add('visible');
    });
  }

  function initCampaignMap(){
    const mapEl=document.getElementById('campaignMap'); if(!mapEl||!window.L)return;
    const data=P.map||[];
    const map=L.map(mapEl,{scrollWheelZoom:false,zoomControl:false}).setView([53.24,-2.52],9);
    L.control.zoom({position:'bottomright'}).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
    const labels={visit:'Ben visit',event:'Upcoming event',campaign:'Local campaign',news:'Latest news',listening:'Residents are saying'};
    const markers=[];
    function icon(type,active){return L.divIcon({className:'campaign-map-icon-wrap',html:`<span class="campaign-map-icon ${type}${active?' active':''}"></span>`,iconSize:[20,20],iconAnchor:[10,10],popupAnchor:[0,-10]})}
    data.forEach(item=>{
      const m=L.marker([item.lat,item.lng],{icon:icon(item.type,false)}).addTo(map);
      m.bindPopup(`<div class="map-popup"><span>${labels[item.type]||item.type}</span><h3>${item.title}</h3><p>${item.copy}</p><a href="${addParams(item.link,{area:item.area})}">Open</a></div>`);
      m.on('click',()=>focusArea(item.area,false));
      markers.push({item,marker:m});
    });
    function focusArea(area,persist){
      if(!AREAS[area])return;
      if(persist)setArea(area,true);
      const selected=markers.filter(x=>x.item.area===area);
      markers.forEach(x=>{x.marker.setOpacity(x.item.area===area?1:.28);x.marker.setIcon(icon(x.item.type,x.item.area===area));});
      if(selected.length){map.fitBounds(L.latLngBounds(selected.map(x=>[x.item.lat,x.item.lng])).pad(.32),{maxZoom:11});}
      const side=document.getElementById('campaignMapContext');
      if(side){
        side.querySelector('[data-map-area]').textContent=AREAS[area].name;
        side.querySelector('[data-map-focus]').textContent=META[area]?.listening?.join(' · ')||'';
        const a=side.querySelector('[data-map-area-link]');if(a)a.href=`area.html?area=${area}`;
        const t=side.querySelector('[data-map-tell-link]');if(t){t.href=`tell-ben.html?area=${area}`;t.textContent=`Tell Ben about ${AREAS[area].name}`;}
        side.classList.add('active');
      }
      document.querySelectorAll('[data-map-area-choice]').forEach(b=>b.classList.toggle('active',b.dataset.mapAreaChoice===area));
    }
    function resetMap(){markers.forEach(x=>{x.marker.setOpacity(1);x.marker.setIcon(icon(x.item.type,false))});map.setView([53.24,-2.52],9);}
    document.querySelectorAll('[data-map-filter]').forEach(b=>b.addEventListener('click',()=>{
      const type=b.dataset.mapFilter;
      document.querySelectorAll('[data-map-filter]').forEach(x=>x.classList.toggle('active',x===b));
      markers.forEach(x=>{const show=type==='all'||x.item.type===type;if(show){if(!map.hasLayer(x.marker))x.marker.addTo(map)}else if(map.hasLayer(x.marker))map.removeLayer(x.marker)});
    }));
    document.querySelectorAll('[data-map-area-choice]').forEach(b=>b.addEventListener('click',()=>focusArea(b.dataset.mapAreaChoice,true)));
    document.getElementById('campaignMapReset')?.addEventListener('click',()=>{resetMap();document.getElementById('campaignMapContext')?.classList.remove('active');document.querySelectorAll('[data-map-area-choice]').forEach(b=>b.classList.remove('active'))});
    const area=getArea(); if(area&&AREAS[area])setTimeout(()=>focusArea(area,false),200);
  }

  function localiseEvents(){
    const area=getArea(); if(!area||!AREAS[area])return;
    const title=document.getElementById('eventsLocalTitle'); if(title)title.textContent=`Coming up near ${AREAS[area].name}`;
  }

  inferContextFromSource();
  function initPersonalisation(){
    improveSourceBar();
    personaliseTellBen();
    personalisePlan();
    renderSmartCTAs();
    personaliseVolunteer();
    personalisePreferences();
    personaliseThanks();
    recordCampaignBacks();
    localSupporterVoice();
    renderDynamicProof();
    renderAreaListening();
    applyCampaignJourney();
    localiseEvents();
    initCampaignMap();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initPersonalisation);
  else initPersonalisation();
})();

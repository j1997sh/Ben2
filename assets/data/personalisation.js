window.BEN_PERSONALISATION = {
  areas: {
    crewe: {
      priorityOrder:['transport','economy','homes','safety'],
      issueCopy:{
        transport:'Buses, rail, roads and the connections people use every day.',
        economy:'Crewe town centre, skills, employers and good local jobs.',
        homes:'Homes, regeneration and infrastructure that grows with the town.',
        safety:'Neighbourhood confidence and safer streets.'
      },
      planIntro:'For Crewe, the plan starts with better connections, a stronger town centre and skills that link local people to local opportunity.',
      planExamples:{transport:'Better bus and rail connections around Crewe.',economy:'Town-centre renewal, skills and employer growth.',homes:'Regeneration with the infrastructure Crewe needs.',safety:'Practical neighbourhood safety and prevention.'},
      listening:['Transport connections','Crewe town centre','Skills and jobs'],
      responses:[
        ['Transport','“Better connections between the station, town centre and surrounding communities.”'],
        ['Town centre','“Bring more activity back into the centre and make it easier to spend time there.”'],
        ['Skills','“Make apprenticeships and training easier to find locally.”']
      ],
      volunteer:'Can you help Ben’s team in Crewe?',
      volunteerDetail:'Deliver locally, join a doorstep session or help at a Crewe event.',
      supporter:['Crewe resident','“I want a mayor who understands how much Crewe depends on good connections and a thriving town centre.”']
    },
    chester: {
      priorityOrder:['economy','transport','homes','safety'],
      issueCopy:{transport:'Better connections into and around Chester.',economy:'A thriving city centre, tourism, jobs and investment.',homes:'Growth with transport, health and local infrastructure alongside it.',safety:'Safe, welcoming neighbourhoods and a confident city centre.'},
      planIntro:'For Chester, the plan puts city-centre vitality, transport and well-planned growth first.',
      planExamples:{transport:'Reliable connections into the city centre.',economy:'Backing Chester’s city centre, tourism and employers.',homes:'Infrastructure alongside new homes and growth.',safety:'A safe, welcoming city centre and neighbourhoods.'},
      listening:['City centre','Transport','Housing & infrastructure'],
      responses:[['City centre','“Keep Chester busy, distinctive and easy to visit.”'],['Transport','“Make journeys into the city simpler and more reliable.”'],['Growth','“New homes need services and infrastructure alongside them.”']],
      volunteer:'Help Ben’s campaign in Chester',
      volunteerDetail:'Join a city-centre session, deliver locally or help at an event.',
      supporter:['Chester resident','“Chester needs a strong regional voice without losing what makes the city distinctive.”']
    },
    warrington: {
      priorityOrder:['transport','economy','homes','safety'],
      issueCopy:{transport:'Congestion, junctions, buses and cross-region connections.',economy:'Business growth, skills and infrastructure delivery.',homes:'Homes planned alongside roads, schools and services.',safety:'Safer neighbourhoods and confident town centres.'},
      planIntro:'For Warrington, the plan is about cutting wasted time, unlocking investment and matching growth with infrastructure.',
      planExamples:{transport:'Tackling congestion and unreliable journeys.',economy:'Infrastructure, skills and investment for employers.',homes:'Planning homes and infrastructure together.',safety:'Neighbourhood safety and practical prevention.'},
      listening:['Congestion','Business growth','Housing & infrastructure'],
      responses:[['Transport','“Too much time is lost at the same bottlenecks every day.”'],['Business','“Infrastructure needs to keep pace with Warrington’s growth.”'],['Homes','“Build the services and roads alongside new homes.”']],
      volunteer:'Help Ben’s team in Warrington',
      volunteerDetail:'Join a doorstep session, help at an event or display a poster locally.',
      supporter:['Warrington resident','“Warrington needs a mayor who can get transport and infrastructure moving.”']
    },
    macclesfield: {
      priorityOrder:['economy','transport','safety','homes'],
      issueCopy:{transport:'Buses and links between Macclesfield and surrounding communities.',economy:'Town-centre renewal, local business, jobs and skills.',homes:'Homes and growth that work with local infrastructure.',safety:'Safer streets and confident neighbourhoods.'},
      planIntro:'For Macclesfield, the plan puts the town centre, local business and stronger connections at the front.',
      planExamples:{transport:'Better bus links and local connections.',economy:'Backing the town centre and local employers.',homes:'Growth that fits local infrastructure.',safety:'Practical action on neighbourhood safety.'},
      listening:['Town centre','Buses','Local business'],
      responses:[['Town centre','“Make the centre easier for independents and local businesses to thrive.”'],['Buses','“Reliable buses matter for people without a car.”'],['Business','“Give smaller employers a stronger voice in regional decisions.”']],
      volunteer:'Help Ben’s campaign in Macclesfield',
      volunteerDetail:'Deliver locally, join a doorstep session or help at a town-centre event.',
      supporter:['Macclesfield resident','“Local businesses and neighbourhoods need to feel part of the new mayoral region.”']
    },
    'ellesmere-port': {
      priorityOrder:['economy','transport','homes','safety'],
      issueCopy:{transport:'Connections to jobs, industrial sites and the wider region.',economy:'Manufacturing, energy, skills and local investment.',homes:'Regeneration and homes alongside opportunity and infrastructure.',safety:'Safe neighbourhoods and strong communities.'},
      planIntro:'For Ellesmere Port, the plan is about turning industrial strength, energy and manufacturing into more local jobs and opportunity.',
      planExamples:{transport:'Better links to jobs and industrial sites.',economy:'Manufacturing, energy, skills and investment.',homes:'Regeneration alongside homes and infrastructure.',safety:'Strong, safe neighbourhoods.'},
      listening:['Industry & jobs','Skills','Regeneration'],
      responses:[['Jobs','“Make sure new investment creates opportunities for people already living here.”'],['Skills','“Training should connect directly to the employers growing locally.”'],['Regeneration','“Investment should be visible in the town as well as on industrial sites.”']],
      volunteer:'Help Ben’s team in Ellesmere Port',
      volunteerDetail:'Join a local campaign session, help at an event or deliver in your neighbourhood.',
      supporter:['Ellesmere Port resident','“The area has huge industrial strengths and the mayor should help local people benefit from them.”']
    }
  },
  issues:{
    transport:{label:'Transport',page:'better-transport.html',campaign:'Back Ben’s campaign for better transport'},
    economy:{label:'Economy & skills',page:'stronger-economy.html',campaign:'Back Ben’s campaign for a stronger economy'},
    safety:{label:'Safer communities',page:'safer-communities.html',campaign:'Back Ben’s campaign for safer communities'},
    homes:{label:'Homes & places',page:'homes-opportunity.html',campaign:'Back Ben’s campaign for homes & opportunity'}
  },
  // Prototype content for demonstrating the live campaign map. Replace visit/event items with verified campaign records before launch.
  map:[
    {type:'visit',area:'crewe',place:'Crewe',lat:53.0996,lng:-2.4415,title:'Ben in Crewe',copy:'Latest campaign visit and conversations with local residents.',link:'area.html?area=crewe'},
    {type:'visit',area:'crewe',place:'Nantwich',lat:53.0672,lng:-2.5210,title:'Ben in Nantwich',copy:'Local conversations on town centres, transport and business.',link:'area.html?area=crewe'},
    {type:'visit',area:'chester',place:'Chester',lat:53.1934,lng:-2.8931,title:'Ben in Chester',copy:'Meeting residents and city-centre businesses.',link:'area.html?area=chester'},
    {type:'visit',area:'chester',place:'Northwich',lat:53.2587,lng:-2.5180,title:'Ben in Northwich',copy:'Talking growth, transport and local services.',link:'area.html?area=chester'},
    {type:'visit',area:'warrington',place:'Warrington',lat:53.3900,lng:-2.5970,title:'Ben in Warrington',copy:'Campaign visit focused on congestion and growth.',link:'area.html?area=warrington'},
    {type:'visit',area:'warrington',place:'Knutsford',lat:53.3022,lng:-2.3748,title:'Ben in Knutsford',copy:'Meeting local businesses and residents.',link:'area.html?area=warrington'},
    {type:'visit',area:'macclesfield',place:'Macclesfield',lat:53.2587,lng:-2.1256,title:'Ben in Macclesfield',copy:'Town-centre and local business conversations.',link:'area.html?area=macclesfield'},
    {type:'visit',area:'macclesfield',place:'Wilmslow',lat:53.3280,lng:-2.2290,title:'Ben in Wilmslow',copy:'Hearing from residents and employers.',link:'area.html?area=macclesfield'},
    {type:'visit',area:'macclesfield',place:'Congleton',lat:53.1631,lng:-2.2124,title:'Ben in Congleton',copy:'Local conversations on connections and the town centre.',link:'area.html?area=macclesfield'},
    {type:'visit',area:'ellesmere-port',place:'Ellesmere Port',lat:53.2797,lng:-2.8970,title:'Ben in Ellesmere Port',copy:'Talking manufacturing, energy and skills.',link:'area.html?area=ellesmere-port'},
    {type:'visit',area:'crewe',place:'Winsford',lat:53.1916,lng:-2.5233,title:'Ben in Winsford',copy:'Listening to local priorities and community concerns.',link:'area.html?area=crewe'},

    {type:'event',area:'crewe',place:'Crewe',lat:53.1035,lng:-2.445,title:'Crewe Transport Q&A',copy:'Upcoming local event.',link:'events.html?area=crewe'},
    {type:'event',area:'chester',place:'Chester',lat:53.1900,lng:-2.889,title:'Chester City Centre Walkabout',copy:'Upcoming local campaign event.',link:'events.html?area=chester'},
    {type:'event',area:'warrington',place:'Warrington',lat:53.3940,lng:-2.590,title:'Warrington Transport Forum',copy:'Upcoming local campaign event.',link:'events.html?area=warrington'},
    {type:'event',area:'macclesfield',place:'Macclesfield',lat:53.2620,lng:-2.130,title:'Macclesfield Town Centre Q&A',copy:'Upcoming local campaign event.',link:'events.html?area=macclesfield'},
    {type:'event',area:'ellesmere-port',place:'Ellesmere Port',lat:53.2840,lng:-2.904,title:'Skills & Apprenticeships Forum',copy:'Upcoming local campaign event.',link:'events.html?area=ellesmere-port'},

    {type:'campaign',area:'crewe',place:'Crewe',lat:53.095,lng:-2.435,title:'Fix Crewe’s transport bottlenecks',copy:'Local campaign on junctions, buses and connections.',link:'better-transport.html?area=crewe&issue=transport'},
    {type:'campaign',area:'chester',place:'Chester',lat:53.198,lng:-2.900,title:'Protect Chester’s city-centre vitality',copy:'Local campaign on business, tourism and investment.',link:'stronger-economy.html?area=chester&issue=economy'},
    {type:'campaign',area:'warrington',place:'Warrington',lat:53.386,lng:-2.604,title:'Cut Warrington congestion',copy:'Local campaign focused on wasted time and pinch points.',link:'better-transport.html?area=warrington&issue=transport'},
    {type:'campaign',area:'macclesfield',place:'Macclesfield',lat:53.254,lng:-2.119,title:'Back Macclesfield town centre',copy:'Local campaign for business and town-centre renewal.',link:'stronger-economy.html?area=macclesfield&issue=economy'},
    {type:'campaign',area:'ellesmere-port',place:'Ellesmere Port',lat:53.274,lng:-2.890,title:'Back Ellesmere Port industry',copy:'Local campaign for manufacturing, energy and skills.',link:'stronger-economy.html?area=ellesmere-port&issue=economy'},

    {type:'news',area:'crewe',place:'Crewe',lat:53.108,lng:-2.449,title:'Latest from Crewe',copy:'What Ben has been hearing locally.',link:'area.html?area=crewe'},
    {type:'news',area:'chester',place:'Chester',lat:53.187,lng:-2.897,title:'Latest from Chester',copy:'City-centre businesses and growth.',link:'area.html?area=chester'},
    {type:'news',area:'warrington',place:'Warrington',lat:53.398,lng:-2.600,title:'Latest from Warrington',copy:'Congestion, skills and infrastructure.',link:'area.html?area=warrington'},
    {type:'news',area:'macclesfield',place:'Macclesfield',lat:53.266,lng:-2.122,title:'Latest from Macclesfield',copy:'Town centre, buses and local business.',link:'area.html?area=macclesfield'},
    {type:'news',area:'ellesmere-port',place:'Ellesmere Port',lat:53.286,lng:-2.894,title:'Latest from Ellesmere Port',copy:'Industry, energy and local opportunity.',link:'area.html?area=ellesmere-port'},

    {type:'listening',area:'crewe',place:'Crewe',lat:53.101,lng:-2.452,title:'What Crewe is telling Ben',copy:'Transport connections · Town centre · Skills and jobs',link:'tell-ben.html?area=crewe'},
    {type:'listening',area:'chester',place:'Chester',lat:53.195,lng:-2.885,title:'What Chester is telling Ben',copy:'City centre · Transport · Housing & infrastructure',link:'tell-ben.html?area=chester'},
    {type:'listening',area:'warrington',place:'Warrington',lat:53.392,lng:-2.610,title:'What Warrington is telling Ben',copy:'Congestion · Business growth · Housing & infrastructure',link:'tell-ben.html?area=warrington'},
    {type:'listening',area:'macclesfield',place:'Macclesfield',lat:53.252,lng:-2.132,title:'What Macclesfield is telling Ben',copy:'Town centre · Buses · Local business',link:'tell-ben.html?area=macclesfield'},
    {type:'listening',area:'ellesmere-port',place:'Ellesmere Port',lat:53.276,lng:-2.906,title:'What Ellesmere Port is telling Ben',copy:'Industry & jobs · Skills · Regeneration',link:'tell-ben.html?area=ellesmere-port'}
  ]
};

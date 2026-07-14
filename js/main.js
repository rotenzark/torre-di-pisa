/* ===== TRATTORIA TORRE DI PISA · main.js ===== */
(function(){
  'use strict';

  /* ---------- INTRO ---------- */
  var intro=document.getElementById('intro'),skip=document.getElementById('intro-skip');
  function closeIntro(){if(intro){intro.classList.add('done');}try{sessionStorage.setItem('tdp_seen','1');}catch(e){}}
  var seen=false;try{seen=sessionStorage.getItem('tdp_seen')==='1';}catch(e){}
  if(seen&&intro){intro.parentNode.removeChild(intro);}
  else if(intro){setTimeout(closeIntro,2100);if(skip)skip.addEventListener('click',closeIntro);}

  /* ---------- HEADER SCROLL ---------- */
  var header=document.getElementById('site-header');
  function onScroll(){if(header)header.classList.toggle('scrolled',window.scrollY>12);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* ---------- BURGER / NAV ---------- */
  var burger=document.getElementById('burger'),nav=document.querySelector('.nav');
  if(burger&&nav){
    burger.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
    });
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');});});
  }

  /* ---------- ORARI DINAMICI ---------- */
  // TABLE keyed by getDay() 0=Dom..6=Sab. Tutti i giorni orario continuato 12:00–24:00.
  var TABLE={0:[[12,24]],1:[[12,24]],2:[[12,24]],3:[[12,24]],4:[[12,24]],5:[[12,24]],6:[[12,24]]};
  var DAYS_IT=['dom','lun','mar','mer','gio','ven','sab'];
  var DAYS_EN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function fmt(h){h=h%24;var H=Math.floor(h),M=Math.round((h-H)*60);return H+':'+(M<10?'0'+M:''+M);}
  function nowRome(){var s=new Date().toLocaleString('en-US',{timeZone:'Europe/Rome'});return new Date(s);}
  function computeLive(){
    var d=nowRome(),day=d.getDay(),hour=d.getHours()+d.getMinutes()/60;
    var wins=TABLE[day]||[],openNow=false,closeAt=null;
    for(var i=0;i<wins.length;i++){if(hour>=wins[i][0]&&hour<wins[i][1]){openNow=true;closeAt=wins[i][1];break;}}
    var nextOpen=null,nextDay=null;
    if(!openNow){
      for(var j=0;j<wins.length;j++){if(wins[j][0]>hour){nextOpen=wins[j][0];nextDay=day;break;}}
      if(nextOpen===null){for(var k=1;k<=7;k++){var dd=(day+k)%7,w2=TABLE[dd];if(w2&&w2.length){nextOpen=w2[0][0];nextDay=dd;break;}}}
    }
    return {openNow:openNow,closeAt:closeAt,nextOpen:nextOpen,nextDay:nextDay,day:day};
  }
  function renderLive(){
    var dot=document.getElementById('live-dot'),txt=document.getElementById('live-text');
    if(!dot||!txt)return;
    var L=computeLive(),en=document.documentElement.lang==='en',DAYS=en?DAYS_EN:DAYS_IT;
    dot.className='';
    if(L.openNow){
      dot.classList.add('open');
      txt.textContent=en?('Open now · until '+fmt(L.closeAt)):('Aperto ora · fino alle '+fmt(L.closeAt));
    }else{
      dot.classList.add('closed');
      if(L.nextOpen!==null){
        var sameDay=L.nextDay===L.day;
        var dl=DAYS[L.nextDay];
        if(en)txt.textContent='Closed · opens '+(sameDay?'':dl+' ')+fmt(L.nextOpen);
        else txt.textContent='Chiuso · apre '+(sameDay?'':dl+' ')+fmt(L.nextOpen);
      }else{txt.textContent=en?'Closed':'Chiuso';}
    }
  }

  /* ---------- I18N ---------- */
  var EN={
    'intro.skip':'Enter →',
    'brand.sub':'Tuscan Trattoria · since 1959',
    'nav.storia':'Since 1959','nav.menu':'The food','nav.origini':'The rooms','nav.dove':'Find us',
    'cta.book':'Book',
    'hero.eyebrow':'Brera · Via Fiori Chiari · since 1959',
    'hero.tag':'Tuscan trattoria · country cooking',
    'hero.sub':'Since <b>1959</b>, a slice of Tuscany in the heart of Brera. The <b>bistecca alla fiorentina</b>, hand-rolled tagliatelle, farro soup and crostini — in a historic trattoria kept just as it was, among its five shop windows and the chairs of always.',
    'hero.cta1':'Book a table','hero.cta2':'The Tuscan menu',
    'hero.live':'Checking hours…','hero.f2':'★ 3.9 · 1500+ reviews',
    'storia.kicker':'Since 1959',
    'storia.h2':'A slice of Tuscany<br>in the heart of Brera.',
    'storia.p1':'Torre di Pisa opened on Via Fiori Chiari in <b>1959</b>, founded by the Tuscan <b>Meacci family</b>. Over the years it became a haunt for the painters, journalists and intellectuals of Brera — from Camilla Cederna to Giancarlo Baghetti.',
    'storia.p2':'Today it is run by <b>Alberto Cortesi</b>, a true Tuscan, with the same philosophy: <em>simple, honest dishes</em>, fresh pasta, choice meats and the finest Tuscan extra-virgin olive oil.',
    'storia.s1':'the year it opened','storia.s2':'windows on Fiori Chiari','storia.s3b':'Historic','storia.s3':'trattoria of Brera',
    'menu.kicker':'Tuscan country cooking','menu.h2':'Simple and honest',
    'menu.sub':'The flavours of Tuscany as always, from crostini to the fiorentina. And the great classics of Italian cooking.',
    'mc.1t':'Tuscan starters','mc.1a':'Crostini &amp; bruschette','mc.1ap':'Tuscan, as they used to be','mc.1b':'Carpaccio &amp; cured meats','mc.1bp':'with shavings and rocket',
    'mc.2t':'House-made pasta','mc.2a':'Fresh tagliatelle','mc.2ap':'rolled by hand','mc.2b':'Farro soup','mc.2bp':'the Tuscan country recipe','mc.2c':'Pappardelle &amp; ravioli','mc.2cp':'in season',
    'mc.3t':'The steak &amp; mains','mc.3a':'Bistecca alla fiorentina','mc.3ap':'tall, rare, over embers','mc.3b':'Sliced beef tagliata','mc.3bp':'with rocket and grana','mc.3c':'Cotoletta alla milanese','mc.3cp':'for those who love Milan too',
    'mc.4t':'Desserts','mc.4a':'House tiramisù','mc.4ap':'made by us','mc.4b':'Panna cotta &amp; sweets','mc.4bp':'to end on a sweet note',
    'menu.note':'A menu of the day every day, on the blackboard: ask for the fresh seasonal dishes.',
    'origini.kicker':'Faithful to its origins','origini.h2':'As it was,<br>it still is.',
    'origini.p':'The <b>five shop windows</b> on Via Fiori Chiari have never been changed. The <b>wooden chairs</b> are the ones of always. The tapestry room, the intimate two-table nook, the separate dining rooms: everything has stayed as it was. Because some things, in Brera, you simply don’t touch.',
    'gallery.kicker':'At the table','gallery.h2':'Tuscany on the plate',
    'rev.kicker':'Voices','rev.h2':'“The great classics, with care”','rev.g1':'Google review · <span>★★★★★</span>',
    'dove.kicker':'Find us','dove.h2':'On Via Fiori Chiari,<br>in the heart of Brera.',
    'dove.addr':'Address','dove.addr2':'— Brera','dove.hours':'Hours','dove.hoursv':'Every day · continuous service 12:00–24:00',
    'dove.phone':'Phone','dove.book':'Reservations','dove.bookv':'Best to book: the place is small and much loved.',
    'dove.call':'Book a table','dove.route':'Get directions',
    'faq.h2':'Frequently asked questions',
    'faq.q1':'Where is Trattoria Torre di Pisa?','faq.a1':'On Via Fiori Chiari 21, in the heart of Brera in Milan. The trattoria has been open since 1959.',
    'faq.q2':'What kind of cooking do you do?','faq.a2':'Tuscan country cooking: crostini, fresh tagliatelle, farro soup, bistecca alla fiorentina and tagliata, with Tuscan extra-virgin olive oil. And the great classics of Italian cuisine.',
    'faq.q3':'Is it a historic trattoria?','faq.a3':'Yes: open since 1959 by the Tuscan Meacci family, it has stayed faithful to its origins — the five windows on Via Fiori Chiari, the wooden chairs and the little rooms have not changed.',
    'faq.q4':'When are you open?','faq.a4':'Every day, with continuous service from 12:00 to 24:00. Booking is recommended.',
    'foot.sub':'Tuscan cooking in Brera · since 1959 · Milan',
    'foot.where':'Where','foot.hours':'Hours','foot.hours2':'Every day','foot.contact':'Contact',
    'foot.disclaimer':'Demonstration site. Content and photos gathered from public sources (Google Maps); hours, dishes and prices are indicative, to be confirmed with the trattoria.',
    'ab.call':'Book','ab.menu':'The food','ab.route':'Directions'
  };
  var IT={};
  function snapshotIT(){
    document.querySelectorAll('[data-i18n]').forEach(function(el){IT[el.getAttribute('data-i18n')]=el.innerHTML;});
  }
  function applyLang(lang){
    var dict=lang==='en'?EN:IT;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      if(dict[k]!==undefined)el.innerHTML=dict[k];
      else if(IT[k]!==undefined)el.innerHTML=IT[k];
    });
    document.documentElement.lang=lang;
    document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-lang')===lang);});
    try{sessionStorage.setItem('tdp_lang',lang);}catch(e){}
    renderLive();
  }
  snapshotIT();
  document.querySelectorAll('.lang button').forEach(function(b){
    b.addEventListener('click',function(){applyLang(b.getAttribute('data-lang'));});
  });
  var savedLang='it';try{savedLang=sessionStorage.getItem('tdp_lang')||'it';}catch(e){}
  if(savedLang==='en')applyLang('en');else renderLive();

  /* ---------- REVEAL ---------- */
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
  },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  /* ---------- LIGHTBOX ---------- */
  var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lb-img'),lbClose=document.getElementById('lb-close');
  document.querySelectorAll('.g-item').forEach(function(fig){
    fig.addEventListener('click',function(){
      var full=fig.getAttribute('data-full');if(!full)return;
      lbImg.src=full;var im=fig.querySelector('img');lbImg.alt=im?im.alt:'';
      lb.classList.add('open');lb.setAttribute('aria-hidden','false');
    });
  });
  function closeLb(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');setTimeout(function(){lbImg.src='';},300);}
  if(lbClose)lbClose.addEventListener('click',closeLb);
  if(lb)lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))closeLb();});

  /* ---------- LIVE tick ---------- */
  setInterval(renderLive,60000);
})();

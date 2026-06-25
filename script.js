// === Fixed-width scaling: 390px design, scale to fit any screen ===
(function(){
  var app=document.getElementById('app'), W=390
  // 390px 设计稿等比缩放，适配全屏宽
  function scale(){
    var s = window.innerWidth / W
    if (window.innerWidth >= 1200) {
      // 桌面：CSS 接管，清除 JS 样式
      app.style.transform = ''; app.style.width = ''; app.style.margin = ''
      document.documentElement.style.fontSize = ''
    } else if (s < 1) {
      // <390px：等比缩小 + 负margin 居中，不调字号
      app.style.transform = 'scale(' + s.toFixed(4) + ')'
      app.style.width = '390px'
      app.style.margin = '0 0 0 ' + ((window.innerWidth - 390) / 2).toFixed(1) + 'px'
      document.documentElement.style.fontSize = ''
    } else if (window.innerWidth > 540) {
      // 541-1199px：锁540px宽，黑底，不缩放
      app.style.transform = ''; app.style.width = '540px'; app.style.margin = ''
      document.documentElement.style.fontSize = ''
    } else {
      // 390-540px：放大 ≤1.15倍，字号反向缩小补偿
      var sc = Math.min(s, 1.15)
      app.style.transform = 'scale(' + sc.toFixed(4) + ')'
      app.style.width = '390px'; app.style.margin = ''
      document.documentElement.style.fontSize = sc > 1.125 ? (18 / sc).toFixed(2) + 'px' : ''
    }
  }
  scale();window.addEventListener('resize',scale)
  // On orientation change, recalc after layout
  window.addEventListener('orientationchange',function(){setTimeout(scale,300)})
})()

// Background music — start on first touch/scroll from beginning
const bgmEl = document.getElementById('bgm')
const bgmBtnEl = document.getElementById('bgmBtn')
const v1=document.getElementById('v1'),v2=document.getElementById('v2'),v3=document.getElementById('v3'),v4=document.getElementById('v4')

// WeChat audio unlock
document.addEventListener('WeixinJSBridgeReady',function(){
  bgmEl.play().catch(()=>{})
  bgmEl.pause()
})
function startMusic(){
  if(bgmEl.paused || bgmEl.muted){
    bgmEl.currentTime = 0
    bgmEl.volume = 0.6
    bgmEl.play().then(()=>{
      bgmBtnEl.innerHTML = '&#x1F3B5;'
    }).catch(()=>{})
  }
}

// Autoplay during preload — try immediately, fallback to canplay
if(bgmEl.readyState >= 2){
  startMusic()
} else {
  bgmEl.addEventListener('canplay',function autoStart(){
    bgmEl.removeEventListener('canplay',autoStart)
    startMusic()
  })
}

function toggleBgm(){
  if(bgmEl.paused){
    bgmEl.currentTime = 0
    bgmEl.volume = 1
    bgmEl.play().catch(()=>{})
    bgmBtnEl.innerHTML = '&#x1F3B5;'
  } else {
    bgmEl.pause()
    bgmBtnEl.innerHTML = '&#x1F534;'
  }
}

// === PRELOADER: BGM loads first → autoplay → then images ===
(function(){
  document.body.classList.add('loading')
  var preloader = document.getElementById('preloader')
  var text = preloader.querySelector('.loader-text')
  var imgAssets = ['6.png','assets/p1.webp?v=2','assets/p2.webp?v=2']
  var total = imgAssets.length, loaded = 0
  var doneFlag = false
  var fallback = setTimeout(function(){ done() },15000)
  var bgmReady = false, imgsDone = false

  function checkDone(){
    if(bgmReady && imgsDone) done()
  }
  function done(){
    if(doneFlag) return; doneFlag = true
    clearTimeout(fallback)
    preloader.classList.add('done')
    document.body.classList.remove('loading')
    window.scrollTo(0,0)
    if(typeof updateAll === 'function') setTimeout(updateAll,200)
  }

  // Phase 1: Wait for BGM to be playable, autoplay, then load images
  text.textContent = '长江奔涌······'
  if(bgmEl.readyState >= 2){
    bgmReady = true
    startMusic()
    loadImages()
  } else {
    bgmEl.addEventListener('canplay',function onBgmReady(){
      bgmEl.removeEventListener('canplay',onBgmReady)
      bgmReady = true
      startMusic()
      loadImages()
    })
  }

  function loadImages(){
    text.textContent = '长江奔涌······ 0/' + total
    imgAssets.forEach(function(src){
      var img = new Image()
      function mark(){ loaded++; text.textContent='长江奔涌······ '+loaded+'/'+total; if(loaded>=total){ imgsDone=true; checkDone() } }
      img.onload = mark; img.onerror = mark
      img.src = src
    })
  }
})();

// Map old delay classes to data attributes for scroll-driven stagger
document.querySelectorAll('.reveal').forEach(el=>{
  if(el.classList.contains('reveal-d7')) el.dataset.delay='0.48'
  else if(el.classList.contains('reveal-d6')) el.dataset.delay='0.42'
  else if(el.classList.contains('reveal-d5')) el.dataset.delay='0.35'
  else if(el.classList.contains('reveal-d4')) el.dataset.delay='0.26'
  else if(el.classList.contains('reveal-d3')) el.dataset.delay='0.18'
  else if(el.classList.contains('reveal-d2')) el.dataset.delay='0.1'
  else if(el.classList.contains('reveal-d1')) el.dataset.delay='0.04'
  else el.dataset.delay='0'
})

// Scroll-linked reveal — animation progress follows scroll position
const revealEls = document.querySelectorAll('.reveal')
let ticking = false

// Scroll-driven reveal: appear going down, fade back going up
var _sectionCache=new Map()
function updateReveals(){
  const vh = window.innerHeight
  const threshold = vh * 2
  _sectionCache.clear()
  var i=0,len=revealEls.length
  for(;i<len;i++){
    var el=revealEls[i]
    if(p1Animating && el.closest('#p1')) continue
    var sr = el.closest('.section'); if(!sr) continue
    var srTop = _sectionCache.get(sr)
    if(srTop===undefined){srTop=sr.getBoundingClientRect().top;_sectionCache.set(sr,srTop)}
    if(srTop > threshold || srTop < -vh*3) continue
    const rect = el.getBoundingClientRect()
    const p = Math.max(0, Math.min(1, (vh*0.95 - rect.top) / (vh*0.5)))
    const delay = parseFloat(el.dataset.delay || '0')
    const fp = Math.max(0, Math.min(1, (p - delay) / (1 - delay)))
    el.style.opacity = fp;el.style.transform = `translateY(${(1-fp)*40}px)`
    if(fp>0.5 && !el._loaded){el._loaded=true;el.querySelectorAll('img[data-src]').forEach(function(img){img.src=img.getAttribute('data-src')+'?t='+Date.now()})}
  }
}

// P3 flip cards — scroll-linked row by row reveal
const p3Cards = document.querySelectorAll('#p3 .flip-card')
const p3Section = document.getElementById('p3')
function updateCards(){
  var st = p3Section?p3Section.getBoundingClientRect().top:0, vh=window.innerHeight
  if(st > vh*2 || st < -vh*3) return
  p3Cards.forEach((card,i)=>{
    const rect = card.getBoundingClientRect()
    const start = vh * 0.95
    const end = vh * 0.45
    const range = start - end
    const rowDelay = Math.floor(i/2) * 0.12
    const progress = Math.max(0, Math.min(1, ((start - rect.top) / range) - rowDelay))
    card.style.opacity = progress
    card.style.transform = `translateY(${(1-progress)*24}px)`
  })
}

// Dot entrance — scroll-linked
const allDots = document.querySelectorAll('.dot-hidden')
function updateDots(){
  const vh = window.innerHeight
  allDots.forEach((dot,i)=>{
    const rect = dot.getBoundingClientRect()
    const start = vh * 0.95
    const end = vh * 0.45
    const range = start - end
    const dotDelay = i % 4 * 0.08
    const progress = Math.max(0, Math.min(1, ((start - rect.top) / range) - dotDelay))
    dot.style.opacity = progress
    dot.style.transform = `translate(-50%,${-30 + progress*30}%)`
  })
}

// Stage items scroll-linked fade
function updateStage(){
  const stage = document.getElementById('commentStage')
  if(!stage) return
  const r = stage.getBoundingClientRect()
  const vh = window.innerHeight
  const vis = Math.max(0, Math.min(1, (vh*0.8 - r.top) / (vh*0.4)))
  stage.querySelectorAll('.stage-item.in').forEach(item=>{
    item.style.opacity = vis
    item.style.transform = `translateY(${(1-vis)*20}px)`
  })
}
// Popup follows dot's scroll-linked visibility
function updatePopups(){
  const vh = window.innerHeight
  document.querySelectorAll('.map-popup.open').forEach(p=>{
    const dot = document.querySelector('.map-dot[data-city="'+(p.id.replace('popup-',''))+'"]')
    if(!dot){ p.style.opacity = ''; return }
    const r = dot.getBoundingClientRect()
    const progress = Math.max(0, Math.min(1, (vh*0.95 - r.top) / (vh*0.5)))
    const p2 = Math.max(0, Math.min(1, progress))
    p.style.opacity = p2
    p.style.transform = `scale(${0.96 + p2*0.04})`
  })
}
function updateAll(){
  updateReveals()
  updateCards()
  updateDots()
  updateStage()
  updatePopups()
}

window.addEventListener('scroll',()=>{
  if(!ticking){
    requestAnimationFrame(()=>{
      checkStage()
      ++_frameSkip
      // Batch all updates every 3rd frame for smooth 20fps feel
      if(_frameSkip%3===0){
        updateReveals();updateCards();updateDots();updatePopups();updateStage()
      }
      ticking = false
    })
    ticking = true
  }
},{passive:true})
var _frameSkip=0
// Clone flip icons to bottom-right corner
document.querySelectorAll('.flip-front .flip-icon, .flip-back .flip-icon').forEach(icon=>{
  const clone = icon.cloneNode(true)
  clone.className = 'flip-icon-br'
  icon.parentElement.appendChild(clone)
})

// P1 title auto-animate on page load
const p1Reveals = document.querySelectorAll('#p1 .reveal')
let p1Animating = true
p1Reveals.forEach((el,i)=>{
  el.style.transition = 'opacity 1.2s cubic-bezier(0.22,1,0.36,1), transform 1.2s cubic-bezier(0.22,1,0.36,1)'
  el.style.transitionDelay = (0.3 + i * 0.4) + 's'
  setTimeout(()=>{
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
    // Load data-src images in this reveal
    el.querySelectorAll('img[data-src]').forEach(function(img){
      img.src=img.getAttribute('data-src')+'?t='+Date.now()
    })
  },100)
})
// Remove CSS transitions so scroll-driven can take over smoothly
setTimeout(()=>{p1Reveals.forEach(el=>{el.style.transition='';el.style.transitionDelay=''});p1Animating=false},3500)


function resetAll(){
  // Reset P7
  lit = false
  document.getElementById('promiseCard').classList.remove('show')
  document.getElementById('dropletStage').classList.remove('show')
  document.getElementById('endingClose').classList.remove('show')
  document.getElementById('endingNext').style.opacity = '0'
  document.getElementById('backTopBtn').style.opacity = '0'
  document.getElementById('backTopBtn').style.pointerEvents = 'none'
  document.getElementById('dropletBtn').classList.remove('rippled')
  document.querySelectorAll('.vision-item').forEach(v=>v.classList.remove('lit'))
  document.getElementById('cardName').textContent = '长江守护者'
  document.querySelectorAll('.ripple-ring').forEach(r=>r.remove())
  // Reset lazy-loaded images so they replay from start
  document.querySelectorAll('.reveal').forEach(function(el){el._loaded=false})

  // Close all chat bubbles, flipped cards (popups stay open)
  document.querySelectorAll('.chat-msg').forEach(m=>{m.classList.remove('expanded');m.classList.remove('dimmed')})
  document.querySelectorAll('.flip-card').forEach(c=>c.classList.remove('flipped'))
  // Reset P6
  stageTriggered = false
  document.querySelectorAll('.stage-item').forEach(s=>s.classList.remove('in'))
  document.getElementById('commentInput').value = ''
  // Reset P7 auto-trigger
  p7triggered = false; p7manual = false
  // Quick flip-back scroll animation
  const startY = window.scrollY, duration = 600, startT = performance.now()
  function flipBack(now){
    const elapsed = now - startT
    const progress = Math.min(1, elapsed / duration)
    const ease = 1 - Math.pow(1 - progress, 3) // ease-out
    window.scrollTo(0, startY * (1 - ease))
    if(progress < 1) requestAnimationFrame(flipBack)
  }
  requestAnimationFrame(flipBack)
  setTimeout(updateAll,100)
}
// P7 Plan A: Promise card
function makePromise(isAuto){
  const name = '长江守护者'
  document.getElementById('cardName').textContent = name
  const d = new Date()
  document.getElementById('cardDate').textContent = d.getFullYear()+' 年 '+(d.getMonth()+1)+' 月'
  document.getElementById('promiseCard').classList.add('show')
  setTimeout(()=>{
    document.getElementById('dropletStage').classList.add('show')
    var vs = [v1,v2,v3,v4]
    vs.forEach(function(v,i){
      v.style.opacity = '1'
      v.style.transform = 'translateY(0)'
      v.style.transitionDelay = (i*0.1)+'s'
    })
    document.getElementById('endingClose').style.opacity = '0.4'
    document.getElementById('endingNext').style.opacity = '0.35'
    // Only auto-trigger droplet when called from scroll observer
    if(isAuto) setTimeout(()=>{ lightUp() },200)
  },600)
}

// P7 Plan B: Droplet ripple + vision light-up
let lit = false
function lightUp(){
  if(lit) return
  lit = true
  const btn = document.getElementById('dropletBtn')
  const wrap = document.getElementById('dropletWrap')
  btn.classList.add('rippled')
  for(let i=0;i<3;i++){
    const ring = document.createElement('div')
    ring.className = 'ripple-ring'
    wrap.appendChild(ring)
    setTimeout(()=>ring.remove(),1500)
  }
  const visions = [v1,v2,v3,v4]
  visions.forEach((v,i)=>{
    setTimeout(()=>{
      v.classList.add('lit')
      v.style.opacity = ''; v.style.transform = ''
    },i*250)
  })
  setTimeout(()=>{
    var ec = document.getElementById('endingClose')
    ec.classList.add('show'); ec.style.opacity = ''
  },4*250)
  setTimeout(()=>{
    var en = document.getElementById('endingNext')
    en.style.opacity = '1'
  },4*250+400)
  // Show back-top button
  setTimeout(()=>{
    var btn = document.getElementById('backTopBtn')
    btn.style.transition = 'opacity 1.2s cubic-bezier(0.22,1,0.36,1)'
    btn.style.opacity = '1'
    btn.style.pointerEvents = 'auto'
  },4*250+800)
}

// Chat bubbles — narration plays alongside BGM
function playAudio(id){
  var a = document.getElementById(id)
  if(a.paused){
    // Stop other story audios
    document.querySelectorAll('audio').forEach(function(el){
      if(el!==a && el!==bgmEl){el.pause();el.currentTime=0}
    })
    // Duck BGM if playing
    if(!bgmEl.paused){
      bgmEl._origVol = bgmEl.volume
      fadeVol(bgmEl, 0.3)
    }
    a.play().catch(function(e){console.log('audio play error:',e)})
    a.onended = function(){
      if(bgmEl._origVol !== undefined) fadeVol(bgmEl, bgmEl._origVol)
    }
  } else {
    a.pause(); a.currentTime = 0
    if(bgmEl._origVol !== undefined){ fadeVol(bgmEl, bgmEl._origVol); delete bgmEl._origVol }
  }
}
// P3 video: duck BGM on play, restore on pause/end
(function(){
  var v=document.getElementById('p3Video'); if(!v) return
  v.addEventListener('ended',function(){if(bgmEl._origVol!==undefined){var o=bgmEl._origVol;delete bgmEl._origVol;fadeVol(bgmEl,o)}})
  // Auto pause/play on scroll — don't affect BGM
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        if(v._wasPlaying){v._auto=true;v.play().catch(function(){})}
      } else {
        if(!v.paused){v._wasPlaying=true;v._auto=true;v.pause()}
      }
    })
  },{threshold:0.1})
  observer.observe(v)
  // Only react to user-triggered play/pause for BGM
  v.addEventListener('play',function(){
    if(v._auto){v._auto=false;return}
    if(!bgmEl.paused){
      var vol = isNaN(bgmEl.volume)?1:bgmEl.volume
      if(vol<0.02) vol=1
      bgmEl._origVol=vol
      fadeVol(bgmEl,0.15)
    }
  })
  v.addEventListener('pause',function(){
    if(v._auto){v._auto=false;return}
    if(bgmEl._origVol!==undefined){
      var orig = bgmEl._origVol
      delete bgmEl._origVol
      fadeVol(bgmEl,orig)
    }
  })
})()

function fadeVol(el, target){
  var step = (target - el.volume) / 15
  clearInterval(el._fade)
  el._fade = setInterval(function(){
    if(Math.abs(el.volume - target) < 0.02){ el.volume = target; clearInterval(el._fade) }
    else el.volume += step
  }, 30)
}
function toggleChat(el){
  const isExpanded = el.classList.contains('expanded')
  // Close all others, dim all
  document.querySelectorAll('.chat-msg').forEach(m=>{m.classList.remove('expanded');m.classList.remove('dimmed')})
  if(!isExpanded){
    el.classList.add('expanded')
    // Dim others
    document.querySelectorAll('.chat-msg').forEach(m=>{if(m!==el)m.classList.add('dimmed')})
  }
}

// Map dots & popups — always visible, no click interaction
// Init: position all popups next to their dots on load
(function initPopups(){
  const popupSide = {chongqing:'right', wuhan:'left', nanjing:'right', nanchang:'left', yichang:'right', yueyang:'left', maanshan:'right', suzhou:'left'}
  document.querySelectorAll('.map-popup').forEach(popup=>{
    const city = popup.id.replace('popup-','')
    const dot = document.querySelector('.map-dot[data-city="'+city+'"]')
    if(!dot) return
    const section = dot.closest('.section')
    const sRect = section.getBoundingClientRect()
    const dRect = dot.getBoundingClientRect()
    const topPct = ((dRect.top + dRect.height/2 - sRect.top) / sRect.height * 100)
    const side = popupSide[city]
    const minTop = section.id === 'p4' ? 18 : 16
    popup.style.top = Math.max(minTop, Math.min(72, topPct - 6)) + '%'
    if(side === 'right'){
      popup.style.left = ((dRect.right - sRect.left) / sRect.width * 100 + 2) + '%'
      popup.style.borderLeft = '2.5px solid var(--gold)'
    } else {
      popup.style.right = ((sRect.right - dRect.left) / sRect.width * 100 + 2) + '%'
      popup.style.borderRight = '2.5px solid var(--gold)'
    }
  })
})()

// Comment stage — trigger items to animate in when stage enters viewport
let stageTriggered = false
function checkStage(){
  if(stageTriggered) return
  const stage = document.getElementById('commentStage')
  if(!stage) return
  const r = stage.getBoundingClientRect()
  if(r.top < window.innerHeight * 0.85){
    stageTriggered = true
    document.querySelectorAll('.stage-item').forEach(item=>{
      const d = parseFloat(item.dataset.delay || '0')
      setTimeout(()=>item.classList.add('in'), d*1000)
    })
  }
}
// Hook into existing scroll
const origUpdateAll = updateAll
updateAll = function(){ origUpdateAll(); checkStage() }

// Auto-trigger P7: when data source appears, show promise card → droplet → visions
var p7triggered = false, p7manual = false
var p7observer = new IntersectionObserver(function(entries){
  if(entries[0].isIntersecting && !p7triggered && !p7manual){
    p7triggered = true
    makePromise(true)
  }
},{threshold:0.2})
var endingSrc = document.getElementById('endingSource')
if(endingSrc) p7observer.observe(endingSrc)

// User comment posting
document.getElementById('commentBtn').addEventListener('click',postComment)
document.getElementById('commentInput').addEventListener('keydown',e=>{if(e.key==='Enter')postComment()})
function postComment(){
  const input = document.getElementById('commentInput')
  const text = input.value.trim()
  if(!text) return
  const stage = document.getElementById('commentStage')
  const card = document.createElement('div')
  card.className = 'comment-card pos stage-item in'
  card.style.cssText = 'background:linear-gradient(135deg,rgba(91,158,148,0.18),rgba(212,163,89,0.12));border-left:3px solid var(--gold)'
  card.innerHTML = '“'+text+'”<div class="card-user">—— 刚刚<span class="card-tag">&#x1F331;</span></div>'
  stage.appendChild(card)
  stage.scrollTop = stage.scrollHeight
  input.value = ''
}
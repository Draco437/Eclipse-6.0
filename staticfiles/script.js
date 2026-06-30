(function () {
  var pills = [
    { id: 'p0', bx: 0.08, by: 0.38, ax: 0,  ay: -8, spd: 0.0016, phase: 0.0 },
    { id: 'p1', bx: 0.30, by: 0.55, ax: 6,  ay:  0, spd: 0.0020, phase: 1.0 },
    { id: 'p2', bx: 0.38, by: 0.72, ax: 0,  ay:  7, spd: 0.0014, phase: 2.1 },
    { id: 'p3', bx: 0.55, by: 0.65, ax: -5, ay:  0, spd: 0.0018, phase: 0.7 },
    { id: 'p4', bx: 0.72, by: 0.70, ax: 0,  ay: -9, spd: 0.0022, phase: 1.8 },
    { id: 'p5', bx: 0.87, by: 0.30, ax: 7,  ay:  0, spd: 0.0016, phase: 3.0 }
  ];

  var wrap = document.getElementById('heroWrap');
  var els = pills.map(function (p) { return document.getElementById(p.id); });
  var start = null;

  function place() {
    var W = wrap.offsetWidth;
    var H = wrap.offsetHeight;
    pills.forEach(function (p, i) {
      var pw = els[i].offsetWidth;
      var ph = els[i].offsetHeight;
      p.cx = p.bx * W - pw / 2;
      p.cy = p.by * H - ph / 2;
    });
  }

  function tick(ts) {
    if (!start) start = ts;
    var t = ts - start;
    pills.forEach(function (p, i) {
      var angle = t * p.spd + p.phase;
      var dx = Math.cos(angle) * p.ax + Math.sin(angle * 1.3) * (p.ax * 0.4);
      var dy = Math.sin(angle) * p.ay + Math.cos(angle * 0.9) * (p.ay * 0.4);
      els[i].style.left = (p.cx + dx) + 'px';
      els[i].style.top  = (p.cy + dy) + 'px';
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', place);

  document.fonts.ready.then(function () {
    place();
    requestAnimationFrame(tick);
  });
})();

(function () {
  var path = document.getElementById('tlPath');
  var dot  = document.getElementById('movingDot');

  if (!path || !dot) return;

  var totalLength = path.getTotalLength();
  var start       = null;
  var DURATION    = 10000; 

  var milestones = [
    { progress: 0.00, idx: 1 },
    { progress: 0.22, idx: 2 },
    { progress: 0.46, idx: 3 },
    { progress: 0.70, idx: 4 },
    { progress: 0.96, idx: 5 },
  ];

  var WINDOW      = 0.07;
  var lastActive  = -1;

  function setActive(idx) {
    for (var i = 1; i <= 5; i++) {
      var on = (i === idx);

      var num = document.getElementById('num' + i);
        num.setAttribute('fill', on ? 'url(#tlNumActive)' : 'url(#tlNumInactive)');
        num.setAttribute('font-size', on ? '175' : '150');

      var dateEl = document.getElementById('label' + i + '-date');
        dateEl.setAttribute('fill', on ? '#57BAE4' : 'white');
        dateEl.setAttribute('font-size', on ? '26' : '22');

      var subEl = document.getElementById('label' + i + '-sub');
        subEl.setAttribute('fill', on ? 'rgba(87,186,228,0.75)' : 'rgba(255,255,255,0.45)');
        subEl.setAttribute('font-size', on ? '22' : '18');
    }
  }

  function animateDot(ts) {
    if (!start) start = ts;

    var elapsed  = (ts - start) % DURATION;
    var progress = elapsed / DURATION;

    var eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    var point = path.getPointAtLength(eased * totalLength);
    dot.setAttribute('cx', point.x);
    dot.setAttribute('cy', point.y);

    var closest = -1;
    var minDist = WINDOW;
    milestones.forEach(function (m) {
      var dist = Math.abs(eased - m.progress);
      if (dist < minDist) { minDist = dist; closest = m.idx; }
    });

    if (closest !== lastActive) {
      setActive(closest);
      lastActive = closest;
    }

    requestAnimationFrame(animateDot);
  }

  requestAnimationFrame(animateDot);
})();


const faqs = document.querySelectorAll(".faq-item");

faqs.forEach(faq => {
    faq.querySelector(".faq-question").addEventListener("click", () => {

        faq.classList.toggle("active");

    });
});

document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });

function fitBgText() {
    const el = document.querySelector(".hero-bg-text");
    if (!el) return;

    const baseSize = 100;
    el.style.fontSize = baseSize + "px";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    ctx.font = `900 ${baseSize}px Montserrat`;

    const textWidth = ctx.measureText(el.textContent.trim()).width;

    const ratio = (window.innerWidth * 0.98) / textWidth;

    el.style.fontSize = (baseSize * ratio) + "px";
}

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitBgText);
} else {
    window.addEventListener("load", fitBgText);
}

window.addEventListener("resize", fitBgText);

document.addEventListener("DOMContentLoaded", () => {
  const aboutSection = document.querySelector("#about");
  const bubbleBox = document.querySelector(".about-bubble-box");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bubbleBox.classList.add("animate-now");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15 
  });

  if (aboutSection && bubbleBox) {
    observer.observe(aboutSection);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // 1. Target your updated HTML IDs and class elements
  const openBtn = document.getElementById('menuOpenBtn');
  const closeBtn = document.getElementById('closeMenu'); // Updated to match your sidebar close button ID
  const backdrop = document.getElementById('menuBackdrop');

  // Select the brand new sidebar drawer container and its links
  const sidebarMenu = document.getElementById('sidebarMenu'); 
  const individualLinks = document.querySelectorAll('.sidebar-links a');

  function openDrawerMenu() {
    // Uses the .active modifier state class expected by your updated CSS rules
    if (sidebarMenu) sidebarMenu.classList.add('active');
    if (backdrop) {
      backdrop.classList.add('active');
      backdrop.style.opacity = "1";
      backdrop.style.pointerEvents = "auto";
    }
    document.body.style.overflow = 'hidden'; 
  }

  function closeDrawerMenu() {
    if (sidebarMenu) sidebarMenu.classList.remove('active');
    if (backdrop) {
      backdrop.classList.remove('active');
      backdrop.style.opacity = "0";
      backdrop.style.pointerEvents = "none";
    }
    document.body.style.overflow = ''; 
  }

  // Safe checks to bind event listeners if the core elements exist
  if (openBtn) openBtn.addEventListener('click', openDrawerMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawerMenu);
  if (backdrop) backdrop.addEventListener('click', closeDrawerMenu);

  // Auto collapse slide-out menu drawer upon navigating to section anchor tags
  individualLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawerMenu();
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const tooltipBtn = document.getElementById('oumiTooltipBtn');
  const popupCard = document.getElementById('oumiPopupCard');

  if (tooltipBtn && popupCard) {
    tooltipBtn.addEventListener('click', (event) => {
      event.stopPropagation(); 
      popupCard.classList.toggle('show-popup');
    });

    window.addEventListener('click', (event) => {
      if (!popupCard.contains(event.target) && event.target !== tooltipBtn) {
        popupCard.classList.remove('show-popup');
      }
    });
  }
});
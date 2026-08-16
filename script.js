/* =========================================================
   Zion Electrical & Plumbing — shared site script
   Loaded on every page. Every block checks the element it
   needs actually exists on THIS page before running, so one
   file can safely be shared across index/about/gallery/areas/contact.
   ========================================================= */

/* ---- Back to top button (present on every page) ---- */
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) backToTopBtn.classList.add("show");
    else backToTopBtn.classList.remove("show");
  });
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---- Rolling number counters (Home page stats only) ---- */
const statsSection = document.querySelector('.stats');
if (statsSection) {
  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const speed = 50;
      const increment = target / speed;
      let currentCount = 0;

      const updateCount = () => {
        if (currentCount < target) {
          currentCount += increment;
          if (target === 4.6) {
            counter.innerText = Math.min(currentCount, target).toFixed(1) + "★";
          } else if (target === 100) {
            counter.innerText = Math.min(Math.ceil(currentCount), target) + "%";
          } else {
            counter.innerText = Math.min(Math.ceil(currentCount), target) + "+";
          }
          setTimeout(updateCount, 20);
        } else {
          if (target === 4.6) counter.innerText = "4.6★";
          else if (target === 100) counter.innerText = "100%";
          else counter.innerText = target + "+";
        }
      };
      updateCount();
    });
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statsObserver.observe(statsSection);
}

/* ---- Gallery lightbox (Gallery page only, but harmless elsewhere) ---- */
function openLB(src) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  if (!lb || !lbImg) return;
  lb.classList.remove('closing');
  lbImg.src = src;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLB() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.add('closing');
  setTimeout(() => {
    lb.classList.remove('active', 'closing');
    document.body.style.overflow = '';
  }, 350);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLB();
});

/* ---- "Why choose us" circling card border (About page) ---- */
(function () {
  const cards = document.querySelectorAll('.why-card');
  if (!cards.length) return;

  const STROKE_W = 3, RADIUS = 16, DASH_LEN = 200, DURATION = 4.9;
  const styleEl = document.createElement('style');
  document.head.appendChild(styleEl);

  function setup() {
    document.querySelectorAll('.why-card').forEach((card, idx) => {
      const W = card.offsetWidth, H = card.offsetHeight;
      if (!W || !H) return;

      const perim = 2 * (W - 2 * RADIUS) + 2 * (H - 2 * RADIUS) + 2 * Math.PI * RADIUS;

      let svg = card.querySelector('.why-card-svg');
      if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('why-card-svg');
        svg.setAttribute('aria-hidden', 'true');
        svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'rect'));
        card.appendChild(svg);
      }

      const rect = svg.querySelector('rect');
      const half = STROKE_W / 2;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.setAttribute('width', W);
      svg.setAttribute('height', H);
      rect.setAttribute('x', half);
      rect.setAttribute('y', half);
      rect.setAttribute('width', W - STROKE_W);
      rect.setAttribute('height', H - STROKE_W);
      rect.setAttribute('rx', RADIUS - half);
      rect.setAttribute('ry', RADIUS - half);
      rect.setAttribute('stroke-dasharray', `${DASH_LEN} ${perim - DASH_LEN}`);

      const animName = `whyBorder${idx}`;
      const rule = `@keyframes ${animName}{from{stroke-dashoffset:0}to{stroke-dashoffset:${-perim.toFixed(2)}}}`;
      try {
        const sheet = styleEl.sheet;
        for (let i = sheet.cssRules.length - 1; i >= 0; i--)
          if (sheet.cssRules[i].name === animName) sheet.deleteRule(i);
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {}

      rect.style.animation = `${animName} ${DURATION}s linear infinite`;
    });
  }

  window.addEventListener('load', setup);
  window.addEventListener('resize', () => { clearTimeout(window._whyT); window._whyT = setTimeout(setup, 150); });
})();

/* ---- Hero background image slider (Home page only) ---- */
(function () {
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;

  /* ── ADD YOUR IMAGE FILENAMES HERE ── */
  const images = [
    'hero1.jpg',
    'hero2.jpg',
    'hero3.jpg'
  ];

  images.forEach((src, i) => {
    const s = document.createElement('span');
    s.style.backgroundImage = `url('${src}')`;
    s.style.opacity = i === 0 ? 1 : 0;
    bg.appendChild(s);
  });

  const spans = bg.querySelectorAll('span');
  let cur = 0;
  setInterval(() => {
    spans[cur].style.opacity = 0;
    cur = (cur + 1) % spans.length;
    spans[cur].style.opacity = 1;
  }, 5000); // ms per image
})();

/* ---- Cursor dot (present on every page) ---- */
(function () {
  const dot = document.getElementById('cursorDot');
  if (!dot) return;
  let x = 0, y = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
  function animate() {
    tx += (x - tx) * 0.15;
    ty += (y - ty) * 0.15;
    dot.style.left = tx + 'px';
    dot.style.top = ty + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();

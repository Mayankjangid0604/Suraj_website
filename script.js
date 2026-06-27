document.getElementById('year').textContent = new Date().getFullYear();

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* Scroll-triggered reveal with stagger, per parent grid */
const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-3d], [data-reveal-scale]');
const groups = new Map();
revealTargets.forEach(el => {
  const parent = el.parentElement;
  if (!groups.has(parent)) groups.set(parent, []);
  groups.get(parent).push(el);
});
groups.forEach(list => {
  list.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 90, 360)}ms`; });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));

/* 3D tilt-on-hover for cards */
const tiltEls = document.querySelectorAll('[data-tilt]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
  tiltEls.forEach(el => {
    const max = parseFloat(el.dataset.tiltMax) || 10;
    let frame = null;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(6px)`;
      });
    });

    el.addEventListener('mouseleave', () => {
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = '';
    });
  });
}

/* Parallax depth for hero on scroll */
const heroContent = document.querySelector('.hero-content');
const heroBg = document.querySelector('.hero-bg');
if (heroContent && heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroContent.style.transform = `translateY(${y * 0.25}px)`;
      heroBg.style.transform = `translateY(${y * 0.12}px) scale(${1 + y * 0.0002})`;
    }
  }, { passive: true });
}

/* Slow continuous 3D drift for the about logo emblem */
const logoCard = document.getElementById('logoRing');
if (logoCard && !prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    const rect = logoCard.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const clamped = Math.max(-1, Math.min(1, progress * 2 - 1));
    logoCard.parentElement.parentElement.style.transform = `perspective(1200px) rotateY(${clamped * 6}deg)`;
  }, { passive: true });
}

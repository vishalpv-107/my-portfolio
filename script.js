// Utility: select
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

// Mobile nav
const hamburger = $('.hamburger');
const navLinks = $('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });
}

// Active nav link on scroll
const sections = $$('#home, #about, #education, #experience, #projects, #skills, #contact');
const navAnchors = $$('.nav-links a');
let lastClickedEl = null;
navAnchors.forEach(a => {
  a.addEventListener('click', () => {
    lastClickedEl = a;
  });
});
const setActive = (id) => {
  const target = `#${id}`;
  const matches = navAnchors.filter(a => a.getAttribute('href') === target);
  navAnchors.forEach(a => a.classList.remove('active'));
  if (matches.length === 1) {
    matches[0].classList.add('active');
  } else if (matches.length > 1) {
    const chosen = (lastClickedEl && matches.includes(lastClickedEl)) ? lastClickedEl : matches[0];
    chosen.classList.add('active');
  }
};
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
}, { rootMargin: '-30% 0px -60% 0px', threshold: 0.1 });
sections.forEach(s => io.observe(s));

// Typewriter effect for "Full Stack Java Developer"
const typewriterTarget = document.getElementById('typewriter');
const phrase = 'Full Stack Java Developer';
let idx = 0;
let direction = 1; // 1 typing, -1 deleting
let pause = 0;
function tick() {
  if (!typewriterTarget) return;
  if (pause > 0) { pause -= 1; return; }
  typewriterTarget.textContent = phrase.slice(0, idx);
  if (direction === 1) {
    if (idx < phrase.length) {
      idx += 1;
    } else {
      direction = -1; pause = 40; // hold full text
    }
  } else {
    if (idx > 0) {
      idx -= 1;
    } else {
      direction = 1; pause = 20; // small pause before retyping
    }
  }
}
setInterval(tick, 60);

// Resume auto-download fallback if "download" not honored
const resumeBtn = document.getElementById('resumeBtn');
if (resumeBtn) {
  resumeBtn.addEventListener('click', (e) => {
    // In some browsers or servers, download attr may not trigger. Force programmatic download.
    const href = resumeBtn.getAttribute('href');
    if (!href) return;
    // If same-origin and accessible, attempt fetch + blob download
    fetch(href).then(r => r.blob()).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'resume.pdf';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }).catch(() => {
      // Fallback to default behavior
    });
  });
}

// Contact form validation (simple client-side)
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
function setError(input, message) {
  const field = input.closest('.form-field');
  if (!field) return;
  const err = $('.error', field);
  if (err) err.textContent = message || '';
}
function validEmail(email) {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
}
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = '';

    const name = $('#name');
    const email = $('#email');
    const message = $('#message');

    let ok = true;
    if (!name.value.trim()) { setError(name, 'Name is required'); ok = false; } else setError(name, '');
    if (!email.value.trim()) { setError(email, 'Email is required'); ok = false; }
    else if (!validEmail(email.value.trim())) { setError(email, 'Enter a valid email'); ok = false; } else setError(email, '');
    if (!message.value.trim()) { setError(message, 'Message is required'); ok = false; } else setError(message, '');

    if (!ok) return;

    // Simulate submit
    setTimeout(() => {
      formStatus.textContent = 'Thanks! Your message has been sent.';
      form.reset();
    }, 500);
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());



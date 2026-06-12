// ============ SCROLL PROGRESS + NAVBAR ============
const progressBar = document.getElementById('progressBar');
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';

  navbar.classList.toggle('scrolled', scrollTop > 30);
  backToTop.classList.toggle('show', scrollTop > 500);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ MOBILE MENU ============
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ============ DARK MODE TOGGLE ============
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('modicare-theme');
if (savedTheme === 'dark') root.setAttribute('data-theme', 'dark');

themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  if (isDark) {
    root.removeAttribute('data-theme');
    localStorage.setItem('modicare-theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('modicare-theme', 'dark');
  }
});

// ============ SCROLL REVEAL ============
const revealEls = document.querySelectorAll('.fade-up, .slide-left, .slide-right, .reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ============ COUNTER ANIMATION ============
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

// ============ COUNTDOWN TO OPENING ============
const openingDate = new Date('2026-07-01T00:00:00');
const cdDays = document.getElementById('cdDays');
const cdHours = document.getElementById('cdHours');
const cdMins = document.getElementById('cdMins');
const cdSecs = document.getElementById('cdSecs');

function updateCountdown() {
  const now = new Date();
  let diff = openingDate - now;

  if (diff <= 0) {
    cdDays.textContent = '00';
    cdHours.textContent = '00';
    cdMins.textContent = '00';
    cdSecs.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  cdDays.textContent = String(days).padStart(2, '0');
  cdHours.textContent = String(hours).padStart(2, '0');
  cdMins.textContent = String(mins).padStart(2, '0');
  cdSecs.textContent = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============ TESTIMONIALS SLIDER ============
const slides = document.querySelectorAll('.testimonial-slide');
const dotsContainer = document.getElementById('testiDots');
let currentSlide = 0;

slides.forEach((_, i) => {
  const dot = document.createElement('span');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => showSlide(i));
  dotsContainer.appendChild(dot);
});

function showSlide(index) {
  slides[currentSlide].classList.remove('active');
  dotsContainer.children[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dotsContainer.children[currentSlide].classList.add('active');
}

setInterval(() => {
  const next = (currentSlide + 1) % slides.length;
  showSlide(next);
}, 5000);

// ============ FAQ ACCORDION ============
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ============ CONTACT FORM VALIDATION ============
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function validateField(input, errorEl, validator, message) {
  const value = input.value.trim();
  if (!validator(value)) {
    input.classList.add('invalid');
    errorEl.textContent = message;
    return false;
  }
  input.classList.remove('invalid');
  errorEl.textContent = '';
  return true;
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('cfName');
  const phone = document.getElementById('cfPhone');
  const email = document.getElementById('cfEmail');
  const message = document.getElementById('cfMessage');

  const validName = validateField(name, document.getElementById('errName'),
    v => v.length >= 2, 'Please enter your name.');

  const validPhone = validateField(phone, document.getElementById('errPhone'),
    v => /^[0-9+\-\s]{7,15}$/.test(v), 'Enter a valid phone number.');

  const validEmail = validateField(email, document.getElementById('errEmail'),
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email address.');

  const validMessage = validateField(message, document.getElementById('errMessage'),
    v => v.length >= 10, 'Message should be at least 10 characters.');

  if (validName && validPhone && validEmail && validMessage) {

    const formData = new FormData(contactForm);

    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (response.ok) {
      formSuccess.classList.add('show');
      contactForm.reset();

      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 5000);
    } else {
      alert("Something went wrong. Try again.");
    }

  }
});

// ============ NEWSLETTER FORM ============
const newsletterForm = document.getElementById('newsletterForm');
const nlSuccess = document.getElementById('nlSuccess');

newsletterForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('nlEmail');

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

  if (!isValid) return;

  const formData = new FormData(newsletterForm);

  const response = await fetch(newsletterForm.action, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json"
    }
  });

  if (response.ok) {
    nlSuccess.classList.add('show');
    newsletterForm.reset();

    setTimeout(() => {
      nlSuccess.classList.remove('show');
    }, 5000);
  } else {
    alert("Subscription failed. Try again.");
  }
});

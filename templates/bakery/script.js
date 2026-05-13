const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('siteNav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => siteNav.classList.remove('open'));
  });
}

const slides = [...document.querySelectorAll('.hero-slide')];
const prevBtn = document.getElementById('prevHero');
const nextBtn = document.getElementById('nextHero');
const dotsWrap = document.getElementById('heroDots');
let currentSlide = 0;
let sliderInterval = null;

function createDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsWrap.appendChild(dot);
  });
}

function updateDots() {
  if (!dotsWrap) return;
  [...dotsWrap.children].forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function goToSlide(index) {
  slides[currentSlide].classList.remove('is-active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('is-active');
  updateDots();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

function startAutoplay() {
  sliderInterval = setInterval(nextSlide, 5200);
}

function resetAutoplay() {
  clearInterval(sliderInterval);
  startAutoplay();
}

if (slides.length > 0) {
  createDots();
  updateDots();
  startAutoplay();

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });
}

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((item) => revealObserver.observe(item));

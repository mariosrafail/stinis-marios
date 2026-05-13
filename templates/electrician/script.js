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
const prevHero = document.getElementById('prevHero');
const nextHero = document.getElementById('nextHero');
const heroDots = document.getElementById('heroDots');
let current = 0;
let timer = null;

function buildDots() {
  if (!heroDots) return;
  heroDots.innerHTML = '';

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    heroDots.appendChild(dot);
  });
}

function paintDots() {
  if (!heroDots) return;
  [...heroDots.children].forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
  });
}

function goTo(index) {
  slides[current].classList.remove('is-active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('is-active');
  paintDots();
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

function runAuto() {
  timer = setInterval(next, 5200);
}

function restartAuto() {
  clearInterval(timer);
  runAuto();
}

if (slides.length > 0) {
  buildDots();
  paintDots();
  runAuto();

  nextHero?.addEventListener('click', () => {
    next();
    restartAuto();
  });

  prevHero?.addEventListener('click', () => {
    prev();
    restartAuto();
  });
}

const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const slots = document.getElementById('slots');
const form = document.getElementById('appointmentForm');
const result = document.getElementById('result');

const baseSlots = ['08:00', '09:00', '10:30', '12:00', '14:00', '16:30', '18:00', '20:00'];
const today = new Date();
const todayISO = today.toISOString().split('T')[0];
dateInput.min = todayISO;
dateInput.value = todayISO;

function hashSeed(value) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function getAvailable(dateStr) {
  const seed = hashSeed(dateStr || todayISO);
  return baseSlots.filter((slot, index) => (seed + index * 11) % 4 !== 0);
}

function renderTimeSlots() {
  const available = getAvailable(dateInput.value);

  timeInput.innerHTML = '<option value="">Επιλέξτε ώρα</option>';
  available.forEach((slot) => {
    const option = document.createElement('option');
    option.value = slot;
    option.textContent = slot;
    timeInput.appendChild(option);
  });

  slots.innerHTML = '';
  available.forEach((slot) => {
    const div = document.createElement('div');
    div.className = 'slot-item';
    div.innerHTML = `<strong>${slot}</strong><span>Διαθέσιμο</span>`;
    slots.appendChild(div);
  });
}

dateInput.addEventListener('change', renderTimeSlots);
renderTimeSlots();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const date = dateInput.value;
  const time = timeInput.value;

  if (!name || !phone || !service || !date || !time) {
    result.textContent = 'Συμπλήρωσε όλα τα απαραίτητα πεδία.';
    return;
  }

  result.innerHTML = `Το ραντεβού καταχωρήθηκε για <strong>${name}</strong> στις <strong>${time}</strong> (${date}) για <strong>${service}</strong>. Θα επικοινωνήσουμε άμεσα στο ${phone}.`;
  form.reset();
  dateInput.value = todayISO;
  renderTimeSlots();
});

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

reveals.forEach((item) => observer.observe(item));

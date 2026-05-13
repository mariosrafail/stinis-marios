const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('siteNav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => siteNav.classList.toggle('open'));
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => siteNav.classList.remove('open'));
  });
}

const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const slotsList = document.getElementById('slotsList');
const bookingForm = document.getElementById('bookingForm');
const bookingResult = document.getElementById('bookingResult');

const slotsBase = ['09:00', '10:30', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
const today = new Date();
const isoToday = today.toISOString().split('T')[0];
dateInput.min = isoToday;
dateInput.value = isoToday;

function seed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function availableSlots(date) {
  const s = seed(date || isoToday);
  return slotsBase.filter((slot, i) => (s + i * 7) % 5 !== 0);
}

function renderSlots() {
  const slots = availableSlots(dateInput.value);

  timeInput.innerHTML = '<option value="">Επίλεξε ώρα</option>';
  slots.forEach((slot) => {
    const option = document.createElement('option');
    option.value = slot;
    option.textContent = slot;
    timeInput.appendChild(option);
  });

  slotsList.innerHTML = '';
  slots.forEach((slot) => {
    const div = document.createElement('div');
    div.className = 'slot';
    div.innerHTML = `<strong>${slot}</strong><span>available</span>`;
    slotsList.appendChild(div);
  });
}

renderSlots();
dateInput.addEventListener('change', renderSlots);

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const date = dateInput.value;
  const time = timeInput.value;
  const duration = document.getElementById('duration').value;

  if (!name || !email || !date || !time || !duration) {
    bookingResult.textContent = 'Συμπλήρωσε όλα τα πεδία για κράτηση.';
    return;
  }

  bookingResult.innerHTML = `Booking confirmed για <strong>${name}</strong> στις <strong>${time}</strong> (${date}) για <strong>${duration}</strong>. Στείλαμε λεπτομέρειες στο ${email}.`;

  bookingForm.reset();
  dateInput.value = isoToday;
  renderSlots();
});

const revealItems = document.querySelectorAll('.reveal');
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

revealItems.forEach((item) => observer.observe(item));

const hero = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (!hero) return;
  hero.style.transform = `scale(1.08) translateY(${window.scrollY * 0.04}px)`;
});

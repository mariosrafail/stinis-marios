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

const hours = ['08:30', '09:30', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'];
const today = new Date();
const todayISO = today.toISOString().split('T')[0];
dateInput.min = todayISO;
dateInput.value = todayISO;

function hash(value) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function getSlots(date) {
  const seed = hash(date || todayISO);
  return hours.filter((slot, i) => (seed + i * 9) % 4 !== 0);
}

function paintSlots() {
  const available = getSlots(dateInput.value);

  timeInput.innerHTML = '<option value="">Επιλέξτε ώρα</option>';
  available.forEach((slot) => {
    const option = document.createElement('option');
    option.value = slot;
    option.textContent = slot;
    timeInput.appendChild(option);
  });

  slotsList.innerHTML = '';
  available.forEach((slot) => {
    const div = document.createElement('div');
    div.className = 'slot';
    div.innerHTML = `<strong>${slot}</strong><span>διαθέσιμο</span>`;
    slotsList.appendChild(div);
  });
}

dateInput.addEventListener('change', paintSlots);
paintSlots();

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const car = document.getElementById('car').value.trim();
  const service = document.getElementById('service').value;
  const date = dateInput.value;
  const time = timeInput.value;

  if (!name || !phone || !car || !service || !date || !time) {
    bookingResult.textContent = 'Συμπλήρωσε όλα τα πεδία για να ολοκληρωθεί το ραντεβού.';
    return;
  }

  bookingResult.innerHTML = `Κλείστηκε ραντεβού για <strong>${name}</strong> (${car}) στις <strong>${time}</strong> (${date}) για <strong>${service}</strong>. Θα επιβεβαιώσουμε στο ${phone}.`;

  bookingForm.reset();
  dateInput.value = todayISO;
  paintSlots();
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
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

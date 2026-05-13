const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('siteNav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => siteNav.classList.toggle('open'));
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => siteNav.classList.remove('open'));
  });
}

const dateInput = document.getElementById('appointmentDate');
const timeSelect = document.getElementById('appointmentTime');
const slotsPreview = document.getElementById('slotsPreview');
const form = document.getElementById('appointmentForm');
const result = document.getElementById('appointmentResult');

const baseSlots = ['08:30', '09:30', '10:30', '12:00', '14:00', '16:00', '18:00', '20:00'];

const today = new Date();
const todayISO = today.toISOString().split('T')[0];
dateInput.min = todayISO;
dateInput.value = todayISO;

function seededHash(value) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function availableSlots(dateStr) {
  if (!dateStr) return [];
  const seed = seededHash(dateStr);
  return baseSlots.filter((slot, idx) => (seed + idx * 3) % 5 !== 0);
}

function renderSlots() {
  const slots = availableSlots(dateInput.value);

  timeSelect.innerHTML = '<option value="">Επίλεξε ώρα</option>';
  slots.forEach((slot) => {
    const option = document.createElement('option');
    option.value = slot;
    option.textContent = slot;
    timeSelect.appendChild(option);
  });

  slotsPreview.innerHTML = '';
  if (slots.length === 0) {
    slotsPreview.innerHTML = '<p>Δεν υπάρχουν διαθέσιμα slots για αυτή την ημερομηνία.</p>';
    return;
  }

  slots.forEach((slot) => {
    const div = document.createElement('div');
    div.className = 'slot-item';
    div.innerHTML = `<strong>${slot}</strong><span>Διαθέσιμο</span>`;
    slotsPreview.appendChild(div);
  });
}

dateInput.addEventListener('change', renderSlots);
renderSlots();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const area = document.getElementById('clientArea').value.trim();
  const date = dateInput.value;
  const time = timeSelect.value;
  const issue = document.getElementById('issueType').value;

  if (!name || !phone || !area || !date || !time || !issue) {
    result.textContent = 'Συμπλήρωσε όλα τα υποχρεωτικά πεδία για να κλείσει το ραντεβού.';
    return;
  }

  result.innerHTML = `Το ραντεβού καταχωρήθηκε για <strong>${name}</strong> στις <strong>${time}</strong> (${date}) στην περιοχή <strong>${area}</strong>. Θα επιβεβαιώσουμε άμεσα στο ${phone}.`;

  form.reset();
  dateInput.value = todayISO;
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

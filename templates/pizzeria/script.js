const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((item) => revealObserver.observe(item));

const tables = [
  { id: 'T1', seats: 2 },
  { id: 'T2', seats: 2 },
  { id: 'T3', seats: 3 },
  { id: 'T4', seats: 4 },
  { id: 'T5', seats: 4 },
  { id: 'T6', seats: 4 },
  { id: 'T7', seats: 5 },
  { id: 'T8', seats: 6 },
  { id: 'T9', seats: 6 },
  { id: 'T10', seats: 8 },
  { id: 'T11', seats: 2 },
  { id: 'T12', seats: 4 }
];

const diningRoom = document.getElementById('diningRoom');
const bookingDate = document.getElementById('bookingDate');
const bookingTime = document.getElementById('bookingTime');
const guestCount = document.getElementById('guestCount');
const selectedTableLabel = document.getElementById('selectedTable');
const bookingForm = document.getElementById('bookingForm');
const bookingResult = document.getElementById('bookingResult');

const today = new Date();
const todayISO = today.toISOString().split('T')[0];
bookingDate.min = todayISO;
bookingDate.value = todayISO;

let selectedTableId = null;

function seedFrom(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getBusyTables(date, time) {
  if (!date || !time) return [];
  const seed = seedFrom(`${date}-${time}`);
  const busyCount = 3 + (seed % 3);
  const busy = new Set();
  let i = 0;

  while (busy.size < busyCount && i < 100) {
    const idx = (seed + i * 7) % tables.length;
    busy.add(tables[idx].id);
    i += 1;
  }

  return [...busy];
}

function renderTables() {
  const guests = Number(guestCount.value || 0);
  const busyTables = getBusyTables(bookingDate.value, bookingTime.value);

  if (!diningRoom) return;
  diningRoom.innerHTML = '';

  tables.forEach((table) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'table-btn';

    const isBusy = busyTables.includes(table.id);
    const tooSmall = guests > 0 && table.seats < guests;

    if (isBusy || tooSmall) {
      button.classList.add('busy');
      button.disabled = true;
    } else {
      button.classList.add('free');
    }

    if (selectedTableId === table.id && !button.disabled) {
      button.classList.remove('free');
      button.classList.add('selected');
    }

    button.innerHTML = `<strong>${table.id}</strong><small>${table.seats} ατομα</small>`;

    button.addEventListener('click', () => {
      selectedTableId = table.id;
      selectedTableLabel.textContent = `${table.id} (${table.seats} ατομα)`;
      renderTables();
    });

    diningRoom.appendChild(button);
  });

  const selectedButton = [...diningRoom.querySelectorAll('.table-btn')].find((btn) => btn.classList.contains('selected'));
  if (!selectedButton) {
    selectedTableId = null;
    selectedTableLabel.textContent = 'Καμία';
  }
}

[bookingDate, bookingTime, guestCount].forEach((input) => {
  input.addEventListener('change', renderTables);
});

renderTables();

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('guestName').value.trim();
  const phone = document.getElementById('guestPhone').value.trim();
  const date = bookingDate.value;
  const time = bookingTime.value;
  const guests = guestCount.value;

  if (!name || !phone || !date || !time || !guests) {
    bookingResult.textContent = 'Συμπλήρωσε πρώτα όλα τα πεδία.';
    return;
  }

  if (!selectedTableId) {
    bookingResult.textContent = 'Επίλεξε ένα διαθέσιμο τραπέζι από τον πίνακα.';
    return;
  }

  bookingResult.innerHTML = `Η κράτηση ολοκληρώθηκε για <strong>${name}</strong> στις <strong>${time}</strong> (${date}) στο <strong>${selectedTableId}</strong> για <strong>${guests} άτομα</strong>. Θα λάβεις επιβεβαίωση στο ${phone}.`;
  bookingForm.reset();
  bookingDate.value = todayISO;
  selectedTableId = null;
  selectedTableLabel.textContent = 'Καμία';
  renderTables();
});

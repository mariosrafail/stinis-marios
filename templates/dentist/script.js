const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

const testimonials = [
  {
    quote: 'Εξαιρετικός οδοντίατρος! Πολύ προσεκτικός και επεξηγηματικός. Το χαμόγελό μου είναι όπως το ήθελα!',
    author: 'Μαρία Κ.'
  },
  {
    quote: 'Άψογη εξυπηρέτηση και καθαρό περιβάλλον. Έκλεισα ραντεβού πολύ γρήγορα και χωρίς αναμονή.',
    author: 'Γιώργος Π.'
  },
  {
    quote: 'Συνεπής, ευγενικός και με πραγματικό ενδιαφέρον για τον ασθενή. Τον προτείνω ανεπιφύλακτα.',
    author: 'Ελένη Σ.'
  }
];

const quoteEl = document.querySelector('[data-quote]');
const authorEl = document.querySelector('[data-author]');
const dots = Array.from(document.querySelectorAll('.dot'));

function setTestimonial(index) {
  if (!quoteEl || !authorEl || !dots.length) return;

  const item = testimonials[index];
  quoteEl.textContent = item.quote;
  authorEl.textContent = item.author;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

if (dots.length) {
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.dot || 0);
      setTestimonial(index);
      currentIndex = index;
    });
  });

  let currentIndex = 0;
  setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    setTestimonial(currentIndex);
  }, 5000);
}

const serviceCatalog = {
  exam: {
    label: 'Έλεγχος & πρώτη εκτίμηση',
    durationLabel: '30-40 λεπτά',
    slotMinutes: 30,
    visitType: 'Σύντομο ραντεβού',
    prep: 'Ιδανικά φέρνετε λίστα με φάρμακα και ενημερώνετε αν υπάρχει ευαισθησία, πόνος ή πρόσφατη θεραπεία.'
  },
  cleaning: {
    label: 'Καθαρισμός δοντιών',
    durationLabel: '45-60 λεπτά',
    slotMinutes: 60,
    visitType: 'Προληπτική φροντίδα',
    prep: 'Συνήθως δεν απαιτείται ακτινογραφία. Αν υπάρχει πρόσφατη αιμορραγία ή περιοδοντική ενόχληση, το αναφέρετε στα σχόλια.'
  },
  whitening: {
    label: 'Λεύκανση στο ιατρείο',
    durationLabel: '60-90 λεπτά',
    slotMinutes: 90,
    visitType: 'Αισθητική συνεδρία',
    prep: 'Γίνεται πρώτα εκτίμηση για τερηδόνα, αποτριβές και υγεία ούλων. Αν υπάρχει έντονη ευαισθησία, το ραντεβού ίσως ξεκινήσει με έλεγχο.'
  },
  extraction: {
    label: 'Χειρουργική εξαγωγή / φρονιμίτης',
    durationLabel: '90-150 λεπτά',
    slotMinutes: 120,
    visitType: 'Επεμβατικό ραντεβού',
    prep: 'Σε δύσκολη εξαγωγή συχνά χρειάζεται πρόσφατη πανοραμική και μερικές φορές επιπλέον απεικόνιση. Ενημερώστε για αντιπηκτικά ή φάρμακα.'
  },
  implant: {
    label: 'Consultation για εμφύτευμα',
    durationLabel: '45-60 λεπτά',
    slotMinutes: 60,
    visitType: 'Μελέτη θεραπείας',
    prep: 'Συνήθως χρειάζεται πανοραμική ή/και CBCT για σωστό σχεδιασμό. Αν έχετε παλιές εξετάσεις, φέρτε τις μαζί.'
  },
  emergency: {
    label: 'Επείγον περιστατικό / πόνος',
    durationLabel: '30-45 λεπτά',
    slotMinutes: 30,
    visitType: 'Άμεση αντιμετώπιση',
    prep: 'Αν υπάρχει πρήξιμο, πυρετός ή έντονος πόνος, περιγράψτε το στα σχόλια για να γίνει σωστή προτεραιοποίηση.'
  }
};

const bookingForm = document.getElementById('bookingForm');
const serviceSelect = document.getElementById('serviceSelect');
const appointmentDate = document.getElementById('appointmentDate');
const timeSlots = document.getElementById('timeSlots');
const selectedTimeInput = document.getElementById('selectedTime');
const serviceInfo = document.getElementById('serviceInfo');
const serviceDuration = document.getElementById('serviceDuration');
const serviceVisitType = document.getElementById('serviceVisitType');
const servicePrep = document.getElementById('servicePrep');
const timeHint = document.getElementById('timeHint');
const xrayBlock = document.getElementById('xrayBlock');
const xrayHint = document.getElementById('xrayHint');
const bookingSummary = document.getElementById('bookingSummary');
const bookingSummaryText = document.getElementById('bookingSummaryText');

function formatDateLabel(dateValue) {
  if (!dateValue) return '';
  const date = new Date(`${dateValue}T12:00:00`);
  return new Intl.DateTimeFormat('el-GR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit'
  }).format(date);
}

function timeToMinutes(timeValue) {
  const [hours, minutes] = timeValue.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function dateSeed(dateValue) {
  return dateValue.split('-').reduce((sum, part) => sum + Number(part), 0);
}

function getWorkDayConfig(dateValue) {
  const weekday = new Date(`${dateValue}T12:00:00`).getDay();

  if (weekday === 0) {
    return null;
  }

  if (weekday === 6) {
    return {
      open: '10:00',
      close: '14:00',
      blocked: [['12:00', '12:30']]
    };
  }

  if (weekday === 2 || weekday === 4) {
    return {
      open: '11:00',
      close: '19:00',
      blocked: [['14:30', '15:30']]
    };
  }

  return {
    open: '09:00',
    close: '17:30',
    blocked: [['14:00', '15:00']]
  };
}

function getBookedRanges(dateValue) {
  const seed = dateSeed(dateValue);
  const presets = [
    ['09:30', '10:30'],
    ['11:00', '11:30'],
    ['12:30', '13:30'],
    ['15:00', '16:00'],
    ['16:30', '17:00']
  ];

  return [
    presets[seed % presets.length],
    presets[(seed + 2) % presets.length]
  ];
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function updateServiceCard() {
  const service = serviceCatalog[serviceSelect?.value || ''];
  if (!service || !serviceDuration || !serviceVisitType || !servicePrep || !serviceInfo) {
    return;
  }

  serviceDuration.textContent = service.durationLabel;
  serviceVisitType.textContent = service.visitType;
  servicePrep.textContent = service.prep;
  serviceInfo.hidden = false;

  const needsXray = serviceSelect.value === 'extraction' || serviceSelect.value === 'implant';
  if (xrayBlock) {
    xrayBlock.hidden = !needsXray;
  }
  if (xrayHint) {
    xrayHint.textContent = serviceSelect.value === 'implant'
      ? 'Αν υπάρχει πρόσφατη πανοραμική ή CBCT, βοηθάει να γίνει πιο ακριβής εκτίμηση στο πρώτο ραντεβού.'
      : 'Αν δεν υπάρχει πρόσφατη πανοραμική, ίσως ζητηθεί πριν οριστικοποιηθεί χειρουργικό ραντεβού.';
  }
}

function updateBookingSummary() {
  if (!bookingSummary || !bookingSummaryText || !serviceSelect || !appointmentDate || !selectedTimeInput) return;
  const service = serviceCatalog[serviceSelect.value];
  const chosenTime = selectedTimeInput.value;
  const chosenDate = appointmentDate.value;

  if (!service || !chosenDate || !chosenTime) {
    bookingSummary.hidden = true;
    bookingSummaryText.textContent = '';
    return;
  }

  bookingSummary.hidden = false;
  bookingSummaryText.textContent = `${service.label} • ${formatDateLabel(chosenDate)} • ${chosenTime} • Εκτιμώμενη διάρκεια ${service.durationLabel}.`;
}

function renderTimeSlots() {
  if (!timeSlots || !serviceSelect || !appointmentDate || !timeHint || !selectedTimeInput) return;

  timeSlots.innerHTML = '';
  selectedTimeInput.value = '';
  updateBookingSummary();

  const service = serviceCatalog[serviceSelect.value];
  const dateValue = appointmentDate.value;

  if (!service || !dateValue) {
    timeHint.textContent = 'Διαλέξτε πρώτα υπηρεσία και ημερομηνία.';
    return;
  }

  const workDay = getWorkDayConfig(dateValue);
  if (!workDay) {
    timeHint.textContent = 'Το ιατρείο είναι κλειστό την Κυριακή. Επιλέξτε άλλη ημερομηνία.';
    return;
  }

  const bookedRanges = [...workDay.blocked, ...getBookedRanges(dateValue)];
  const openMinutes = timeToMinutes(workDay.open);
  const closeMinutes = timeToMinutes(workDay.close);
  const serviceMinutes = service.slotMinutes;
  const slots = [];

  for (let current = openMinutes; current + serviceMinutes <= closeMinutes; current += 30) {
    const end = current + serviceMinutes;
    const unavailable = bookedRanges.some(([blockedStart, blockedEnd]) =>
      overlaps(current, end, timeToMinutes(blockedStart), timeToMinutes(blockedEnd))
    );

    slots.push({
      label: minutesToTime(current),
      unavailable
    });
  }

  timeHint.textContent = `Η υπηρεσία χρειάζεται περίπου ${service.durationLabel}. Οι γκρι ώρες δεν είναι διαθέσιμες.`;

  slots.forEach((slot) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'time-slot';
    button.textContent = slot.label;

    if (slot.unavailable) {
      button.disabled = true;
      button.classList.add('unavailable');
      timeSlots.appendChild(button);
      return;
    }

    button.addEventListener('click', () => {
      timeSlots.querySelectorAll('.time-slot').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      selectedTimeInput.value = slot.label;
      updateBookingSummary();
    });

    timeSlots.appendChild(button);
  });
}

if (appointmentDate) {
  appointmentDate.min = new Date().toISOString().split('T')[0];
}

serviceSelect?.addEventListener('change', () => {
  updateServiceCard();
  renderTimeSlots();
});

appointmentDate?.addEventListener('change', renderTimeSlots);

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!serviceSelect?.value || !appointmentDate?.value || !selectedTimeInput?.value) {
    timeHint.textContent = 'Συμπληρώστε υπηρεσία, ημερομηνία και ώρα για να σταλεί το αίτημα.';
    return;
  }

  updateBookingSummary();
  if (bookingSummaryText) {
    bookingSummaryText.textContent += ' Το αίτημα στάλθηκε επιτυχώς και θα ακολουθήσει τηλεφωνική επιβεβαίωση.';
  }
});

const faqQuestions = Array.from(document.querySelectorAll('.faq-question'));

function setFaqState(item, isOpen) {
  const button = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (!button || !answer) return;

  item.classList.toggle('open', isOpen);
  button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

  if (isOpen) {
    answer.style.maxHeight = `${answer.scrollHeight + 6}px`;
  } else {
    answer.style.maxHeight = '0px';
  }
}

faqQuestions.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    if (!item) return;

    const willOpen = !item.classList.contains('open');

    faqQuestions.forEach((q) => {
      const parent = q.closest('.faq-item');
      if (!parent) return;
      setFaqState(parent, false);
    });

    if (willOpen) {
      setFaqState(item, true);
    }
  });
});

window.addEventListener('resize', () => {
  document.querySelectorAll('.faq-item.open').forEach((item) => setFaqState(item, true));
});

const revealTargets = Array.from(
  document.querySelectorAll('.usp-row article, .service-card, .about-card, .form-card, .faq-item, .testimonial, .contact-card')
);

revealTargets.forEach((el, index) => {
  el.classList.add('reveal-item');
  el.style.transitionDelay = `${Math.min(index * 45, 360)}ms`;
});

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

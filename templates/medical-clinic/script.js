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
    quote: 'Εξαιρετικός γιατρός! Προσιτός, πολύ καλά καταρτισμένος και πάντα διαθέσιμος όταν τον χρειαστήκαμε.',
    author: 'Μαρία Κ.'
  },
  {
    quote: 'Άμεσος, επαγγελματίας και πολύ αναλυτικός σε κάθε εξέταση. Μας ενέπνευσε εμπιστοσύνη από την πρώτη επίσκεψη.',
    author: 'Νίκος Τ.'
  },
  {
    quote: 'Πολύ καλή παρακολούθηση, ανθρώπινη προσέγγιση και σωστή καθοδήγηση για την υγεία όλης της οικογένειας.',
    author: 'Ελένη Π.'
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

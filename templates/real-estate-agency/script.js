const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('siteNav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => siteNav.classList.toggle('open'));
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => siteNav.classList.remove('open'));
  });
}

const listings = [...document.querySelectorAll('.property-card')];
const noResults = document.getElementById('noResults');
const searchForm = document.getElementById('searchForm');
const codeForm = document.getElementById('codeSearchForm');

function applyFilters(filters) {
  let shown = 0;

  listings.forEach((card) => {
    const deal = card.dataset.deal;
    const type = card.dataset.type;
    const region = card.dataset.region;
    const subarea = (card.dataset.subarea || '').toLowerCase();
    const code = (card.dataset.code || '').toLowerCase();

    const dealOk = filters.deal === 'all' || deal === filters.deal;
    const typeOk = filters.type === 'all' || type === filters.type;
    const regionOk = filters.region === 'all' || region === filters.region;
    const subareaOk = !filters.subarea || subarea.includes(filters.subarea);
    const codeOk = !filters.code || code.includes(filters.code);

    const visible = dealOk && typeOk && regionOk && subareaOk && codeOk;
    card.style.display = visible ? '' : 'none';
    if (visible) shown += 1;
  });

  noResults.style.display = shown === 0 ? 'block' : 'none';
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const filters = {
    deal: document.getElementById('filterDeal').value,
    type: document.getElementById('filterType').value,
    region: document.getElementById('filterRegion').value,
    subarea: document.getElementById('filterSubarea').value.trim().toLowerCase(),
    code: ''
  };

  applyFilters(filters);
  document.getElementById('listings').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

codeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const code = document.getElementById('codeInput').value.trim().toLowerCase();

  applyFilters({ deal: 'all', type: 'all', region: 'all', subarea: '', code });
  document.getElementById('listings').scrollIntoView({ behavior: 'smooth', block: 'start' });
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

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('siteNav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => siteNav.classList.toggle('open'));
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => siteNav.classList.remove('open'));
  });
}

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

const heroShapes = document.querySelectorAll('.hero-shape');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  heroShapes.forEach((shape, index) => {
    const speed = index === 0 ? 0.03 : 0.05;
    shape.style.transform = `translateY(${y * speed}px)`;
  });
});

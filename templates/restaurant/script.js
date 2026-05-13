const foodMenuBtn = document.getElementById('foodMenuBtn');
const foodDrawer = document.getElementById('foodDrawer');

if (foodMenuBtn && foodDrawer) {
  foodMenuBtn.addEventListener('click', () => {
    foodDrawer.classList.toggle('open');
  });

  foodDrawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => foodDrawer.classList.remove('open'));
  });
}

const foodObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      foodObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => foodObserver.observe(el));

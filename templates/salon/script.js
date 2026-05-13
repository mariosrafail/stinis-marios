const salonTrigger = document.getElementById("navTrigger");
const salonNav = document.getElementById("salonNav");
if (salonTrigger && salonNav) {
  salonTrigger.addEventListener("click", () => salonNav.classList.toggle("open"));
}
const salonObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      salonObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((el) => salonObserver.observe(el));

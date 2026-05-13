(function initBarberTemplate() {
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const cookieBar = document.getElementById("cookieBar");
  const acceptCookies = document.getElementById("acceptCookies");
  const rejectCookies = document.getElementById("rejectCookies");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  function closeCookieBar() {
    if (!cookieBar) return;
    cookieBar.style.opacity = "0";
    cookieBar.style.transform = "translate(-50%, 10px)";
    setTimeout(() => {
      cookieBar.style.display = "none";
    }, 220);
  }

  if (acceptCookies) {
    acceptCookies.addEventListener("click", closeCookieBar);
  }

  if (rejectCookies) {
    rejectCookies.addEventListener("click", closeCookieBar);
  }

  const revealItems = document.querySelectorAll(".reveal:not(.visible)");
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
})();

(function initHeroSlider() {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".slide"));
  const dotsRoot = document.getElementById("slider-dots");
  const prevBtn = document.getElementById("prev-slide");
  const nextBtn = document.getElementById("next-slide");
  const titleNode = document.getElementById("slide-title");
  const subNode = document.getElementById("slide-sub");
  const descNode = document.getElementById("slide-desc");

  if (!slides.length || !dotsRoot || !prevBtn || !nextBtn || !titleNode || !subNode || !descNode) return;

  let current = 0;
  let autoTimer;

  function setOverlay(index) {
    const active = slides[index];
    titleNode.textContent = active.dataset.title || "";
    subNode.textContent = active.dataset.sub || "";
    descNode.textContent = active.dataset.desc || "";
  }

  function render(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });

    dotsRoot.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    setOverlay(index);
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    render(current);
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5500);
  }

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", `Slide ${index + 1}`);
    dot.addEventListener("click", () => {
      goTo(index);
      startAuto();
    });
    dotsRoot.appendChild(dot);
  });

  prevBtn.addEventListener("click", () => {
    goTo(current - 1);
    startAuto();
  });

  nextBtn.addEventListener("click", () => {
    goTo(current + 1);
    startAuto();
  });

  render(current);
  startAuto();
})();

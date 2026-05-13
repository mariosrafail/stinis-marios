(function initBeautyCenter() {
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  const reveals = document.querySelectorAll(".reveal:not(.visible)");
  if (reveals.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.14 });

    reveals.forEach((el) => observer.observe(el));
  }

  const track = document.getElementById("testiTrack");
  const prev = document.getElementById("testiPrev");
  const next = document.getElementById("testiNext");
  const cards = track ? Array.from(track.querySelectorAll(".testi-card")) : [];

  if (cards.length) {
    let index = 0;
    let timer;

    const show = (i) => {
      index = (i + cards.length) % cards.length;
      cards.forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === index));
    };

    const start = () => {
      clearInterval(timer);
      timer = setInterval(() => show(index + 1), 4800);
    };

    prev?.addEventListener("click", () => { show(index - 1); start(); });
    next?.addEventListener("click", () => { show(index + 1); start(); });

    show(0);
    start();
  }

  const steps = Array.from(document.querySelectorAll(".step"));
  const panes = Array.from(document.querySelectorAll(".step-pane"));
  const prevBtn = document.getElementById("prevStep");
  const nextBtn = document.getElementById("nextStep");
  const form = document.getElementById("bookingForm");
  const result = document.getElementById("bookingResult");

  const serviceSelect = document.getElementById("serviceSelect");
  const dateInput = document.getElementById("dateInput");
  const slotsRoot = document.getElementById("slots");
  const slotInput = document.getElementById("slotInput");
  const nameInput = document.getElementById("nameInput");
  const phoneInput = document.getElementById("phoneInput");
  const emailInput = document.getElementById("emailInput");

  let currentStep = 0;

  const slotData = {
    1: ["11:00", "12:30", "17:00", "18:30"],
    2: ["10:30", "12:00", "15:30", "19:00"],
    3: ["11:30", "13:00", "16:00", "18:00"],
    4: ["10:00", "12:30", "17:30"],
    5: ["11:00", "14:00", "18:30"],
    6: ["10:00", "12:00", "14:00"]
  };

  const today = new Date();
  const max = new Date(today);
  max.setDate(max.getDate() + 30);

  const iso = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  if (dateInput) {
    dateInput.min = iso(today);
    dateInput.max = iso(max);
    dateInput.value = iso(today);
  }

  const renderSlots = () => {
    if (!dateInput || !slotsRoot || !slotInput) return;
    slotsRoot.innerHTML = "";
    slotInput.value = "";

    const day = new Date(`${dateInput.value}T00:00:00`).getDay();
    const slots = slotData[day] || [];

    if (!slots.length) {
      const empty = document.createElement("p");
      empty.textContent = "Δεν υπάρχει διαθεσιμότητα για αυτή την ημέρα.";
      slotsRoot.appendChild(empty);
      return;
    }

    slots.forEach((slot, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn";
      btn.textContent = slot;
      if (i === 1 && day % 2 === 0) {
        btn.disabled = true;
        btn.textContent = `${slot} (κλεισμένο)`;
      }
      btn.addEventListener("click", () => {
        slotsRoot.querySelectorAll(".slot-btn.selected").forEach((el) => el.classList.remove("selected"));
        btn.classList.add("selected");
        slotInput.value = slot;
      });
      slotsRoot.appendChild(btn);
    });
  };

  dateInput?.addEventListener("change", renderSlots);
  renderSlots();

  const updateStep = () => {
    steps.forEach((step, i) => step.classList.toggle("active", i === currentStep));
    panes.forEach((pane, i) => pane.classList.toggle("active", i === currentStep));
    prevBtn.style.visibility = currentStep === 0 ? "hidden" : "visible";
    nextBtn.textContent = currentStep === 2 ? "ΟΛΟΚΛΗΡΩΣΗ" : "ΣΥΝΕΧΕΙΑ";
  };

  const validateStep = () => {
    if (currentStep === 0) return !!serviceSelect?.value;
    if (currentStep === 1) return !!dateInput?.value && !!slotInput?.value;
    return !!nameInput?.value && !!phoneInput?.value && !!emailInput?.value;
  };

  steps.forEach((stepBtn, i) => {
    stepBtn.addEventListener("click", () => {
      if (i <= currentStep || validateStep()) {
        currentStep = i;
        updateStep();
      }
    });
  });

  prevBtn?.addEventListener("click", () => {
    currentStep = Math.max(0, currentStep - 1);
    updateStep();
  });

  nextBtn?.addEventListener("click", () => {
    if (!validateStep()) {
      result.textContent = "Συμπληρώστε τα απαιτούμενα πεδία για να συνεχίσετε.";
      return;
    }

    if (currentStep < 2) {
      currentStep += 1;
      result.textContent = "";
      updateStep();
      return;
    }

    result.textContent = `Ευχαριστούμε ${nameInput.value}. Το αίτημα για ${serviceSelect.value} στις ${slotInput.value} καταχωρήθηκε.`;
    form.reset();
    dateInput.value = iso(today);
    renderSlots();
    currentStep = 0;
    updateStep();
  });

  updateStep();
})();

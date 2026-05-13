(function initNailSalon() {
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  const slider = document.getElementById("heroSlider");
  const slides = slider ? Array.from(slider.querySelectorAll(".hero-slide")) : [];
  const prev = document.getElementById("heroPrev");
  const next = document.getElementById("heroNext");
  const dotsRoot = document.getElementById("heroDots");
  const title = document.getElementById("heroTitle");
  const sub = document.getElementById("heroSub");
  const cta = document.getElementById("heroCta");

  if (slides.length && dotsRoot && title && sub && cta) {
    let current = 0;
    let timer;

    const setText = (idx) => {
      const slide = slides[idx];
      title.textContent = slide.dataset.title || "";
      sub.textContent = slide.dataset.sub || "";
      cta.textContent = slide.dataset.cta || "EXPLORE";
      cta.href = slide.dataset.link || "#";
    };

    const render = (idx) => {
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === idx));
      dotsRoot.querySelectorAll(".dot").forEach((dot, i) => dot.classList.toggle("active", i === idx));
      setText(idx);
    };

    const go = (idx) => {
      current = (idx + slides.length) % slides.length;
      render(current);
    };

    const start = () => {
      clearInterval(timer);
      timer = setInterval(() => go(current + 1), 5200);
    };

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dot.addEventListener("click", () => {
        go(i);
        start();
      });
      dotsRoot.appendChild(dot);
    });

    prev?.addEventListener("click", () => { go(current - 1); start(); });
    next?.addEventListener("click", () => { go(current + 1); start(); });

    go(0);
    start();
  }

  const revealEls = document.querySelectorAll(".reveal:not(.visible)");
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.14 });

    revealEls.forEach((el) => observer.observe(el));
  }

  const serviceField = document.getElementById("serviceField");
  const dateField = document.getElementById("dateField");
  const slotsRoot = document.getElementById("slots");
  const slotField = document.getElementById("slotField");
  const nameField = document.getElementById("nameField");
  const phoneField = document.getElementById("phoneField");
  const bookingForm = document.getElementById("bookingForm");
  const bookingResult = document.getElementById("bookingResult");

  if (dateField) {
    const today = new Date();
    const max = new Date(today);
    max.setDate(max.getDate() + 25);

    const iso = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    const schedule = {
      1: ["10:30", "12:00", "16:00", "18:30"],
      2: ["11:00", "13:00", "15:30", "19:00"],
      3: ["10:00", "12:30", "17:30"],
      4: ["10:30", "14:00", "18:00"],
      5: ["11:30", "13:30", "16:30", "19:30"],
      6: ["10:00", "12:00", "14:00"]
    };

    dateField.min = iso(today);
    dateField.max = iso(max);
    dateField.value = iso(today);

    const renderSlots = () => {
      if (!slotsRoot || !slotField) return;
      slotsRoot.innerHTML = "";
      slotField.value = "";

      const day = new Date(`${dateField.value}T00:00:00`).getDay();
      const slots = schedule[day] || [];

      if (!slots.length) {
        const note = document.createElement("p");
        note.textContent = "Κυριακή: δεν υπάρχει διαθεσιμότητα.";
        slotsRoot.appendChild(note);
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
          slotField.value = slot;
        });

        slotsRoot.appendChild(btn);
      });
    };

    dateField.addEventListener("change", renderSlots);
    renderSlots();

    bookingForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!serviceField?.value || !slotField?.value || !nameField?.value || !phoneField?.value) {
        if (bookingResult) bookingResult.textContent = "Συμπλήρωσε όλα τα πεδία και επίλεξε ώρα.";
        return;
      }

      if (bookingResult) {
        bookingResult.textContent = `Ευχαριστούμε ${nameField.value}. Το ραντεβού για ${serviceField.value} στις ${slotField.value} καταχωρήθηκε.`;
      }

      bookingForm.reset();
      dateField.value = iso(today);
      renderSlots();
    });
  }
})();

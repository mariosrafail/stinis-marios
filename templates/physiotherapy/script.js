(function initBooking() {
  const dateInput = document.getElementById("booking-date");
  const slotsRoot = document.getElementById("slots");
  const slotHint = document.getElementById("slot-hint");
  const selectedSlotInput = document.getElementById("selected-slot");
  const bookingForm = document.getElementById("booking-form");
  const bookingResult = document.getElementById("booking-result");
  const submitBtn = document.getElementById("submit-booking");

  if (!dateInput || !slotsRoot || !slotHint || !selectedSlotInput || !bookingForm || !bookingResult || !submitBtn) {
    return;
  }

  const weeklySlots = {
    1: ["09:00", "10:00", "12:00", "17:00", "19:00"],
    2: ["09:30", "11:30", "14:00", "18:00"],
    3: ["10:00", "12:30", "16:00", "18:30"],
    4: ["09:00", "11:00", "13:00", "17:30"],
    5: ["09:30", "12:00", "15:00", "19:30"],
    6: ["10:30", "12:30", "14:30"]
  };

  const blockedByDate = {
    "2026-03-25": ["12:30", "16:00"],
    "2026-03-27": ["09:30"],
    "2026-03-30": ["17:00"]
  };

  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 21);

  const toIso = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatGreekDate = (isoDate) => {
    const date = new Date(`${isoDate}T00:00:00`);
    return new Intl.DateTimeFormat("el-GR", {
      weekday: "long",
      day: "numeric",
      month: "long"
    }).format(date);
  };

  const renderSlots = (isoDate) => {
    slotsRoot.innerHTML = "";
    selectedSlotInput.value = "";
    submitBtn.disabled = true;
    bookingResult.textContent = "";

    const date = new Date(`${isoDate}T00:00:00`);
    const day = date.getDay();

    if (day === 0) {
      slotHint.textContent = "Κυριακή: η κλινική είναι κλειστή.";
      return;
    }

    const dailySlots = weeklySlots[day] || [];
    const blocked = blockedByDate[isoDate] || [];

    if (!dailySlots.length) {
      slotHint.textContent = "Δεν υπάρχουν διαθέσιμα slots για αυτή την ημέρα.";
      return;
    }

    slotHint.textContent = `Διαθεσιμότητα για ${formatGreekDate(isoDate)}.`;

    dailySlots.forEach((slot) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "slot-btn";
      button.textContent = slot;

      if (blocked.includes(slot)) {
        button.disabled = true;
        button.textContent = `${slot} (κλεισμένο)`;
      }

      button.addEventListener("click", () => {
        slotsRoot.querySelectorAll(".slot-btn.selected").forEach((el) => el.classList.remove("selected"));
        button.classList.add("selected");
        selectedSlotInput.value = slot;
        submitBtn.disabled = false;
        slotHint.textContent = `Επιλέχθηκε ώρα ${slot} για ${formatGreekDate(isoDate)}.`;
      });

      slotsRoot.appendChild(button);
    });
  };

  dateInput.min = toIso(today);
  dateInput.max = toIso(maxDate);

  const initialDate = toIso(today);
  dateInput.value = initialDate;
  renderSlots(initialDate);

  dateInput.addEventListener("change", (event) => {
    const isoDate = event.target.value;
    if (!isoDate) return;
    renderSlots(isoDate);
  });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const name = formData.get("name");
    const service = formData.get("service");
    const slot = formData.get("selectedSlot");
    const date = dateInput.value;

    if (!slot) {
      slotHint.textContent = "Χρειάζεται να επιλέξετε διαθέσιμη ώρα.";
      return;
    }

    bookingResult.textContent = `Ευχαριστούμε ${name}. Το αίτημα για ${service} στις ${slot}, ${formatGreekDate(date)} καταχωρήθηκε.`;
    bookingForm.reset();
    dateInput.value = date;
    renderSlots(date);
  });
})();

function text(id, value) {
  const el = document.querySelector(`[data-bind="${id}"]`);
  if (el) el.textContent = value || "";
}
function list(id, values) {
  const root = document.querySelector(`[data-list="${id}"]`);
  if (!root || !Array.isArray(values)) return;
  root.innerHTML = values.map((v) => `<li class="pill">${v}</li>`).join("");
}
function quickList(values) {
  const root = document.querySelector('[data-list="quick"]');
  if (!root || !Array.isArray(values)) return;
  root.innerHTML = values.map((v) => `<li>${v}</li>`).join("");
}
(function initTemplate() {
  const dataNode = document.getElementById("template-data");
  if (!dataNode) return;
  let data = {};
  try { data = JSON.parse(dataNode.textContent || "{}"); }
  catch (error) { console.error("Invalid template JSON", error); return; }
  document.title = `${data.title || "Business"} Template | Stinis Digital`;
  text("category", data.category); text("title", data.title); text("headline", data.headline);
  text("summary", data.summary); text("about", data.about); text("promise", data.promise);
  text("ctaPrimary", data.ctaPrimary || "Κλείσε ραντεβού"); text("ctaSecondary", data.ctaSecondary || "Δες υπηρεσίες");
  list("services", data.services || []); list("highlights", data.highlights || []); quickList(data.quickFacts || []);
  const ctaMail = document.querySelector('[data-bind-link="mail"]');
  const ctaPhone = document.querySelector('[data-bind-link="phone"]');
  if (ctaMail && data.email) ctaMail.href = `mailto:${data.email}`;
  if (ctaPhone && data.phone) ctaPhone.href = `tel:${data.phone}`;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => { if (!entry.isIntersecting) return; entry.target.classList.add("visible"); obs.unobserve(entry.target); });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

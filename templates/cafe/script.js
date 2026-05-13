(function initCafeTemplate() {
  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");

  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => mainNav.classList.remove("open"));
    });
  }

  const revealEls = document.querySelectorAll(".reveal:not(.visible)");
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealEls.forEach((el) => observer.observe(el));
  }

  const statTargets = document.querySelectorAll("[data-target]");
  if (statTargets.length) {
    const statObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.target || 0);
        let current = 0;
        const step = Math.max(1, Math.round(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = String(target);
            clearInterval(timer);
            return;
          }
          el.textContent = String(current);
        }, 20);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    statTargets.forEach((el) => statObserver.observe(el));
  }

  const products = {
    coffee: [
      { id: "cf1", name: "Freddo Espresso", price: 2.8, desc: "Διπλή δόση", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80" },
      { id: "cf2", name: "Freddo Cappuccino", price: 3.2, desc: "Με κρέμα γάλακτος", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80" },
      { id: "cf3", name: "Ελληνικός Μονός", price: 2.0, desc: "Παραδοσιακός", img: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=400&q=80" },
      { id: "cf4", name: "Latte", price: 3.4, desc: "Κρεμώδης υφή", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80" }
    ],
    drinks: [
      { id: "dr1", name: "Σοκολάτα Ζεστή", price: 3.6, desc: "Πλούσια γεύση", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80" },
      { id: "dr2", name: "Τσάι Βοτάνων", price: 2.9, desc: "Premium blend", img: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=400&q=80" },
      { id: "dr3", name: "Cold Brew", price: 3.5, desc: "12h εκχύλιση", img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=400&q=80" }
    ],
    snacks: [
      { id: "sn1", name: "Club Sandwich", price: 5.8, desc: "Με γαλοπούλα", img: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=400&q=80" },
      { id: "sn2", name: "Μπάρα Πρωτεΐνης", price: 2.7, desc: "Χωρίς ζάχαρη", img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80" },
      { id: "sn3", name: "Croissant Βουτύρου", price: 2.4, desc: "Φρεσκοψημένο", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80" }
    ]
  };

  const tabs = Array.from(document.querySelectorAll(".tab"));
  const productGrid = document.getElementById("productGrid");
  const cartItems = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const deliveryEl = document.getElementById("delivery");
  const checkoutForm = document.getElementById("checkoutForm");
  const orderMessage = document.getElementById("orderMessage");

  let currentCategory = "coffee";
  const cart = new Map();

  function currency(v) {
    return `${v.toFixed(2)}€`;
  }

  function renderProducts() {
    if (!productGrid) return;
    const list = products[currentCategory] || [];
    productGrid.innerHTML = list.map((p) => `
      <article class="product-card">
        <div class="product-img" style="background-image:url('${p.img}')"></div>
        <div>
          <h4>${p.name}</h4>
          <p class="product-meta">${p.desc}</p>
          <div class="product-bottom">
            <span class="product-price">${currency(p.price)}</span>
            <button class="add-btn" data-add="${p.id}">ΠΡΟΣΘΗΚΗ</button>
          </div>
        </div>
      </article>
    `).join("");

    productGrid.querySelectorAll("[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-add");
        const all = Object.values(products).flat();
        const product = all.find((x) => x.id === id);
        if (!product) return;
        const existing = cart.get(id);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.set(id, { ...product, qty: 1 });
        }
        renderCart();
      });
    });
  }

  function renderCart() {
    if (!cartItems || !subtotalEl || !totalEl || !deliveryEl) return;

    const entries = Array.from(cart.values());
    if (!entries.length) {
      cartItems.innerHTML = `<p class="cart-empty">Το καλάθι σου είναι άδειο.</p>`;
    } else {
      cartItems.innerHTML = entries.map((item) => `
        <article class="cart-item">
          <div>
            <h4>${item.name}</h4>
            <small>${currency(item.price)} x ${item.qty}</small>
          </div>
          <div>
            <div class="qty-controls">
              <button class="qty-btn" data-dec="${item.id}">-</button>
              <span>${item.qty}</span>
              <button class="qty-btn" data-inc="${item.id}">+</button>
            </div>
            <button class="remove-btn" data-remove="${item.id}">Αφαίρεση</button>
          </div>
        </article>
      `).join("");
    }

    cartItems.querySelectorAll("[data-inc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-inc");
        const item = cart.get(id);
        if (!item) return;
        item.qty += 1;
        renderCart();
      });
    });

    cartItems.querySelectorAll("[data-dec]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-dec");
        const item = cart.get(id);
        if (!item) return;
        item.qty -= 1;
        if (item.qty <= 0) cart.delete(id);
        renderCart();
      });
    });

    cartItems.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-remove");
        cart.delete(id);
        renderCart();
      });
    });

    const subtotal = entries.reduce((sum, it) => sum + it.price * it.qty, 0);
    const delivery = subtotal > 12 || subtotal === 0 ? 0 : 2.2;
    subtotalEl.textContent = currency(subtotal);
    deliveryEl.textContent = currency(delivery);
    totalEl.textContent = currency(subtotal + delivery);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentCategory = tab.dataset.cat || "coffee";
      renderProducts();
    });
  });

  checkoutForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("customerName")?.value.trim();
    const phone = document.getElementById("customerPhone")?.value.trim();
    const address = document.getElementById("customerAddress")?.value.trim();

    if (!cart.size) {
      orderMessage.textContent = "Πρόσθεσε πρώτα προϊόντα στο καλάθι.";
      orderMessage.style.color = "#b12a2a";
      return;
    }

    if (!name || !phone || !address) {
      orderMessage.textContent = "Συμπλήρωσε όλα τα στοιχεία παράδοσης.";
      orderMessage.style.color = "#b12a2a";
      return;
    }

    orderMessage.textContent = `Ευχαριστούμε ${name}! Η παραγγελία σου καταχωρήθηκε και θα σε καλέσουμε στο ${phone}.`;
    orderMessage.style.color = "#167443";

    cart.clear();
    checkoutForm.reset();
    renderCart();
  });

  renderProducts();
  renderCart();
})();

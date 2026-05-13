(function initSouvlakiTemplate() {
  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");

  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });

    mainNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => mainNav.classList.remove("open"));
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

  const heroSlider = document.getElementById("heroSlider");
  const slides = heroSlider ? Array.from(heroSlider.querySelectorAll(".slide")) : [];
  const heroTitle = document.getElementById("heroTitle");
  const heroSub = document.getElementById("heroSub");
  const heroPrev = document.getElementById("heroPrev");
  const heroNext = document.getElementById("heroNext");
  const heroDots = document.getElementById("heroDots");

  if (slides.length && heroTitle && heroSub && heroDots) {
    let current = 0;
    let timer;

    const render = (idx) => {
      current = (idx + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
      heroDots.querySelectorAll(".dot").forEach((dot, i) => dot.classList.toggle("active", i === current));
      heroTitle.textContent = slides[current].dataset.title || "";
      heroSub.textContent = slides[current].dataset.sub || "";
    };

    const start = () => {
      clearInterval(timer);
      timer = setInterval(() => render(current + 1), 5600);
    };

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dot.addEventListener("click", () => {
        render(i);
        start();
      });
      heroDots.appendChild(dot);
    });

    heroPrev?.addEventListener("click", () => {
      render(current - 1);
      start();
    });

    heroNext?.addEventListener("click", () => {
      render(current + 1);
      start();
    });

    render(0);
    start();
  }

  const products = {
    wraps: [
      { id: "wr1", name: "Πίτα Γύρος Χοιρινός", desc: "Με πατάτα, ντομάτα, κρεμμύδι", price: 3.7, img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80" },
      { id: "wr2", name: "Πίτα Κοτόπουλο", desc: "Με sauce γιαουρτιού", price: 3.9, img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=400&q=80" },
      { id: "wr3", name: "Πίτα Μπιφτέκι", desc: "Χειροποίητο μπιφτέκι", price: 4.2, img: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=400&q=80" },
      { id: "wr4", name: "Πίτα Vegan", desc: "Λαχανικά, hummus", price: 4.1, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80" }
    ],
    portions: [
      { id: "pt1", name: "Μερίδα Γύρος", desc: "Πίτα, πατάτες, σαλάτα", price: 8.8, img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80" },
      { id: "pt2", name: "Καλαμάκια Mix", desc: "Χοιρινό + κοτόπουλο", price: 9.4, img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=400&q=80" },
      { id: "pt3", name: "Μερίδα Κεμπάπ", desc: "Με spicy sauce", price: 9.8, img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=400&q=80" }
    ],
    sides: [
      { id: "sd1", name: "Πατάτες Τυρί-Μπέικον", desc: "Street signature", price: 5.2, img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=400&q=80" },
      { id: "sd2", name: "Τζατζίκι", desc: "Σπιτικό", price: 2.0, img: "https://images.unsplash.com/photo-1625943555419-56a2cb596640?auto=format&fit=crop&w=400&q=80" },
      { id: "sd3", name: "Coca-Cola 330ml", desc: "Κουτάκι", price: 1.8, img: "https://images.unsplash.com/photo-1629203432180-71e9f741e6f4?auto=format&fit=crop&w=400&q=80" }
    ]
  };

  const tabs = Array.from(document.querySelectorAll(".tab"));
  const productGrid = document.getElementById("productGrid");
  const cartItems = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("subtotal");
  const deliveryEl = document.getElementById("delivery");
  const totalEl = document.getElementById("total");
  const checkoutForm = document.getElementById("checkoutForm");
  const orderMessage = document.getElementById("orderMessage");
  const cartPanel = document.getElementById("cartPanel");

  let currentCat = "wraps";
  const cart = new Map();

  function money(v) {
    return `${v.toFixed(2)}€`;
  }

  function getAllProducts() {
    return Object.values(products).flat();
  }

  function pulseCart() {
    if (!cartPanel) return;
    cartPanel.animate(
      [
        { transform: "translateY(0)", boxShadow: "0 0 0 rgba(243,156,18,0)" },
        { transform: "translateY(-2px)", boxShadow: "0 0 0 5px rgba(243,156,18,.15)" },
        { transform: "translateY(0)", boxShadow: "0 0 0 rgba(243,156,18,0)" }
      ],
      { duration: 420, easing: "cubic-bezier(0.22,1,0.36,1)" }
    );
  }

  function renderProducts() {
    if (!productGrid) return;
    const list = products[currentCat] || [];
    productGrid.innerHTML = list.map((p) => `
      <article class="product-card">
        <div class="product-img" style="background-image:url('${p.img}')"></div>
        <div>
          <h4>${p.name}</h4>
          <p class="product-meta">${p.desc}</p>
          <div class="product-bottom">
            <span class="product-price">${money(p.price)}</span>
            <button class="add-btn" data-add="${p.id}">ΠΡΟΣΘΗΚΗ</button>
          </div>
        </div>
      </article>
    `).join("");

    productGrid.querySelectorAll("[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-add");
        const product = getAllProducts().find((x) => x.id === id);
        if (!product) return;

        const existing = cart.get(id);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.set(id, { ...product, qty: 1 });
        }

        renderCart();
        pulseCart();
      });
    });
  }

  function renderCart() {
    if (!cartItems || !subtotalEl || !totalEl || !deliveryEl) return;
    const list = Array.from(cart.values());

    if (!list.length) {
      cartItems.innerHTML = `<p class="cart-empty">Το καλάθι σου είναι άδειο.</p>`;
    } else {
      cartItems.innerHTML = list.map((item) => `
        <article class="cart-item">
          <div>
            <h4>${item.name}</h4>
            <small>${money(item.price)} x ${item.qty}</small>
          </div>
          <div>
            <div class="qty-controls">
              <button type="button" class="qty-btn" data-dec="${item.id}">-</button>
              <span>${item.qty}</span>
              <button type="button" class="qty-btn" data-inc="${item.id}">+</button>
            </div>
            <button type="button" class="remove-btn" data-remove="${item.id}">Αφαίρεση</button>
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

    const subtotal = list.reduce((sum, x) => sum + x.price * x.qty, 0);
    const delivery = subtotal === 0 || subtotal >= 15 ? 0 : 1.9;

    subtotalEl.textContent = money(subtotal);
    deliveryEl.textContent = money(delivery);
    totalEl.textContent = money(subtotal + delivery);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.remove("active"));
      tab.classList.add("active");
      currentCat = tab.dataset.cat || "wraps";
      renderProducts();
    });
  });

  checkoutForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("customerName")?.value.trim();
    const phone = document.getElementById("customerPhone")?.value.trim();
    const address = document.getElementById("customerAddress")?.value.trim();
    const payment = document.getElementById("paymentMethod")?.value;

    if (!cart.size) {
      orderMessage.textContent = "Πρόσθεσε πρώτα προϊόντα στο καλάθι.";
      orderMessage.style.color = "#c12d2d";
      return;
    }

    if (!name || !phone || !address || !payment) {
      orderMessage.textContent = "Συμπλήρωσε όλα τα στοιχεία παράδοσης.";
      orderMessage.style.color = "#c12d2d";
      return;
    }

    orderMessage.textContent = `Ευχαριστούμε ${name}! Η παραγγελία σου καταχωρήθηκε και θα λάβεις επιβεβαίωση στο ${phone}.`;
    orderMessage.style.color = "#13a35f";

    cart.clear();
    checkoutForm.reset();
    renderCart();
  });

  renderProducts();
  renderCart();
})();

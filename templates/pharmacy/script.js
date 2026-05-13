(function initPharmacyTemplate() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const openCart = document.getElementById("openCart");
  const closeCart = document.getElementById("closeCart");
  const cartDrawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("overlay");
  const cartCount = document.getElementById("cartCount");
  const cartList = document.getElementById("cartList");
  const cartTotal = document.getElementById("cartTotal");
  const productRow = document.getElementById("productRow");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutMsg = document.getElementById("checkoutMsg");

  const products = [
    { id: "p1", name: "APIVITA HA5 Serum 15ml", desc: "ΔΩΡΟ serum με επιλεγμένα προϊόντα", price: 14.9, img: "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?auto=format&fit=crop&w=400&q=80", tag: "ΔΩΡΟ" },
    { id: "p2", name: "DUCRAY Anaphase Σαμπουάν", desc: "100ml κατά της τριχόπτωσης", price: 11.8, img: "https://images.unsplash.com/photo-1585386959984-a41552231658?auto=format&fit=crop&w=400&q=80", tag: "ΠΡΟΣΦΟΡΑ" },
    { id: "p3", name: "Klorane Σαμπουάν Κινίνης", desc: "Ενίσχυση ρίζας και όγκου", price: 9.7, img: "https://images.unsplash.com/photo-1600181956697-a5760a9f9935?auto=format&fit=crop&w=400&q=80", tag: "ΔΩΡΟ" },
    { id: "p4", name: "La Roche Posay SPF50", desc: "Αντηλιακή προστασία προσώπου", price: 16.5, img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=400&q=80", tag: "BEST" },
    { id: "p5", name: "Bepanthol Αφρόλουτρο", desc: "Ήπιος καθαρισμός για ευαίσθητο δέρμα", price: 8.9, img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=400&q=80", tag: "NEW" }
  ];

  const cart = new Map();

  function money(v) {
    return `${v.toFixed(2)}€`;
  }

  function toggleCart(open) {
    if (!cartDrawer || !overlay) return;
    cartDrawer.classList.toggle("open", open);
    overlay.classList.toggle("show", open);
  }

  menuBtn?.addEventListener("click", () => {
    mobileNav?.classList.toggle("open");
  });

  openCart?.addEventListener("click", () => toggleCart(true));
  closeCart?.addEventListener("click", () => toggleCart(false));
  overlay?.addEventListener("click", () => toggleCart(false));

  function renderProducts() {
    if (!productRow) return;
    productRow.innerHTML = products.map((p) => `
      <article class="product-card reveal">
        <div class="product-photo" style="background-image:url('${p.img}')"></div>
        <span class="product-tag">${p.tag}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-bottom">
          <span class="product-price">${money(p.price)}</span>
          <button class="product-add" data-add="${p.id}">Προσθήκη</button>
        </div>
      </article>
    `).join("");

    productRow.querySelectorAll("[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-add");
        const p = products.find((x) => x.id === id);
        if (!p) return;

        const existing = cart.get(id);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.set(id, { ...p, qty: 1 });
        }

        renderCart();
        toggleCart(true);
      });
    });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  function renderCart() {
    if (!cartList || !cartTotal || !cartCount) return;
    const list = Array.from(cart.values());

    cartCount.textContent = String(list.reduce((sum, x) => sum + x.qty, 0));

    if (!list.length) {
      cartList.innerHTML = `<p class="cart-empty">Το καλάθι σου είναι άδειο.</p>`;
      cartTotal.textContent = money(0);
      return;
    }

    cartList.innerHTML = list.map((item) => `
      <article class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <small>${money(item.price)} x ${item.qty}</small>
        </div>
        <div>
          <div class="qty">
            <button data-dec="${item.id}">-</button>
            <span>${item.qty}</span>
            <button data-inc="${item.id}">+</button>
          </div>
          <button class="remove" data-remove="${item.id}">Αφαίρεση</button>
        </div>
      </article>
    `).join("");

    cartList.querySelectorAll("[data-inc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-inc");
        const it = cart.get(id);
        if (!it) return;
        it.qty += 1;
        renderCart();
      });
    });

    cartList.querySelectorAll("[data-dec]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-dec");
        const it = cart.get(id);
        if (!it) return;
        it.qty -= 1;
        if (it.qty <= 0) cart.delete(id);
        renderCart();
      });
    });

    cartList.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-remove");
        cart.delete(id);
        renderCart();
      });
    });

    const total = list.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotal.textContent = money(total);
  }

  checkoutBtn?.addEventListener("click", () => {
    if (!cart.size) {
      checkoutMsg.textContent = "Πρόσθεσε πρώτα προϊόντα στο καλάθι.";
      checkoutMsg.style.color = "#b82b2b";
      return;
    }

    checkoutMsg.textContent = "Η παραγγελία σου καταχωρήθηκε επιτυχώς!";
    checkoutMsg.style.color = "#178353";
    cart.clear();
    renderCart();
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  renderProducts();
  renderCart();
})();

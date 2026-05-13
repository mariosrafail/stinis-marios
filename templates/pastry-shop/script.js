const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('siteNav');
const cartButton = document.getElementById('cartButton');
const cartPanel = document.getElementById('cartPanel');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const totalEl = document.getElementById('total');
const deliveryMethodEl = document.getElementById('deliveryMethod');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutResult = document.getElementById('checkoutResult');

const products = [...document.querySelectorAll('.product-card')].map((card) => ({
  id: card.dataset.id,
  name: card.dataset.name,
  price: Number(card.dataset.price)
}));

const state = {
  items: []
};

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => siteNav.classList.remove('open'));
  });
}

if (cartButton && cartPanel) {
  cartButton.addEventListener('click', () => {
    cartPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function euro(value) {
  return `${value.toFixed(2)}€`;
}

function findProduct(id) {
  return products.find((p) => p.id === id);
}

function cartSubtotal() {
  return state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function shippingCost() {
  return deliveryMethodEl.value === 'pickup' ? 0 : 2.5;
}

function updateTotals() {
  const subtotal = cartSubtotal();
  const shipping = shippingCost();
  const total = subtotal + shipping;

  subtotalEl.textContent = euro(subtotal);
  shippingEl.textContent = euro(shipping);
  totalEl.textContent = euro(total);

  const count = state.items.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = String(count);
}

function renderCart() {
  if (state.items.length === 0) {
    cartItemsEl.innerHTML = '<p class="empty">Δεν έχεις προσθέσει προϊόντα ακόμα.</p>';
    updateTotals();
    return;
  }

  cartItemsEl.innerHTML = state.items
    .map(
      (item) => `
      <article class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <p>${euro(item.price)} x ${item.qty}</p>
          <button class="remove-btn" data-remove="${item.id}" type="button">Αφαίρεση</button>
        </div>
        <div class="cart-controls">
          <button class="qty-btn" data-minus="${item.id}" type="button">-</button>
          <span class="qty">${item.qty}</span>
          <button class="qty-btn" data-plus="${item.id}" type="button">+</button>
        </div>
      </article>`
    )
    .join('');

  updateTotals();
}

function addToCart(id) {
  const existing = state.items.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    const product = findProduct(id);
    if (!product) return;
    state.items.push({ ...product, qty: 1 });
  }

  renderCart();
}

function adjustQty(id, delta) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    state.items = state.items.filter((entry) => entry.id !== id);
  }

  renderCart();
}

function removeItem(id) {
  state.items = state.items.filter((item) => item.id !== id);
  renderCart();
}

document.querySelectorAll('.add-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    if (!card) return;

    addToCart(card.dataset.id);
    btn.textContent = 'Προστέθηκε!';
    setTimeout(() => {
      btn.textContent = '+ Προσθήκη';
    }, 850);
  });
});

cartItemsEl.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset.plus) {
    adjustQty(target.dataset.plus, 1);
  }

  if (target.dataset.minus) {
    adjustQty(target.dataset.minus, -1);
  }

  if (target.dataset.remove) {
    removeItem(target.dataset.remove);
  }
});

deliveryMethodEl.addEventListener('change', updateTotals);

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const method = deliveryMethodEl.value;

  if (!name || !phone || !address) {
    checkoutResult.textContent = 'Συμπλήρωσε όλα τα υποχρεωτικά πεδία.';
    return;
  }

  if (state.items.length === 0) {
    checkoutResult.textContent = 'Το καλάθι σου είναι άδειο. Πρόσθεσε πρώτα προϊόντα.';
    return;
  }

  const eta = method === 'pickup' ? '25-35 λεπτά' : '35-50 λεπτά';
  const finalTotal = cartSubtotal() + shippingCost();

  checkoutResult.innerHTML = `Ευχαριστούμε <strong>${name}</strong>! Η παραγγελία σου καταχωρήθηκε με σύνολο <strong>${euro(finalTotal)}</strong>. Εκτιμώμενος χρόνος: <strong>${eta}</strong>. Θα σε καλέσουμε στο ${phone}.`;

  checkoutForm.reset();
  deliveryMethodEl.value = 'delivery';
  state.items = [];
  renderCart();
});

renderCart();

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);
reveals.forEach((el) => observer.observe(el));

const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
  if (!hero) return;
  const y = window.scrollY * 0.08;
  hero.style.backgroundPosition = `center ${y}px`;
});

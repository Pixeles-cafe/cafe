const state = {
  cardConnected: false,
  cardId: null,
  points: 0
};

const cart = [];

function loadCard() {
  const input = document.getElementById('card-id');
  const val = input.value.trim();
  
  if (val.length >= 4) {
    state.cardConnected = true;
    state.cardId = val;
    state.points = 350; // Puntos iniciales simulados
    
    document.getElementById('user-points').innerText = state.points;
    document.getElementById('status-indicator').classList.add('active');
    alert(`☕ Tarjeta ${val} conectada exitosamente.`);
  } else {
    alert('Ingresa un ID de tarjeta válido (mínimo 4 caracteres).');
  }
}

function addToOrder(name, price) {
  cart.push({ name, price });
  updateCartUI();
}

function updateCartUI() {
  const container = document.getElementById('cart-items');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🍽️</div>
        <p>Tu carrito está vacío</p>
        <small>¡Selecciona algunos productos para comenzar!</small>
      </div>`;
    document.getElementById('cart-subtotal').innerText = '0';
    document.getElementById('cart-total').innerText = '0';
    return;
  }

  let subtotal = 0;
  cart.forEach((item, index) => {
    subtotal += item.price;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div>
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">$${item.price}</div>
      </div>
      <button class="btn-remove" onclick="removeItem(${index})">✕</button>
    `;
    container.appendChild(div);
  });

  const usePointsCheckbox = document.getElementById('use-points');
  let total = subtotal;

  if (usePointsCheckbox.checked) {
    if (!state.cardConnected || state.points < 100) {
      alert("Debes conectar una tarjeta que tenga al menos 100 puntos.");
      usePointsCheckbox.checked = false;
    } else {
      total = subtotal * 0.8; // 20% Descuento
    }
  }

  document.getElementById('cart-subtotal').innerText = subtotal.toLocaleString();
  document.getElementById('cart-total').innerText = Math.round(total).toLocaleString();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function filterCategory(cat) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    if (cat === 'all' || card.getAttribute('data-category') === cat) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function checkoutOrder() {
  if (cart.length === 0) {
    alert("Agrega productos a tu pedido.");
    return;
  }

  if (document.getElementById('use-points').checked && state.points >= 100) {
    state.points -= 100;
    document.getElementById('user-points').innerText = state.points;
  }

  alert("🎉 ¡Pedido registrado con éxito! Tu orden está en preparación en barra.");
  cart.length = 0;
  document.getElementById('use-points').checked = false;
  updateCartUI();
}
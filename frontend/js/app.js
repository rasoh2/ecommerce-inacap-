/*
  CyberShop - Frontend Core Application
  Desarrollado por Nova (Frontend Engineer) y Milo (Visual Director) - ai-team-dev
  Asistido por IA para expresiones regulares, sanitización y optimización DOM.
*/

// Estado global en memoria del cliente
const state = {
  products: [],
  cart: []
};

// URL base de la API
const API_URL = '/api';

// Expresiones regulares globales de validación (Tarea F2)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(?:\+?56)?9[0-9]{8}$/;

// Instancia de modal de Bootstrap para visualización rápida
let productModal = null;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  productModal = new bootstrap.Modal(document.getElementById('productDetailModal'));
  
  loadCartFromStorage();
  fetchProducts();
  setupEventListeners();
  setupFormValidation();
});

// ==========================================
// 1. OBTENCIÓN DE DATOS (API FETCH)
// ==========================================

async function fetchProducts() {
  const container = document.getElementById('products-container');
  
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    state.products = await response.json();
    renderCatalog();
  } catch (error) {
    console.error('Error al obtener productos:', error);
    renderCatalogError();
  }
}

// ==========================================
// 2. RENDERIZACIÓN DEL DOM (PREVENCIÓN XSS)
// ==========================================

// Renderizar Catálogo de Productos
function renderCatalog() {
  const container = document.getElementById('products-container');
  container.textContent = ''; // Limpiar skeletons de forma segura

  if (state.products.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'text-muted text-center my-5';
    emptyMsg.textContent = 'No hay productos disponibles en este momento.';
    container.appendChild(emptyMsg);
    return;
  }

  // Usar DocumentFragment para evitar múltiples reflows del DOM
  const fragment = document.createDocumentFragment();

  state.products.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col';

    const article = document.createElement('article');
    article.className = 'card h-100 bg-surface border-dark card-hover-effect';
    article.id = `product-card-${product._id}`;

    // Imagen
    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.className = 'card-img-top p-3 rounded';
    img.alt = product.name;
    img.loading = 'lazy';
    
    // Cuerpo de la tarjeta
    const body = document.createElement('div');
    body.className = 'card-body d-flex flex-column';

    const badge = document.createElement('span');
    badge.className = 'badge bg-secondary align-self-start mb-2';
    badge.textContent = product.category;

    const title = document.createElement('h3');
    title.className = 'h5 card-title text-white';
    title.textContent = product.name;

    const desc = document.createElement('p');
    desc.className = 'card-text text-muted small flex-grow-1';
    desc.textContent = product.description;

    const footer = document.createElement('div');
    footer.className = 'd-flex justify-content-between align-items-center mt-3';

    const price = document.createElement('span');
    price.className = 'fs-5 fw-bold text-success';
    price.textContent = `$${product.price.toLocaleString('es-CL')}`;

    // Botón de detalle
    const btnDetail = document.createElement('button');
    btnDetail.className = 'btn btn-sm btn-outline-secondary me-2 btn-view-detail';
    btnDetail.textContent = 'Detalle';
    btnDetail.dataset.id = product._id;

    // Botón de añadir
    const btnAdd = document.createElement('button');
    btnAdd.className = 'btn btn-sm btn-primary btn-add-cart';
    btnAdd.textContent = 'Añadir';
    btnAdd.dataset.id = product._id;
    
    // Comprobar stock para deshabilitar si está agotado
    if (product.stock === 0) {
      btnAdd.textContent = 'Agotado';
      btnAdd.disabled = true;
      btnAdd.className = 'btn btn-sm btn-outline-danger';
    }

    // Ensamblar elementos de forma segura (sin innerHTML)
    footer.appendChild(price);
    const btnsDiv = document.createElement('div');
    btnsDiv.appendChild(btnDetail);
    btnsDiv.appendChild(btnAdd);
    footer.appendChild(btnsDiv);

    body.appendChild(badge);
    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(footer);

    article.appendChild(img);
    article.appendChild(body);
    col.appendChild(article);
    
    fragment.appendChild(col);
  });

  container.appendChild(fragment);
}

// Mostrar error de red con opción de reintentar
function renderCatalogError() {
  const container = document.getElementById('products-container');
  container.textContent = ''; // Limpiar skeletons

  const col = document.createElement('div');
  col.className = 'col-12 text-center my-5';

  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-danger-custom d-inline-block p-4 border border-danger rounded';
  alertDiv.setAttribute('role', 'alert');

  const title = document.createElement('h3');
  title.className = 'h5 text-danger mb-2';
  title.textContent = 'Error de conexión';

  const text = document.createElement('p');
  text.className = 'mb-3 text-muted';
  text.textContent = 'No pudimos obtener el catálogo de productos. Por favor comprueba tu conexión.';

  const btnRetry = document.createElement('button');
  btnRetry.className = 'btn btn-danger btn-sm';
  btnRetry.textContent = 'Intentar de nuevo';
  btnRetry.id = 'btn-retry-catalog';
  btnRetry.addEventListener('click', () => {
    container.innerHTML = `
      <div class="col skeleton-placeholder">
        <div class="card h-100 bg-surface border-dark p-3">
          <div class="skeleton img-placeholder mb-3" style="height: 180px; width: 100%;"></div>
          <div class="skeleton" style="height: 20px; width: 80%;"></div>
        </div>
      </div>
    `;
    fetchProducts();
  });

  alertDiv.appendChild(title);
  alertDiv.appendChild(text);
  alertDiv.appendChild(btnRetry);
  col.appendChild(alertDiv);
  container.appendChild(col);
}

// Renderizar Detalle de Producto en Modal
function showProductDetail(productId) {
  const product = state.products.find(p => p._id === productId);
  if (!product) return;

  const titleContainer = document.getElementById('detail-product-title');
  const bodyContainer = document.getElementById('detail-product-body');

  titleContainer.textContent = product.name;
  bodyContainer.textContent = ''; // Limpiar anterior

  const img = document.createElement('img');
  img.src = product.imageUrl;
  img.className = 'img-fluid rounded mb-3 w-100';
  img.alt = product.name;

  const category = document.createElement('span');
  category.className = 'badge bg-secondary mb-2';
  category.textContent = product.category;

  const desc = document.createElement('p');
  desc.className = 'text-muted';
  desc.textContent = product.description;

  const infoDiv = document.createElement('div');
  infoDiv.className = 'd-flex justify-content-between align-items-center mt-4';

  const price = document.createElement('span');
  price.className = 'fs-4 fw-bold text-success';
  price.textContent = `$${product.price.toLocaleString('es-CL')}`;

  const stock = document.createElement('span');
  stock.className = `badge ${product.stock > 5 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`;
  stock.textContent = product.stock > 0 ? `Stock: ${product.stock} unidades` : 'Agotado';

  infoDiv.appendChild(price);
  infoDiv.appendChild(stock);

  bodyContainer.appendChild(img);
  bodyContainer.appendChild(category);
  bodyContainer.appendChild(desc);
  bodyContainer.appendChild(infoDiv);

  productModal.show();
}

// ==========================================
// 3. LÓGICA DEL CARRITO (ARREGLOS Y OBJETOS)
// ==========================================

function addToCart(productId) {
  const product = state.products.find(p => p._id === productId);
  if (!product || product.stock === 0) return;

  const cartItem = state.cart.find(item => item.productId === productId);
  if (cartItem) {
    if (cartItem.quantity < product.stock) {
      cartItem.quantity++;
    } else {
      alert(`Lo sentimos, no hay más stock disponible de ${product.name}.`);
    }
  } else {
    state.cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      maxStock: product.stock
    });
  }

  saveCartToStorage();
  updateCartDOM();
}

function changeQuantity(productId, amount) {
  const cartItem = state.cart.find(item => item.productId === productId);
  if (!cartItem) return;

  const newQty = cartItem.quantity + amount;
  if (newQty <= 0) {
    removeItemFromCart(productId);
  } else if (newQty <= cartItem.maxStock) {
    cartItem.quantity = newQty;
    saveCartToStorage();
    updateCartDOM();
  } else {
    alert(`No puedes agregar más unidades. El stock máximo es ${cartItem.maxStock}.`);
  }
}

function removeItemFromCart(productId) {
  state.cart = state.cart.filter(item => item.productId !== productId);
  saveCartToStorage();
  updateCartDOM();
}

function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(state.cart));
}

function loadCartFromStorage() {
  const stored = localStorage.getItem('cart');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        state.cart = parsed.map(item => ({
          ...item,
          productId: String(item.productId)
        }));
      } else {
        state.cart = [];
      }
    } catch (e) {
      state.cart = [];
    }
  }
}

// Actualizar Vista del Carrito en el DOM
function updateCartDOM() {
  const container = document.getElementById('cart-items-container');
  container.textContent = ''; // Limpiar de forma segura

  const totalBadge = document.getElementById('cart-badge-mobile');
  
  // Calcular cantidad total de ítems
  const totalItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  totalBadge.textContent = totalItemsCount;

  if (state.cart.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'text-muted text-center my-4';
    emptyMsg.id = 'empty-cart-message';
    emptyMsg.textContent = 'El carrito está vacío.';
    container.appendChild(emptyMsg);

    document.getElementById('cart-subtotal').textContent = '$0';
    document.getElementById('cart-total').textContent = '$0';
    
    // Deshabilitar submit del formulario si está vacío
    document.getElementById('btn-submit-checkout').disabled = true;
    return;
  }

  const fragment = document.createDocumentFragment();
  let subtotal = 0;

  state.cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item-row';

    const info = document.createElement('div');
    info.className = 'cart-item-info';

    const name = document.createElement('span');
    name.className = 'd-block text-white fw-medium small';
    name.textContent = item.name;

    const price = document.createElement('span');
    price.className = 'text-success small';
    price.textContent = `$${item.price.toLocaleString('es-CL')} x ${item.quantity}`;

    info.appendChild(name);
    info.appendChild(price);

    const actions = document.createElement('div');
    actions.className = 'cart-item-actions';

    // Botón menos
    const btnMinus = document.createElement('button');
    btnMinus.className = 'btn btn-xs btn-outline-secondary quantity-btn cart-btn-action';
    btnMinus.textContent = '-';
    btnMinus.type = 'button';
    btnMinus.dataset.action = 'minus';
    btnMinus.dataset.id = item.productId;

    // Indicador cantidad
    const qtySpan = document.createElement('span');
    qtySpan.className = 'text-white px-1';
    qtySpan.textContent = item.quantity;

    // Botón más
    const btnPlus = document.createElement('button');
    btnPlus.className = 'btn btn-xs btn-outline-secondary quantity-btn cart-btn-action';
    btnPlus.textContent = '+';
    btnPlus.type = 'button';
    btnPlus.dataset.action = 'plus';
    btnPlus.dataset.id = item.productId;

    // Botón eliminar
    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn btn-xs btn-outline-danger ms-2 cart-btn-action';
    btnDelete.textContent = '🗑️';
    btnDelete.type = 'button';
    btnDelete.dataset.action = 'delete';
    btnDelete.dataset.id = item.productId;

    actions.appendChild(btnMinus);
    actions.appendChild(qtySpan);
    actions.appendChild(btnPlus);
    actions.appendChild(btnDelete);

    row.appendChild(info);
    row.appendChild(actions);

    fragment.appendChild(row);
    subtotal += item.price * item.quantity;
  });

  container.appendChild(fragment);

  document.getElementById('cart-subtotal').textContent = `$${subtotal.toLocaleString('es-CL')}`;
  document.getElementById('cart-total').textContent = `$${subtotal.toLocaleString('es-CL')}`;
  
  // Re-validar formulario para ver si habilitamos el botón de checkout
  validateCheckoutForm();
}

// ==========================================
// 4. VALIDACIONES DE FORMULARIO (CLIENTE)
// ==========================================

function setupFormValidation() {
  const form = document.getElementById('checkout-form');
  const nameInput = document.getElementById('checkout-name');
  const emailInput = document.getElementById('checkout-email');
  const phoneInput = document.getElementById('checkout-phone');
  const paymentSelect = document.getElementById('checkout-payment');

  const inputs = [nameInput, emailInput, phoneInput, paymentSelect];

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      validateField(input);
      validateCheckoutForm();
    });
    input.addEventListener('blur', () => {
      validateField(input);
      validateCheckoutForm();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateCheckoutForm()) {
      processCheckout();
    }
  });
}

function validateField(input) {
  let isValid = true;
  
  if (input.id === 'checkout-name') {
    // Debe tener al menos 3 caracteres y solo letras/espacios
    const nameVal = input.value.trim();
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
    isValid = nameRegex.test(nameVal);
  } else if (input.id === 'checkout-email') {
    isValid = EMAIL_REGEX.test(input.value.trim());
  } else if (input.id === 'checkout-phone') {
    const phoneVal = input.value.trim().replace(/\s+/g, '');
    isValid = PHONE_REGEX.test(phoneVal);
  } else if (input.id === 'checkout-payment') {
    isValid = input.value !== '';
  }

  if (isValid) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
  }

  return isValid;
}

function validateCheckoutForm() {
  const nameInput = document.getElementById('checkout-name');
  const emailInput = document.getElementById('checkout-email');
  const phoneInput = document.getElementById('checkout-phone');
  const paymentSelect = document.getElementById('checkout-payment');
  const btnSubmit = document.getElementById('btn-submit-checkout');

  // Solo habilitar si hay elementos en el carrito y todos los campos son válidos
  const cartNotEmpty = state.cart.length > 0;
  const isNameValid = nameInput.value.trim().length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nameInput.value);
  const isEmailValid = EMAIL_REGEX.test(emailInput.value.trim());
  const isPhoneValid = PHONE_REGEX.test(phoneInput.value.trim().replace(/\s+/g, ''));
  const isPaymentValid = paymentSelect.value !== '';

  const isFormValid = isNameValid && isEmailValid && isPhoneValid && isPaymentValid && cartNotEmpty;
  btnSubmit.disabled = !isFormValid;

  return isFormValid;
}

// ==========================================
// 5. PROCESAMIENTO DE COMPRA (CHECKOUT)
// ==========================================

async function processCheckout() {
  const btnSubmit = document.getElementById('btn-submit-checkout');
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Procesando...';

  const customerName = document.getElementById('checkout-name').value.trim();
  const customerEmail = document.getElementById('checkout-email').value.trim();
  const customerPhone = document.getElementById('checkout-phone').value.trim();
  const paymentMethod = document.getElementById('checkout-payment').value;

  const orderData = {
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone
    },
    items: state.cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))
  };

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al procesar la orden.');
    }

    // Éxito: Renderizar pantalla de confirmación
    renderCheckoutSuccess(result.orderId);

  } catch (error) {
    console.error('Error en checkout:', error);
    alert(`No se pudo completar tu compra: ${error.message}`);
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Confirmar Compra';
  }
}

// Mostrar pantalla de éxito sobre la barra lateral del carrito (Asistido por IA)
function renderCheckoutSuccess(orderId) {
  const successOrderId = document.getElementById('success-order-id');
  if (successOrderId) {
    successOrderId.textContent = orderId;
  }

  const cartContentWrapper = document.getElementById('cart-content-wrapper');
  const successWrapper = document.getElementById('checkout-success-wrapper');

  if (cartContentWrapper) cartContentWrapper.classList.add('d-none');
  if (successWrapper) successWrapper.classList.remove('d-none');
}

// ==========================================
// 6. EVENT LISTENERS GENERALES
// ==========================================

let listenersAttached = false;

function setupEventListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  // Delegación de eventos en el contenedor de productos (para catálogo dinámico)
  const productsContainer = document.getElementById('products-container');
  
  productsContainer.addEventListener('click', (e) => {
    const target = e.target;
    
    // Clic en añadir al carrito
    if (target.classList.contains('btn-add-cart')) {
      const id = target.dataset.id;
      addToCart(id);
    }
    
    // Clic en ver detalle
    if (target.classList.contains('btn-view-detail')) {
      const id = target.dataset.id;
      showProductDetail(id);
    }
  });

  // Delegación de eventos en el carrito (Optimizado para evitar memory leaks - Asistido por IA)
  bindCartItemsListener();

  // Event listener y movimiento responsivo del carrito en móvil (Sin clonación - Asistido por IA)
  const btnToggleMobile = document.getElementById('btn-toggle-cart-mobile');
  const cartOffcanvasEl = document.getElementById('cartOffcanvas');
  
  if (btnToggleMobile && cartOffcanvasEl) {
    const cartOffcanvas = new bootstrap.Offcanvas(cartOffcanvasEl);
    
    btnToggleMobile.addEventListener('click', () => {
      cartOffcanvas.show();
    });

    // Mover el contenedor del carrito al Offcanvas cuando se va a mostrar
    cartOffcanvasEl.addEventListener('show.bs.offcanvas', () => {
      const mobileBody = document.getElementById('cart-offcanvas-body');
      const cartCardContainer = document.getElementById('cart-card-container');
      mobileBody.appendChild(cartCardContainer);
    });

    // Devolver el contenedor del carrito a la barra lateral de escritorio cuando se oculta
    cartOffcanvasEl.addEventListener('hide.bs.offcanvas', () => {
      const desktopSidebar = document.getElementById('cart-sidebar');
      const cartCardContainer = document.getElementById('cart-card-container');
      desktopSidebar.appendChild(cartCardContainer);
    });
  }

  // Event listener para botón de éxito "Seguir Comprando" (Asistido por IA)
  const btnSuccessClose = document.getElementById('btn-success-close');
  if (btnSuccessClose) {
    btnSuccessClose.addEventListener('click', () => {
      // Vaciar carrito
      state.cart = [];
      saveCartToStorage();

      // Resetear inputs del formulario de checkout
      const form = document.getElementById('checkout-form');
      if (form) form.reset();

      // Limpiar clases de validación
      const nameInput = document.getElementById('checkout-name');
      const emailInput = document.getElementById('checkout-email');
      const phoneInput = document.getElementById('checkout-phone');
      const paymentSelect = document.getElementById('checkout-payment');
      [nameInput, emailInput, phoneInput, paymentSelect].forEach(input => {
        if (input) {
          input.classList.remove('is-valid', 'is-invalid');
        }
      });

      // Alternar visibilidad de los wrappers en vez de recrear HTML
      const cartContentWrapper = document.getElementById('cart-content-wrapper');
      const successWrapper = document.getElementById('checkout-success-wrapper');
      if (cartContentWrapper) cartContentWrapper.classList.remove('d-none');
      if (successWrapper) successWrapper.classList.add('d-none');

      // Actualizar el DOM y recargar catálogo
      updateCartDOM();
      fetchProducts();
    });
  }
}

function bindCartItemsListener() {
  const cartItemsContainer = document.getElementById('cart-items-container');
  if (cartItemsContainer) {
    cartItemsContainer.removeEventListener('click', handleCartClick);
    cartItemsContainer.addEventListener('click', handleCartClick);
  }
}

function handleCartClick(e) {
  const button = e.target.closest('.cart-btn-action');
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === 'minus') {
    changeQuantity(id, -1);
  } else if (action === 'plus') {
    changeQuantity(id, 1);
  } else if (action === 'delete') {
    removeItemFromCart(id);
  }
}

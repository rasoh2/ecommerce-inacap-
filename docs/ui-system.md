# Sistema de Diseño y Guía de Interfaz (UX/UI Spec)

**Enfoque Visual:** Modo Oscuro Premium (Deep Dark / Cyberpunk Minimalist)  
**Tecnologías:** HTML5 Semántico, Vanilla CSS, Bootstrap 5 (Clases de utilidad y layout)  
**Estado:** Aprobado para Implementación  

---

## 1. Guía de Diseño Visual (Modo Oscuro)

Para lograr un acabado premium y profesional, se define una paleta de colores de alto contraste que cumple con las directrices de accesibilidad **WCAG AA** (contraste mínimo de 4.5:1 para texto normal y 3:1 para texto grande).

### A. Paleta de Colores
* **Fondo Base (Body):** `#090d16` (Slate Black)
  - *Uso:* Fondo general de la aplicación.
* **Fondo Superficie (Tarjetas/Paneles):** `#111827` (Slate Gray)
  - *Uso:* Tarjetas de producto, barra lateral del carrito y modales.
* **Color Primario (Accento/Marca):** `#6366f1` (Indigo Neon)
  - *Uso:* Botones principales, enlaces activos y bordes de enfoque.
* **Color Secundario (Éxito/Confirmación):** `#10b981` (Emerald Green)
  - *Uso:* Botones de checkout exitoso, insignias de stock e indicadores de éxito.
* **Color de Error/Alerta:** `#ef4444` (Ruby Red)
  - *Uso:* Mensajes de error en formularios y alertas de fallos de red.
* **Texto Principal:** `#f8fafc` (Off-White) - Contraste superior a 10:1 sobre el fondo base.
* **Texto Secundario/Muted:** `#94a3b8` (Muted Blue-Gray) - Contraste superior a 5.5:1 sobre el fondo base.

### B. Tipografía
* **Fuentes Recomendadas:**
  - Primaria: `'Outfit', sans-serif` (Google Fonts) - Aporta un aire moderno y tecnológico.
  - Secundaria: `'Inter', sans-serif` (Google Fonts) - Utilizada para textos largos y formularios por su alta legibilidad.
* **Escala de Tamaños:**
  - `h1` (Título Principal): `2.25rem` (36px) | SemiBold (600)
  - `h2` (Títulos de Sección): `1.5rem` (24px) | Medium (500)
  - `h3` (Títulos de Tarjetas): `1.125rem` (18px) | Medium (500)
  - `body` (Texto Base): `1rem` (16px) | Regular (400)
  - `small` (Textos de ayuda/error): `0.875rem` (14px) | Regular (400)

### C. Espaciado y Rejilla (Grid System)
* Sistema basado en escala de potencia de 2 (`4px`, `8px`, `16px`, `24px`, `32px`, `48px`).
* Utilización del sistema de rejilla flexbox de **Bootstrap 5** (`container`, `row`, `col-md-*`).
* Márgenes consistentes: `mb-4` para separación de secciones, `p-3` para padding interno de tarjetas.

---

## 2. Estructura Semántica HTML5

La estructura garantiza la accesibilidad (lectores de pantalla) y el orden semántico del código.

### A. Estructura Principal (`index.html`)
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberShop - E-commerce Premium</title>
  <!-- Google Fonts & Bootstrap 5 CSS -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Outfit:wght@500;600&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/index.css">
</head>
<body class="bg-base text-main">

  <!-- Encabezado de Navegación -->
  <header class="navbar navbar-expand-lg sticky-top border-bottom border-dark">
    <div class="container">
      <a class="navbar-brand text-brand fs-4" href="#">CyberShop</a>
      <button class="btn btn-primary position-relative" id="btn-toggle-cart" aria-label="Abrir carrito">
        Carrito
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="cart-badge">0</span>
      </button>
    </div>
  </header>

  <!-- Área de Contenido Principal -->
  <main class="container my-5">
    <div class="row g-4">
      
      <!-- Sección del Catálogo (Izquierda) -->
      <section class="col-lg-8" id="catalog-section" aria-labelledby="catalog-title">
        <h2 class="mb-4 text-brand" id="catalog-title">Catálogo de Productos</h2>
        <!-- Contenedor dinámico de productos -->
        <div class="row row-cols-1 row-cols-md-2 g-4" id="products-container">
          <!-- Renderizado dinámico desde JS -->
        </div>
      </section>

      <!-- Sección Lateral del Carrito y Checkout (Derecha) -->
      <aside class="col-lg-4" id="cart-sidebar" aria-labelledby="cart-title">
        <div class="card bg-surface border-dark p-4 sticky-top-offset">
          <h2 class="h4 mb-4 text-brand" id="cart-title">Tu Carrito</h2>
          
          <!-- Lista de Items en el Carrito -->
          <div class="cart-items-list mb-4" id="cart-items-container" role="list">
            <!-- Renderizado dinámico desde JS -->
          </div>

          <!-- Resumen de Totales -->
          <div class="border-top border-dark pt-3 mb-4">
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Subtotal</span>
              <span id="cart-subtotal">$0</span>
            </div>
            <div class="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span class="text-success" id="cart-total">$0</span>
            </div>
          </div>

          <!-- Formulario de Checkout (Al menos 3 campos obligatorios) -->
          <form id="checkout-form" class="needs-validation" novalidate>
            <div class="mb-3">
              <label for="checkout-name" class="form-label">Nombre Completo</label>
              <input type="text" class="form-control bg-dark border-dark text-white" id="checkout-name" required placeholder="Juan Pérez">
              <div class="invalid-feedback" id="name-feedback">El nombre es obligatorio y debe tener al menos 3 caracteres.</div>
            </div>
            
            <div class="mb-3">
              <label for="checkout-email" class="form-label">Correo Electrónico</label>
              <input type="email" class="form-control bg-dark border-dark text-white" id="checkout-email" required placeholder="juan@example.com">
              <div class="invalid-feedback" id="email-feedback">Por favor introduce un correo válido.</div>
            </div>

            <div class="mb-3">
              <label for="checkout-payment" class="form-label">Método de Pago</label>
              <select class="form-select bg-dark border-dark text-white" id="checkout-payment" required>
                <option value="" disabled selected>Selecciona una opción...</option>
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                <option value="efectivo">Pago en Efectivo (Contra Entrega)</option>
              </select>
              <div class="invalid-feedback">Por favor selecciona un método de pago.</div>
            </div>

            <button type="submit" class="btn btn-success w-100 py-2 fs-5" id="btn-submit-checkout" disabled>
              Confirmar Compra
            </button>
          </form>

        </div>
      </aside>

    </div>
  </main>

  <!-- Modal de Detalle de Producto -->
  <div class="modal fade" id="productDetailModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content bg-surface border-dark text-white">
        <div class="modal-header border-dark">
          <h5 class="modal-title" id="detail-product-title">Detalle del Producto</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body" id="detail-product-body">
          <!-- Renderizado dinámico desde JS -->
        </div>
      </div>
    </div>
  </div>

  <footer class="text-center py-4 border-top border-dark mt-auto">
    <p class="text-muted small mb-0">&copy; 2026 CyberShop. Evaluación Sumativa N°2 - INACAP Maipú.</p>
  </footer>

  <!-- Bootstrap Bundle with Popper -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/app.js" type="module"></script>
</body>
</html>
```

### B. Elemento Tarjeta de Producto (`<article>`)
Para cumplir estrictamente con el criterio de manipulación dinámica del DOM, el catálogo renderizará el siguiente nodo estructurado por cada elemento:
```html
<article class="col" id="product-card-{id}">
  <div class="card h-100 bg-surface border-dark card-hover-effect">
    <img src="{imageUrl}" class="card-img-top p-3 rounded" alt="{name}" loading="lazy">
    <div class="card-body d-flex flex-column">
      <span class="badge bg-indigo-muted align-self-start mb-2">{category}</span>
      <h3 class="h5 card-title text-main">{name}</h3>
      <p class="card-text text-muted small flex-grow-1">{description}</p>
      <div class="d-flex justify-content-between align-items-center mt-3">
        <span class="fs-5 fw-bold text-success">${price}</span>
        <button class="btn btn-sm btn-outline-primary btn-add-cart" data-id="{id}">
          Añadir al Carrito
        </button>
      </div>
    </div>
  </div>
</article>
```

---

## 3. Comportamientos Interactivos y Estados de la UI

### A. Estado de Carga (Skeletons)
Mientras el cliente consulta `GET /api/products`, se inyectarán placeholders que simulan la forma física de las tarjetas para reducir la percepción de espera (Perceived Performance).

* **Clase CSS de animación (Pulsado):**
  ```css
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.25; }
  }
  .skeleton {
    animation: pulse 1.5s infinite ease-in-out;
    background-color: #1e293b;
    border-radius: 4px;
  }
  ```
* **HTML del Skeleton del Catálogo:**
  ```html
  <div class="col skeleton-card-placeholder">
    <div class="card h-100 bg-surface border-dark p-3">
      <div class="skeleton img-placeholder mb-3" style="height: 150px; width: 100%;"></div>
      <div class="skeleton title-placeholder mb-2" style="height: 20px; width: 80%;"></div>
      <div class="skeleton desc-placeholder mb-3" style="height: 40px; width: 100%;"></div>
      <div class="d-flex justify-content-between align-items-center">
        <div class="skeleton price-placeholder" style="height: 24px; width: 30%;"></div>
        <div class="skeleton button-placeholder" style="height: 32px; width: 40%;"></div>
      </div>
    </div>
  </div>
  ```

### B. Manejo Visual de Errores de Red
Si falla la llamada a la API (error 500, problemas de conexión o servidor inactivo):
1. **En el Catálogo:**
   - Se removerán los skeletons.
   - Se inyectará un bloque de alerta responsiva con la opción de reintentar la carga.
   ```html
   <div class="col-12 text-center my-5" id="catalog-error-container">
     <div class="alert alert-danger-custom d-inline-block p-4 border border-danger rounded" role="alert">
       <h3 class="h5 text-danger mb-2">Error de conexión</h3>
       <p class="mb-3 text-muted">No pudimos obtener el catálogo de productos. Revisa tu conexión a internet.</p>
       <button class="btn btn-danger btn-sm" id="btn-retry-catalog">Intentar de nuevo</button>
     </div>
   </div>
   ```
2. **En el Checkout:**
   - Si la petición de orden de compra (`POST /api/orders`) falla, el botón de confirmación se habilitará nuevamente para evitar bloqueos y se renderizará un cartel de error dinámico debajo del formulario usando `createElement` y `textContent` para proteger contra XSS.

### C. Estados de Éxito
Cuando la orden se procesa exitosamente en el servidor (respuesta `201 Created` con el ID de la orden):
1. Se limpia el estado local del carrito en el cliente.
2. El formulario se reinicia.
3. Se inyecta una pantalla de éxito interactiva sobre la barra lateral del carrito o a través de un Modal dedicado:
   ```html
   <div class="text-center py-5" id="checkout-success-view">
     <div class="success-icon mb-3 text-success" style="font-size: 3rem;">✓</div>
     <h3 class="h4 text-main mb-2">¡Compra Confirmada!</h3>
     <p class="text-muted small">Tu orden ha sido registrada con éxito en nuestro sistema.</p>
     <div class="bg-dark p-3 rounded mb-4">
       <span class="text-muted d-block small">ID de la Orden:</span>
       <code class="text-success" id="success-order-id">{orderId}</code>
     </div>
     <button class="btn btn-outline-success btn-sm" id="btn-continue-shopping">Seguir Comprando</button>
   </div>
   ```

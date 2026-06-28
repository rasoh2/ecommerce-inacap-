# Sistema de Diseño y Guía de Interfaz (UX/UI Spec - Estilo Mercado Libre)

**Enfoque Visual:** Mercado Libre Clean Design (Fondo Gris Claro / Header Amarillo Institucional)  
**Tecnologías:** HTML5 Semántico, Vanilla CSS, Bootstrap 5 (Clases de utilidad y layout flex/grid)  
**Estado:** Aprobado para Implementación de Alta Conversión  

---

## 1. Guía de Diseño Visual y Paleta de Colores

Para optimizar la tasa de conversión (CRO) y replicar la experiencia de usuario familiar de Mercado Libre, se define una interfaz limpia basada en contrastes marcados, bordes redondeados suaves y tipografía de lectura rápida.

### A. Paleta de Colores
* **Amarillo Institucional (Header):** `#FFF159`
  - *Uso:* Fondo de la barra de navegación superior (Header). Aporta identidad de marca instantánea.
* **Fondo Base (Body):** `#EFEFEF` o `#F5F5F5`
  - *Uso:* Fondo general de la aplicación, dando relieve a las tarjetas de contenido blancas.
* **Azul de Acción (Primario/Botones/Enlaces):** `#3483FA`
  - *Uso:* Botón "Comprar ahora", enlaces activos, botones de llamada a la acción principal (CTA) y enfoque.
* **Azul Secundario (Fondo de Acción):** `#E3EDFB`
  - *Uso:* Fondo del botón "Agregar al carrito" secundario o elementos interactivos de menor jerarquía.
* **Verde de Envío Gratis/Descuentos:** `#00A650`
  - *Uso:* Texto e íconos de "Envío gratis", etiquetas de descuento y estados de éxito.
* **Blanco Puro (Superficie/Tarjetas):** `#FFFFFF`
  - *Uso:* Tarjetas de producto, contenedor de detalles, caja de compra sticky y barra de checkout.
* **Texto Principal:** `#333333` (Gris casi negro)
  - *Uso:* Títulos principales, precios destacados y textos de alta relevancia.
* **Texto Secundario/Muted:** `#666666` (Gris medio)
  - *Uso:* Descripciones secundarias, especificaciones y subtítulos de menor peso.
* **Gris de Borde:** `#E6E6E6`
  - *Uso:* Bordes divisores sutiles y contornos de tarjetas.

### B. Tipografía
* **Fuentes Recomendadas:**
  - Primaria: `'Inter', sans-serif` (Google Fonts) - Alternativa premium de alta legibilidad a Proxima Nova.
* **Escala de Tamaños:**
  - Título Detalle de Producto: `1.625rem` (26px) | SemiBold (600)
  - Precio Destacado: `2rem` (32px) | Regular/Light (300/400)
  - Título Tarjeta Catálogo: `0.875rem` (14px) | Regular (400)
  - Textos de Envío/Cuotas: `0.8125rem` (13px) | Regular (400)

---

## 2. Cabecera (Header) de Alta Conversión

Una barra superior fija de dos filas con ancho completo que organiza los accesos de búsqueda, ubicación y perfil.

### Estructura Semántica HTML5 del Header

```html
<header class="ml-header">
  <div class="container ml-header-container">
    
    <!-- Fila Superior: Identidad, Búsqueda y Beneficios -->
    <div class="ml-header-row-top">
      <!-- Logo -->
      <a href="#" class="ml-logo" aria-label="Volver a Inicio">
        <span class="ml-logo-text">CyberShop</span>
      </a>

      <!-- Barra de Búsqueda Prominente -->
      <form class="ml-search-bar" role="search">
        <input type="text" placeholder="Buscar productos, marcas y más..." aria-label="Buscar productos" id="search-input">
        <button type="submit" class="ml-search-btn" aria-label="Buscar">
          <i class="ml-icon-search">🔍</i>
        </button>
      </form>

      <!-- Banner de Beneficios a la Derecha -->
      <div class="ml-header-promo">
        <span class="ml-promo-text">🚚 Envíos gratis en 24h</span>
      </div>
    </div>

    <!-- Fila Inferior: Ubicación, Menús y Carrito -->
    <div class="ml-header-row-bottom">
      <!-- Selector de Ubicación/Comuna -->
      <div class="ml-delivery-location">
        <span class="ml-location-pin">📍</span>
        <div class="ml-location-info">
          <span class="ml-location-label">Enviar a</span>
          <span class="ml-location-value" id="current-location">Santiago, Chile</span>
        </div>
      </div>

      <!-- Menú de Categorías Desplegable -->
      <nav class="ml-categories-nav">
        <ul class="ml-nav-list">
          <li class="ml-nav-item dropdown">
            <a href="#" class="ml-nav-link dropdown-toggle" id="categoriesDropdown">Categorías</a>
          </li>
          <li class="ml-nav-item"><a href="#" class="ml-nav-link">Ofertas</a></li>
          <li class="ml-nav-item"><a href="#" class="ml-nav-link">Historial</a></li>
          <li class="ml-nav-item"><a href="#" class="ml-nav-link">Ayuda</a></li>
        </ul>
      </nav>

      <!-- Accesos de Usuario y Carrito -->
      <div class="ml-user-menu">
        <a href="#" class="ml-user-link">Crear cuenta</a>
        <a href="#" class="ml-user-link">Ingresar</a>
        <a href="#" class="ml-user-link">Mis compras</a>
        
        <!-- Carrito de Compras Dinámico -->
        <button class="ml-cart-trigger" id="btn-toggle-cart" aria-label="Ver carrito">
          <span class="ml-cart-icon">🛒</span>
          <span class="ml-cart-badge" id="cart-badge">0</span>
        </button>
      </div>
    </div>

  </div>
</header>
```

---

## 3. Grilla del Catálogo (Product Grid)

Fondo gris claro (`#EFEFEF`) con tarjetas individuales blancas que organizan los elementos visuales de forma vertical.

### Estructura de Tarjeta de Producto (`<article>`)

```html
<article class="ml-product-card" id="product-card-{id}">
  <!-- Contenedor blanco cuadrado perfecto de imagen -->
  <div class="ml-card-img-container">
    <img src="{imageUrl}" alt="{name}" class="ml-card-img" loading="lazy">
  </div>
  
  <!-- Cuerpo de la Tarjeta con detalles técnicos -->
  <div class="ml-card-body">
    <!-- Envío gratis destacado en verde en la parte superior del texto -->
    <div class="ml-card-shipping-tag">
      <span class="ml-free-shipping-text">Envío gratis</span>
    </div>
    
    <!-- Precio en tamaño grande y cuotas sin interés -->
    <div class="ml-card-price-container">
      <span class="ml-product-price">${price}</span>
      <span class="ml-product-installments">en 6x sin interés</span>
    </div>
    
    <!-- Título corto limitado a 2 líneas -->
    <h3 class="ml-product-title">{name}</h3>
    
    <!-- Botón secundario para ver detalle rápido -->
    <button class="btn-detail-trigger ml-btn-secondary" data-id="{id}">
      Ver detalle
    </button>
  </div>
</article>
```

---

## 4. Vista de Detalle de Producto Asimétrica

Diseño de doble columna: contenidos y galería a la izquierda (columna ancha), caja de compra fija (sticky) a la derecha (columna estrecha).

### Maquetación de la Vista de Detalle

```html
<div class="ml-detail-layout">
  
  <!-- Columna Izquierda: Galería e Información Técnica -->
  <div class="ml-detail-column-left">
    
    <!-- Contenedor de Galería e Imagen Principal -->
    <div class="ml-gallery-container">
      <!-- Carrusel de Miniaturas a la izquierda -->
      <div class="ml-thumbnails-panel">
        <button class="ml-thumbnail-btn active"><img src="{imageUrl1}" alt="Vista 1"></button>
        <button class="ml-thumbnail-btn"><img src="{imageUrl2}" alt="Vista 2"></button>
        <button class="ml-thumbnail-btn"><img src="{imageUrl3}" alt="Vista 3"></button>
      </div>
      <!-- Imagen Ampliada Central -->
      <div class="ml-main-image-viewport">
        <img src="{imageUrl}" alt="{name}" id="main-detail-image">
      </div>
    </div>

    <!-- Separador y Descripción Técnica -->
    <section class="ml-technical-description">
      <h2 class="ml-section-title">Descripción</h2>
      <p class="ml-description-text">{description}</p>
    </section>

  </div>

  <!-- Columna Derecha: Caja de Compra Flotante (Sticky) -->
  <aside class="ml-detail-column-right">
    <div class="ml-buy-box sticky-top">
      
      <!-- Condición e Historial -->
      <div class="ml-buy-box-header">
        <span class="ml-condition-text">Nuevo | +100 vendidos</span>
      </div>

      <!-- Título de Producto -->
      <h1 class="ml-buy-box-title">{name}</h1>

      <!-- Sistema de Valoración (Estrellas) -->
      <div class="ml-rating-stars">
        <span class="ml-stars">★★★★★</span>
        <span class="ml-rating-count">(48 opiniones)</span>
      </div>

      <!-- Precio Principal Destacado -->
      <div class="ml-buy-box-price">
        <span class="ml-price-value">${price}</span>
        <span class="ml-installments-info">en 12x sin interés de ${(price/12)}</span>
      </div>

      <!-- Envío Destacado -->
      <div class="ml-shipping-box">
        <span class="ml-shipping-icon">🚚</span>
        <div class="ml-shipping-details">
          <span class="ml-shipping-headline">Envío gratis a todo el país</span>
          <span class="ml-shipping-eta">Llega mañana gratis</span>
        </div>
      </div>

      <!-- Stock Disponible -->
      <div class="ml-stock-status">
        <span class="ml-stock-headline">Stock disponible</span>
        <span class="ml-stock-qty">(Disponibles: {stock} unidades)</span>
      </div>

      <!-- Selector de Cantidad -->
      <div class="ml-qty-picker">
        <label for="detail-qty-select">Cantidad:</label>
        <select id="detail-qty-select" class="form-select ml-select-qty">
          <option value="1" selected>1 unidad</option>
          <option value="2">2 unidades</option>
          <option value="3">3 unidades</option>
          <option value="4">4 unidades</option>
        </select>
      </div>

      <!-- Botones de Acción Masiva -->
      <div class="ml-actions-panel">
        <button class="ml-btn-primary-action btn-buy-now" data-id="{id}">
          Comprar ahora
        </button>
        <button class="ml-btn-secondary-action btn-add-cart" data-id="{id}">
          Agregar al carrito
        </button>
      </div>

    </div>
  </aside>

</div>
```

---

## 5. Flujo de Carrito y Checkout Limpio

Un diseño de dos bloques optimizado para evitar distracciones en el cierre de la orden de compra.

### Estructura de Carrito y Resumen de Totales

```html
<div class="ml-cart-layout">
  
  <!-- Bloque Principal Izquierdo: Lista de Productos en Carrito -->
  <main class="ml-cart-items-panel">
    <h2 class="ml-cart-headline">Productos en tu carrito</h2>
    
    <div class="ml-cart-list" id="cart-items-container" role="list">
      <!-- Item de Carrito Individual (Generado dinámicamente) -->
      <div class="ml-cart-item" data-id="{id}" role="listitem">
        <img src="{imageUrl}" alt="{name}" class="ml-cart-item-thumb">
        
        <div class="ml-cart-item-details">
          <h3 class="ml-cart-item-title">{name}</h3>
          <div class="ml-cart-item-actions">
            <!-- Botón de Eliminar -->
            <button class="ml-btn-text-action btn-cart-action" data-action="delete" data-id="{id}">Eliminar</button>
            <span class="ml-divider">|</span>
            <a href="#" class="ml-text-link">Guardar para después</a>
          </div>
        </div>

        <!-- Controles de Cantidad Accesibles -->
        <div class="ml-cart-qty-controls">
          <button class="ml-qty-btn btn-cart-action" data-action="minus" data-id="{id}" aria-label="Disminuir">-</button>
          <span class="ml-qty-value">{quantity}</span>
          <button class="ml-qty-btn btn-cart-action" data-action="plus" data-id="{id}" aria-label="Aumentar">+</button>
        </div>

        <!-- Precio por Producto -->
        <div class="ml-cart-item-price">
          <span class="ml-item-price-val">${price * quantity}</span>
        </div>
      </div>
    </div>
  </main>

  <!-- Bloque de Resumen de Compra Derecho -->
  <aside class="ml-cart-summary-panel">
    <div class="ml-summary-card">
      <h3 class="ml-summary-title">Resumen de compra</h3>
      
      <div class="ml-summary-row">
        <span>Subtotal ({totalItems} productos)</span>
        <span id="cart-subtotal">$0</span>
      </div>
      <div class="ml-summary-row">
        <span>Envío</span>
        <span class="ml-free-shipping-text">Gratis</span>
      </div>
      
      <div class="ml-summary-divider"></div>
      
      <div class="ml-summary-row ml-row-total">
        <span>Total</span>
        <span id="cart-total">$0</span>
      </div>

      <!-- Formulario de Checkout (Datos de Envío y Pago) -->
      <form id="checkout-form" class="ml-checkout-form needs-validation" novalidate>
        <div class="ml-form-group">
          <label for="checkout-name">Nombre de quien recibe</label>
          <input type="text" id="checkout-name" required placeholder="Ej. Sebastian Dev">
        </div>

        <div class="ml-form-group">
          <label for="checkout-email">Correo de contacto</label>
          <input type="email" id="checkout-email" required placeholder="Ej. correo@ejemplo.com">
        </div>

        <div class="ml-form-group">
          <label for="checkout-phone">Teléfono de contacto</label>
          <input type="tel" id="checkout-phone" required placeholder="Ej. +56912345678">
        </div>

        <div class="ml-form-group">
          <label for="checkout-payment">Método de pago</label>
          <select id="checkout-payment" required>
            <option value="" disabled selected>Selecciona tu medio...</option>
            <option value="tarjeta">Tarjeta de Crédito / Débito (Webpay)</option>
            <option value="transferencia">Transferencia Electrónica</option>
          </select>
        </div>

        <button type="submit" class="ml-btn-checkout-submit" id="btn-submit-checkout" disabled>
          Confirmar Compra
        </button>
      </form>
    </div>
  </aside>

</div>
```

---

## 6. Estilos CSS Requeridos (Clases e Implementación)

Aplica estas clases en `frontend/css/index.css` para sobreescribir el modo oscuro previo y unificar la visual a Mercado Libre.

```css
/* Variables del Sistema de Diseño */
:root {
  --ml-yellow: #FFF159;
  --ml-bg: #EFEFEF;
  --ml-white: #FFFFFF;
  --ml-blue: #3483FA;
  --ml-light-blue: #E3EDFB;
  --ml-green: #00A650;
  --ml-dark: #333333;
  --ml-gray: #666666;
  --ml-border: #E6E6E6;
  --ml-font: 'Inter', -apple-system, sans-serif;
}

/* Ajustes Base */
body {
  background-color: var(--ml-bg);
  color: var(--ml-dark);
  font-family: var(--ml-font);
  margin: 0;
  padding: 0;
}

/* Header */
.ml-header {
  background-color: var(--ml-yellow);
  padding: 10px 0;
  border-bottom: 1px solid var(--ml-border);
}
.ml-header-row-top, .ml-header-row-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.ml-header-row-bottom {
  margin-bottom: 0;
}
.ml-search-bar {
  display: flex;
  background-color: var(--ml-white);
  border-radius: 2px;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.1);
  width: 50%;
  overflow: hidden;
}
.ml-search-bar input {
  border: none;
  padding: 10px 15px;
  width: 100%;
  font-size: 0.875rem;
  outline: none;
}
.ml-search-btn {
  background: none;
  border: none;
  padding: 0 15px;
  cursor: pointer;
}

/* Tarjetas de Producto */
.ml-product-card {
  background-color: var(--ml-white);
  border-radius: 4px;
  border: 1px solid var(--ml-border);
  overflow: hidden;
  transition: box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
}
.ml-product-card:hover {
  box-shadow: 0 7px 15px 0 rgba(0,0,0,0.1);
}
.ml-card-img-container {
  aspect-ratio: 1 / 1;
  background-color: var(--ml-white);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-bottom: 1px solid var(--ml-border);
}
.ml-card-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.ml-card-body {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.ml-free-shipping-text {
  color: var(--ml-green);
  font-weight: bold;
  font-size: 0.8125rem;
}
.ml-product-price {
  font-size: 1.5rem;
  color: var(--ml-dark);
  font-weight: 300;
  display: block;
}
.ml-product-installments {
  font-size: 0.75rem;
  color: var(--ml-green);
  display: block;
  margin-bottom: 8px;
}
.ml-product-title {
  font-size: 0.875rem;
  color: var(--ml-gray);
  line-height: 1.3;
  height: 2.6rem;
  overflow: hidden;
  margin-bottom: 15px;
}

/* Caja de Compra (Sticky Buy Box) */
.ml-buy-box {
  background-color: var(--ml-white);
  border: 1px solid var(--ml-border);
  border-radius: 8px;
  padding: 24px;
}
.ml-btn-primary-action {
  background-color: var(--ml-blue);
  color: var(--ml-white);
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
}
.ml-btn-primary-action:hover {
  background-color: #2968c8;
}
.ml-btn-secondary-action {
  background-color: var(--ml-light-blue);
  color: var(--ml-blue);
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
}
.ml-btn-secondary-action:hover {
  background-color: #d2e3f9;
}
```

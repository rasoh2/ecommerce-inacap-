# Especificación de Arquitectura: E-commerce Escalable

**Rol:** Lead Product Manager / Architect  
**Tecnologías:** JavaScript Vanilla (ES6+), Node.js, Express, MongoDB (Mongoose), Bootstrap 5  
**Proyecto:** E-commerce escalable alineado con los requisitos académicos de la Sumativa N°2 (INACAP Maipú)

---

## 1. Backlog de Tareas Técnicas Priorizadas

El siguiente backlog está organizado por orden de dependencia técnica y funcional. Cada fase debe completarse y probarse antes de pasar a la siguiente.

### Fase 1: Base de Datos y Backend Core (Fundación)
* [ ] **DB-01: Configuración de MongoDB y Mongoose:**
  - Inicializar la conexión a MongoDB Atlas/Local usando Mongoose.
  - Definir esquemas para `Product` (nombre, precio, cantidad/stock, imagen, descripción, categoría) y `Order` (cliente, email, telefono, items, total, fecha).
* [ ] **API-01: Servidor Node.js + Express:**
  - Inicializar proyecto (`npm init -y`) e instalar dependencias (`express`, `mongoose`, `dotenv`, `cors`).
  - Configurar servidor básico con variables de entorno (`.env`) y middleware para servir el frontend estático.
* [ ] **API-02: Endpoints de Productos:**
  - Crear endpoint `GET /api/products` para retornar el catálogo desde MongoDB.
  - Crear script de siembra (`seed.js`) para poblar la base de datos con al menos 6 productos iniciales.
* [ ] **API-03: Endpoint de Pedidos (Checkout):**
  - Crear endpoint `POST /api/orders` para recibir los datos de compra.
  - Implementar middleware de validación y sanitización en el backend para evitar inyecciones XSS y datos corruptos.

### Fase 2: Frontend Estructura y Estilos
* [ ] **FE-01: Maquetación Base (HTML5 + Bootstrap 5):**
  - Crear estructura semántica (`header`, `main`, `footer`, `section`).
  - Diseñar el catálogo de productos y el modal/sección lateral del carrito de compras.
  - Diseñar el formulario de checkout con al menos 3 campos obligatorios (Nombre, Email, Teléfono/Método de pago).
* [ ] **FE-02: Hoja de Estilos Personalizada:**
  - Crear `index.css` con estilos adicionales (micro-animaciones, efectos hover para tarjetas de productos, y estilos de validación visual).

### Fase 3: Lógica del Cliente (JS Vanilla)
* [ ] **JS-01: Módulo de Datos y Estado Global:**
  - Definir el estado local en memoria: `state = { products: [], cart: [] }`.
  - Crear funciones para recuperar productos desde el backend (`fetchProducts`).
* [ ] **JS-02: Operaciones del Carrito (Estructuras de Datos):**
  - Crear funciones puras para manipular el carrito en memoria: `agregarAlCarrito`, `eliminarDelCarrito`, `actualizarCantidad`.
  - Crear función modular para calcular totales de forma dinámica.
* [ ] **JS-03: Renderización Segura del DOM:**
  - Implementar `renderizarCatalogo` y `renderizarCarrito` utilizando `createElement` y `textContent` (prohibido `innerHTML` directo con datos de usuario).
  - Gestionar eventos del DOM (clicks en "Añadir", "Eliminar", cambios de cantidad) mediante delegación de eventos.

### Fase 4: Validación, Seguridad y Envío
* [ ] **SEC-01: Validación Avanzada de Formulario:**
  - Validar en tiempo real (eventos `input`/`blur`) y al hacer submit.
  - Aplicar expresiones regulares para validar Email y Teléfono.
  - Implementar sanitización de entradas en el cliente (escapado de caracteres especiales).
* [ ] **SEC-02: Integración Cliente-Servidor (Flujo de Compra):**
  - Crear función `enviarPedido` que realice el `POST /api/orders` con los datos sanitizados del formulario y los ítems del carrito.
  - Mostrar feedback visual de éxito o error al usuario manipulando el DOM de forma segura.

### Fase 5: Documentación de IA y Despliegue
* [ ] **DOC-01: Creación del archivo `USO_IA.md`:**
  - Detallar los prompts específicos utilizados (ej. generación de regex de validación, refactorización de funciones del DOM).
  - Documentar el código final que fue modificado gracias a las sugerencias de la IA.

---

## 2. Mapeo Explícito de la Rúbrica de la Prueba

| Criterio de la Rúbrica | Requisito Académico | Implementación Técnica en este E-commerce | Archivos Involucrados |
| :--- | :--- | :--- | :--- |
| **1. Validación de formularios y seguridad** | Formulario con 3 campos mínimos, regex, sanitización, prevención de XSS. | Formularios en frontend con validaciones regex estrictas (Email/Teléfono). Sanitización de entrada del cliente antes de enviar al backend. Uso de `express-validator` o sanitización manual de strings en backend. | `frontend/js/validation.js`<br>`backend/middlewares/sanitize.js` |
| **2. Organización de datos con Arreglos y Objetos** | Uso de arreglos y objetos para almacenar, buscar y filtrar datos. | Estado global del cliente (`cart = []` y `products = []`). Operaciones de filtrado y mapeo (`map`, `filter`, `reduce`) para el renderizado y cálculo de totales. | `frontend/js/cart.js`<br>`frontend/js/app.js` |
| **3. Manipulación del DOM & eventos** | DOM modificado fluidamente, renderización eficiente, eventos bien gestionados. | Funciones de renderizado dinámico al cargar productos o alterar el carrito. Uso de delegación de eventos (`document.addEventListener('click', ...)`) para elementos dinámicos. | `frontend/js/dom.js`<br>`frontend/js/app.js` |
| **4. Estructura del código y funciones reutilizables** | Código modular, funciones pequeñas, nombres semánticos, sin repetición. | Separación en módulos JS ES6 (`cart.js`, `dom.js`, `api.js`, `validation.js`). Nombres autodescriptivos como `calculateCartTotal`, `validateEmailFormat`. | `frontend/js/` (Estructura modular) |
| **5. Apoyo de IA & Buenas Prácticas** | Evidencia clara del uso de IA, prompts e informe detallado. | Creación del archivo `docs/USO_IA.md` documentando prompts sobre expresiones regulares, refactorización y prevención XSS. Comentarios `// Asistido por IA` en el código. | `docs/USO_IA.md`<br>Código fuente indexado |
| **6. Creatividad, UI/UX y funcionalidad adicional** | Interfaz atractiva, responsive, aporta valor extra. | Integración de Bootstrap 5. Diseños adaptativos para dispositivos móviles, animaciones al añadir items, integración real con base de datos MongoDB en lugar de localStorage estático. | `frontend/index.html`<br>`frontend/css/index.css` |

---

## 3. Criterios de Aceptación Estrictos para el Flujo de Datos

### A. Obtención del Catálogo de Productos
* **Dirección:** Servidor (MongoDB) $\rightarrow$ Cliente (DOM)
* **API Endpoint:** `GET /api/products`
* **Esquema de Respuesta (JSON):**
  ```json
  [
    {
      "_id": "60d5ec49f83f2a1b8c8b4567",
      "name": "Smartphone Pro Max",
      "price": 899990,
      "stock": 15,
      "description": "Pantalla OLED 6.7 pulgadas, 256GB almacenamiento.",
      "category": "Tecnología",
      "imageUrl": "https://example.com/images/phone.jpg"
    }
  ]
  ```
* **Criterios de Aceptación:**
  1. Si la base de datos está vacía, el endpoint debe retornar un arreglo vacío `[]` con código de estado `200 OK`.
  2. Si hay un fallo de conexión a la base de datos, debe retornar `500 Internal Server Error` con un JSON seguro que no revele detalles internos del servidor.
  3. El cliente debe mostrar un indicador de carga ("Spinner") en el DOM antes de que finalice la petición y un mensaje descriptivo en caso de error de red.

### B. Gestión del Carrito (Cliente)
* **Dirección:** Memoria del Navegador $\rightarrow$ Interfaz del Usuario
* **Criterios de Aceptación:**
  1. **Añadir:** Al pulsar "Añadir al carrito", si el producto no existe en el carrito se agrega con cantidad `1`. Si ya existe, se incrementa su cantidad si no supera el stock disponible.
  2. **Actualizar:** Los cambios de cantidad mediante selectores numéricos deben recalcular los totales al instante.
  3. **Seguridad (No Inyección HTML):** Todos los campos renderizados en las filas del carrito (nombre, subtotal) deben insertarse usando `textContent` para neutralizar inyecciones de código.

### C. Procesamiento de la Orden de Compra (Checkout)
* **Dirección:** Cliente (Formulario + Carrito) $\rightarrow$ Servidor (Validación $\rightarrow$ MongoDB)
* **API Endpoint:** `POST /api/orders`
* **Esquema de Petición (JSON):**
  ```json
  {
    "customer": {
      "name": "Juan Pérez",
      "email": "juan.perez@example.com",
      "phone": "+56912345678"
    },
    "items": [
      {
        "productId": "60d5ec49f83f2a1b8c8b4567",
        "quantity": 2
      }
    ]
  }
  ```
* **Criterios de Aceptación (Validación y Seguridad):**
  1. **Validación del Cliente:** El cliente debe comprobar que:
     - El nombre no esté vacío, contenga solo letras y espacios, y tenga una longitud mínima de 3 caracteres.
     - El email cumpla con la regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
     - El teléfono cumpla con la regex `/^\+?569?[0-9]{8}$/` (formato chileno válido).
     - El carrito de compras contenga al menos un `item` con cantidad mayor a cero.
  2. **Validación del Servidor:** El backend debe re-validar todos los campos descritos en el punto anterior. Si la validación falla, debe responder con `400 Bad Request` y un arreglo de errores detallados.
  3. **Sanitización del Servidor:** Todos los datos de tipo texto (`name`, `email`, `phone`) deben ser sanitizados (remoción de etiquetas `<script>` y conversión de caracteres especiales como `<`, `>`, `&`, `"`, `'` a entidades HTML equivalentes) antes de guardarse en MongoDB.
  4. **Persistencia y Confirmación:** Tras guardar exitosamente en la colección `orders`, el servidor debe retornar `21 Created` con el ID de la orden generada. El cliente deberá vaciar el carrito en memoria, limpiar el formulario y mostrar un mensaje de éxito con el número de orden correspondiente.

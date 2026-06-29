# CyberShop - E-commerce Premium (Mercado Libre Style)

Este proyecto corresponde a la **Evaluación Sumativa N°2** de la asignatura **Desarrollo Front End** en **INACAP Maipú** (Ingeniería Informática). Consiste en una aplicación web interactiva de e-commerce que integra una API REST backend en Node.js/Express con una base de datos MongoDB, y una interfaz de usuario frontend de alto rendimiento construida con JavaScript Vanilla puro y Bootstrap 5.

---

## 📂 Estructura del Proyecto

* **`backend/`**: Servidor Express, modelos Mongoose, controladores, rutas, middlewares de validación/sanitización y script de carga de base de datos.
* **`frontend/`**: Archivos estáticos de la interfaz de usuario (HTML, CSS con tema claro Mercado Libre, imágenes y lógica de aplicación en Vanilla JS).
* **`docs/`**: Documentos de diseño técnico, auditorías de código de Gilfoyle, planes de trabajo y listas de comprobación de QA.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend**: HTML5, CSS3, JavaScript Vanilla (ES6+), Bootstrap 5 (offcanvas, modal y layouts).
* **Backend**: Node.js, Express.js.
* **Base de Datos**: MongoDB, Mongoose ODM.
* **Seguridad y Validación**: Sanitización recursiva inmutable contra inyecciones NoSQL y Prototype Pollution.

---

## 📋 Requisitos Previos

* **Node.js** (versión 16 o superior).
* **MongoDB** instalado y corriendo localmente (puerto predeterminado `27017`). Funciona tanto en instalaciones Standalone (con rollback manual automatizado) como en Replica Sets (con transacciones ACID nativas).

---

## 🚀 Configuración e Instalación

### 1. Clonar el repositorio y configurar variables de entorno
Ubícate en la carpeta `backend/` y crea un archivo `.env` siguiendo esta estructura básica:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cybershop
NODE_ENV=development
```

### 2. Instalar dependencias del Servidor
Desde la terminal, navega a la carpeta `backend/` y ejecuta:
```bash
cd backend
npm install
```

### 3. Cargar el Catálogo Inicial (Seeding)
Para poblar la base de datos de MongoDB con los productos iniciales (Smartphones, Auriculares, Tecnología, etc.), ejecuta el script de siembra en la misma carpeta `backend/`:
```bash
npm run seed
```

### 4. Iniciar el Servidor de Desarrollo
Para levantar el servidor HTTP local:
```bash
npm start
```

El servidor web de Express se iniciará en `http://localhost:5000` y servirá de manera automática el frontend desde la carpeta adyacente. Abre tu navegador e ingresa a [http://localhost:5000](http://localhost:5000) para ver la aplicación web en funcionamiento.

---

## ✨ Características Técnicas Destacadas

### 1. Diseño y Usabilidad Estilo Mercado Libre
* **Header de Doble Fila:** Incorpora logo, buscador dinámico en tiempo real y selector interactivo de comuna (ubicación) que persiste mediante `localStorage`.
* **Diseño Limpio y Claro:** Paleta de colores amarilla y gris claro (`#EEEEEE`) optimizada para una alta conversión visual.
* **Grilla de Catálogo:** Tarjetas blancas con imágenes en contenedores cuadrados perfectos (`aspect-ratio: 1/1`), precios grandes visibles y la etiqueta verde destacado de "Envío gratis".

### 2. Gestión de Memoria y Rendimiento DOM
* **Delegación de Eventos Pura:** El carrito de compras ([app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/frontend/js/app.js)) utiliza un único event listener en el nodo estático parent `#cart-items-container` resolviendo las acciones mediante `e.target.closest('.cart-btn-action')`. Esto previene referencias huérfanas y fugas de memoria en el Heap cuando se limpia y redibuja la lista.
* **Transiciones Responsivas sin Clonación:** Al alternar vistas móviles, el nodo completo del carrito se mueve físicamente mediante `appendChild` a través de los eventos de Bootstrap Offcanvas (`show.bs.offcanvas`/`hide.bs.offcanvas`), conservando los listeners registrados intactos y evitando inflar el árbol DOM.
* **Coerción de Tipo Segura en Storage:** Los IDs del carrito de storage son normalizados como cadenas (`String(item.productId)`) al deserializar, permitiendo comparaciones estrictas seguras (`===`) en memoria.

### 3. Seguridad y Consistencia de Persistencia
* **Sanitización Inmutable NoSQL:** Un middleware Express clona profundamente el payload (`req.body`, `req.query`, etc.) y barre de manera recursiva cualquier clave que coincida con operadores MongoDB (`/^\$/`), neutralizando inyecciones lógicas sin alterar la estructura para registros de logs.
* **Optimización Atómica de Stock:** Las reducciones de stock se ejecutan mediante un único comando `findOneAndUpdate({ _id, stock: { $gte: quantity } }, { $inc: { stock: -quantity } })`. Si MongoDB corre de manera Standalone local, el servicio ejecuta automáticamente un rollback manual a nivel de aplicación en caso de fallos.
* **Manejador de Puertos y Reintentos:** Captura excepciones de red (`EADDRINUSE`) y maneja la reconexión asíncrona robusta con MongoDB cada 5 segundos si el servicio se encuentra caído.

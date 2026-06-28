# Lista de Comprobación de QA: Validación de Auditoría Técnica

Este documento presenta la lista de comprobación y la metodología de pruebas para verificar las refactorizaciones realizadas en el backend (seguridad y base de datos) y en el frontend (gestión optimizada de eventos del carrito) de la aplicación **CyberShop**.

---

## 1. Módulo de Seguridad y Tolerancia a Fallos (Backend)

### A. Mitigación de Inyección NoSQL
* **Código a Validar:** Middleware de sanitización manual en [backend/app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/backend/app.js#L23-L40).
* **Objetivo de QA:** Comprobar que cualquier clave en los objetos `body`, `query` o `params` que empiece con el caracter especial `$` es eliminada automáticamente del flujo de datos antes de que sea procesada por MongoDB.
* **Pasos de Prueba:**
  1. Utilizar un cliente HTTP (como Curl o Postman) para simular un envío malicioso en el endpoint de checkout `POST /api/orders`.
  2. Enviar un payload que contenga una clave del tipo MongoDB Operator en los datos del cliente:
     ```json
     {
       "customer": {
         "name": "Atacante NoSQL",
         "email": "malicious@exploit.com",
         "phone": "+56999999999"
       },
       "items": [
         {
           "productId": { "$ne": null },
           "quantity": 1
         }
       ]
     }
     ```
  3. **Criterio de Aceptación:** El servidor debe retornar un error `400 Bad Request` indicando que los datos de entrada son inválidos o faltantes (debido a que el middleware sanitizó y eliminó la propiedad con `$ne`), o procesar correctamente el resto del payload sin que se ejecute la inyección lógica en la base de datos.

### B. Tolerancia a Fallos de Conexión a Base de Datos
* **Código a Validar:** Método asíncrono recursivo `connectWithRetry` en [backend/config/db.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/backend/config/db.js#L3-L20).
* **Objetivo de QA:** Comprobar que si MongoDB no se encuentra disponible al inicializar la aplicación, el servidor no se caiga abruptamente (`process.exit`), sino que permanezca en ejecución intentando conectarse periódicamente cada 5 segundos.
* **Pasos de Prueba:**
  1. Detener temporalmente el servicio local de MongoDB (ej. `net stop MongoDB` o deteniendo el contenedor de docker).
  2. Inicializar el servidor usando `npm run start` or `node app.js`.
  3. **Criterio de Aceptación:** La consola del backend debe registrar de manera persistente mensajes similares a:
     ```text
     Intentando conectar a MongoDB...
     Error de conexión a MongoDB: connect ECONNREFUSED 127.0.0.1:27017. Reintentando en 5 segundos...
     ```
  4. Iniciar el servicio de MongoDB. El servidor debe conectarse exitosamente sin necesidad de reiniciarlo de forma manual.

---

## 2. Optimización e Indexación de Base de Datos

### A. Indexación de Catálogo (IXSCAN)
* **Código a Validar:** Índices definidos en el esquema Mongoose [backend/models/Product.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/backend/models/Product.js#L31-L38).
* **Objetivo de QA:** Comprobar que las consultas filtradas por la propiedad `category` realicen un escaneo de índice (`IXSCAN`) en vez de un escaneo completo de colección (`COLLSCAN`).
* **Pasos de Prueba:**
  1. Conectarse a la consola interactiva de MongoDB (`mongosh`).
  2. Ejecutar la consulta del catálogo explicando su plan de ejecución:
     ```javascript
     db.products.find({ category: "Tecnología" }).explain("executionStats")
     ```
  3. **Criterio de Aceptación:** La propiedad `stage` dentro del objeto `winningPlan` debe ser de tipo `IXSCAN` y referenciar al índice `category_1`. El número de documentos examinados (`docsExamined`) debe coincidir exactamente con el número de resultados retornados, asegurando búsquedas en complejidad $O(log\ N)$ en lugar de $O(N)$.

### B. Búsqueda de Texto Completo
* **Objetivo de QA:** Validar que el índice compuesto de texto cubra correctamente búsquedas de catálogo en los campos `name` y `description`.
* **Pasos de Prueba:**
  1. Ejecutar en consola `db.products.find({ $text: { $search: "OLED" } }).explain("executionStats")`.
  2. **Criterio de Aceptación:** El plan de ejecución debe reflejar un `TEXT_MATCH` utilizando la clave compuesta del índice de texto definido en el modelo.

---

## 3. Refactorización e Interacciones del Carrito (Frontend)

### A. Gestión de Eventos sin Fugas de Memoria
* **Código a Validar:** Generación pura del DOM en [updateCartDOM()](file:///c:/Users/Sebastian/Desktop/Ecommerse/frontend/js/app.js#L304-L401) y delegación en [bindCartItemsListener()](file:///c:/Users/Sebastian/Desktop/Ecommerse/frontend/js/app.js#L678-L685).
* **Objetivo de QA:** Asegurar que los botones `btnMinus`, `btnPlus` y `btnDelete` no aten listeners anónimos reiterativamente y que el recolector de basura (Garbage Collector) pueda liberar la memoria al limpiar `#cart-items-container`.
* **Pasos de Prueba:**
  1. Abrir la herramienta de desarrollo en Chrome/Firefox (F12) e ir a la pestaña **Performance Monitor** / **Memory**.
  2. Añadir y quitar productos del carrito unas 30 veces seguidas.
  3. Forzar la recolección de basura (clic en el icono del bote de basura en las herramientas de desarrollo).
  4. **Criterio de Aceptación:** La curva de memoria del Heap de JavaScript debe regresar a su estado base plano, demostrando que no existen acumulaciones de nodos huérfanos por listeners atrapados en el Heap.

### B. Pruebas Funcionales de Extremo a Extremo
* **Objetivo de QA:** Validar el comportamiento de los botones delegados y la sincronización con el estado global e IDs (tanto numéricos como de MongoDB).
* **Pasos de Prueba:**
  1. **Añadir al Carrito (Agrupación):** Hacer clic en "Añadir" en un producto. El carrito debe mostrar `Cantidad: 1`. Volver a hacer clic en "Añadir" en el mismo producto. El elemento debe permanecer en una única fila y su cantidad debe actualizarse a `2`.
  2. **Compatibilidad de IDs (Type Mismatch Fix):** Abrir la consola web y configurar un carrito artificial en localStorage utilizando IDs de tipo numérico:
     ```javascript
     localStorage.setItem('cart', JSON.stringify([{ productId: 1, name: 'Producto Mock', price: 10000, quantity: 1, maxStock: 5 }]));
     ```
     Recargar la página. Presionar los botones `+`, `-` y `🗑️`.
     * **Criterio de Aceptación:** El botón `+` debe aumentar la cantidad a 2, el botón `-` disminuirla a 1 y finalmente eliminar el ítem, sin generar errores de tipo en la consola ni duplicar la fila.
  3. **Flujo de Offcanvas Móvil:** Achicar la pantalla a modo responsive. Presionar el botón "🛒 Carrito".
     * **Criterio de Aceptación:** El panel Offcanvas debe desplegarse mostrando los productos correspondientes. Los botones de cantidad deben operar normalmente y el contenido no debe haberse clonado (debe moverse el elemento original preserving listeners).
  4. **Confirmación de Compra:** Validar el formulario de checkout con datos correctos y presionar "Confirmar Compra".
     * **Criterio de Aceptación:** Se debe inyectar la pantalla de éxito, mostrar el ID de la orden provisto por MongoDB, y tras hacer clic en "Seguir Comprando", el carrito debe resetearse correctamente a `$0` y permitir volver a operar con normalidad.

---

## 4. Matriz de Control de Calidad (Checklist Final)

| Componente | Refactorización Realizada | Prueba Crítica | Estado |
| :--- | :--- | :--- | :--- |
| **Backend** | Sanitización manual NoSQL | Envío de query con `$ne` o `$gt` es removido y no altera lógica | `[ ]` Pendiente de Ejecución |
| **Backend** | Tolerancia de Conexión a DB | Servidor de Express no se cae si MongoDB no responde; reintenta | `[ ]` Pendiente de Ejecución |
| **Database** | Índice en campo `category` | Ejecución de consulta utiliza `IXSCAN` en lugar de `COLLSCAN` | `[ ]` Pendiente de Ejecución |
| **Database** | Índice compuesto de Texto | Permite búsqueda ágil sin escanear todos los registros | `[ ]` Pendiente de Ejecución |
| **Frontend** | Atributos de Datos en Botones | Botones dentro de `updateCartDOM` no añaden listeners inline | `[ ]` Pendiente de Ejecución |
| **Frontend** | Delegación de Eventos | Un único listener atrapa clics en `#cart-items-container` | `[ ]` Pendiente de Ejecución |
| **Frontend** | Prevención de Enlaces Extra | Flag `listenersAttached` previene duplicados en carga | `[ ]` Pendiente de Ejecución |
| **Frontend** | Vista Responsiva Móvil | Uso de `appendChild` tras show/hide en Offcanvas móvil sin cloning | `[ ]` Pendiente de Ejecución |
| **Frontend** | Compatibilidad de Tipos de ID | Soporta IDs de tipo `String` y `Number` en búsquedas (`==` / `!=`) | `[ ]` Pendiente de Ejecución |

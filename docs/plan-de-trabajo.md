# Plan de Trabajo de Ingeniería: Resolución de Hallazgos Técnicos (CyberShop)

Este plan de trabajo detalla las tareas, hitos y estrategias de Aseguramiento de la Calidad (QA) diseñadas para solventar de forma definitiva los defectos detectados en la auditoría línea por línea (`docs/gilfoyle-line-by-line-audit.md`). 

---

## 1. Hitos del Backend: Servidor y Seguridad

Este hito organiza cronológicamente las tareas de refactorización del servidor Node.js/Express, middlewares de seguridad, modelos de datos de Mongoose y la capa de servicios.

### Tarea B1: Configuración de Seguridad en CORS y Manejo de Colisión de Puertos
* **Archivos Afectados:** [backend/app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/backend/app.js)
* **Descripción:** Restringir los orígenes permitidos en CORS para evitar que cualquier sitio web consuma la API, e implementar un manejador de excepciones de red en la inicialización del servidor http.
* **Criterios de Aceptación Técnicos:**
  * La llamada a `cors()` debe incluir una configuración que restrinja el origen (`origin`) al dominio de producción del e-commerce y a `http://localhost:5000` (desarrollo local).
  * El método `app.listen` o el servidor HTTP de Node debe capturar el evento de error `'error'` (como `EADDRINUSE`). Si el puerto está ocupado, debe imprimir un mensaje explicativo y abortar de manera controlada con `process.exit(1)` en lugar de lanzar una excepción fatal no controlada.

### Tarea B2: Sanitización de NoSQL Inmutable (Deep Copy)
* **Archivos Afectados:** [backend/app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/backend/app.js)
* **Descripción:** Modificar el middleware de sanitización de consultas NoSQL para que no mute destructivamente `req.body`, `req.query` o `req.params`.
* **Criterios de Aceptación Técnicos:**
  * La función recursiva `sanitize` no debe realizar operaciones `delete` directas sobre los argumentos de entrada.
  * Debe generar un clon profundo (deep clone) de los objetos sanitizados (ej. con `structuredClone` o una función recursiva pura) y reemplazar los objetos del request (`req.body`, etc.) con sus versiones inmutables limpias.

### Tarea B3: Robustecimiento de Validaciones y Límites de Entrada (Regex y Desbordamiento)
* **Archivos Afectados:** [backend/middlewares/validator.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/backend/middlewares/validator.js)
* **Descripción:** Corregir la expresión regular de validación de teléfonos celulares de Chile e imponer límites máximos en la cantidad de productos para evitar desbordamientos de enteros (Integer Overflow).
* **Criterios de Aceptación Técnicos:**
  * Modificar `phoneRegex` para que valide estrictamente que un número empiece con `9` y tenga 9 dígitos (ej. `912345678`), o empiece con `+569` / `569` y tenga 11/12 caracteres numéricos en total. No debe aceptar números genéricos de 8 dígitos (como `11111111`).
  * En la validación de `items`, añadir una regla que impida que `item.quantity` supere un valor máximo de unidades razonable (ej. un máximo de 100 unidades por artículo) para evitar desbordamientos aritméticos en los cálculos de precios acumulados.
  * Encapsular e importar las expresiones regulares de validación para evitar duplicidad de código.

### Tarea B4: Optimización de Consultas a Base de Datos en Checkout
* **Archivos Afectados:** [backend/services/orderService.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/backend/services/orderService.js)
* **Descripción:** Eliminar la doble consulta a base de datos por artículo (`findById` + `findOneAndUpdate`) en el bucle del checkout para reducir la latencia de red.
* **Criterios de Aceptación Técnicos:**
  * Realizar directamente la actualización atómica `findOneAndUpdate` para descontar el stock.
  * Si el resultado retornado es `null`, realizar la verificación de existencia (`findById`) y lanzar el error apropiado de "Stock insuficiente" o "Producto no encontrado" de manera reactiva, reduciendo las llamadas a BD a la mitad en la ruta feliz.

---

## 2. Hitos del Frontend: Interfaz y Estado en JS Vanilla

Este hito define la secuencia de construcción y refactorización de la lógica del cliente web utilizando estándares modernos de JS Vanilla.

### Tarea F1: Deserialización Segura de Datos en Storage
* **Archivos Afectados:** [frontend/js/app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/frontend/js/app.js)
* **Descripción:** Asegurar que la carga inicial del carrito desde `localStorage` sea tolerante a datos manipulados o estructuras corruptas (no-arrays).
* **Criterios de Aceptación Técnicos:**
  * La función `loadCartFromStorage()` debe comprobar que el objeto deserializado mediante `JSON.parse` sea un array usando `Array.isArray()`.
  * Si no es un array (ej. si contiene `{}` o un valor primitivo), debe ignorar la conversión y asignar un arreglo vacío `[]` al estado del carrito de compras.

### Tarea F2: Consolidación de Regex y DRY
* **Archivos Afectados:** [frontend/js/app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/frontend/js/app.js)
* **Descripción:** Eliminar expresiones regulares de validación duplicadas (correo y teléfono) en el código del cliente.
* **Criterios de Aceptación Técnicos:**
  * Definir las expresiones regulares como constantes globales de configuración en la parte superior del módulo de JS o importarlas de un archivo de configuración común.
  * Reutilizar las constantes `EMAIL_REGEX` y `PHONE_REGEX` tanto en `validateField()` como en `validateCheckoutForm()`.

### Tarea F3: Prevención de Checkout Duplicado (Doble Clic)
* **Archivos Afectados:** [frontend/js/app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/frontend/js/app.js)
* **Descripción:** Evitar que peticiones concurrentes de compra idénticas sean enviadas al backend debido a doble clics del usuario en el botón de confirmación.
* **Criterios de Aceptación Técnicos:**
  * Al hacer clic en el botón de submit o iniciar `processCheckout()`, deshabilitar inmediatamente el botón físico de compra (`btnSubmit.disabled = true`).
  * Restaurar la interactividad del botón de submit únicamente si la petición del backend falla (en el bloque `catch`). Si tiene éxito, la interfaz transicionará a la vista de confirmación y el formulario se reseteará, previniendo nuevos clics.

---

## 3. Hitos de Aseguramiento de la Calidad (QA)

Estrategia de verificación rigurosa de extremo a extremo que debe ejecutarse tras culminar las tareas de desarrollo.

### A. Flujo Feliz (Checkout Completo)
* **Objetivo:** Comprobar la compra exitosa de múltiples productos e inyección dinámica.
* **Procedimiento:**
  1. Limpiar el `localStorage` del navegador.
  2. Añadir 2 unidades de "Smartphone Pro Max" y 1 unidad de "Auriculares ANC Premium" al carrito.
  3. Llenar el formulario con datos válidos de contacto.
  4. Presionar "Confirmar Compra".
* **Resultado Esperado:** El carrito transiciona a la pantalla de éxito mostrando el ID de orden provisto por MongoDB, y el stock de los productos se descuenta adecuadamente en la base de datos local.

### B. Pruebas de Borde y Explotación NoSQL
* **Caso de Prueba 1: Prototype Pollution en Express**
  * *Método:* Enviar un payload mediante POST que incluya `{"__proto__": {"$pollute": "value"}}` al servidor.
  * *Resultado Esperado:* El servidor responde con `400 Bad Request` o procesa la orden ignorando/sanitizando el prototipo. El hilo de Node permanece en ejecución y no se contamina el prototipo global de objetos.
* **Caso de Prueba 2: Inyección de Cantidad Excesiva**
  * *Método:* Intentar enviar `"quantity": 99999` en el JSON de checkout.
  * *Resultado Esperado:* El backend rechaza la petición con código `400 Bad Request` antes de procesar el stock, evitando desbordamientos de enteros.
* **Caso de Prueba 3: Validación Estricta de Teléfono Chileno**
  * *Método:* Enviar los números `11111111` (8 dígitos), `+5612345678` (formato incompleto) y `912345678` (formato correcto).
  * *Resultado Esperado:* Solo el formato correcto de 9 u 11 dígitos móviles es aceptado por el cliente y el servidor. El resto es rechazado con alertas visuales de validación.

---

## 4. Matriz de Dependencias y Estado de Tareas (Kanban)

La siguiente matriz define el orden de ejecución para evitar cuellos de botella:
* **F1 (Storage)** y **F2 (Regex DRY)** están desbloqueadas y se pueden desarrollar inmediatamente.
* **F3 (Doble Clic)** requiere que la API del Backend esté lista para recibir peticiones y procesar transacciones.
* **QA (Pruebas NoSQL / Cantidades)** requiere que el middleware de sanitización (B2) y las validaciones del backend (B3) estén 100% integrados.

### Tablero de Control de Proyecto (Sprint Backlog)

```mermaid
kanban
  Todo
    [B1] Restricción de CORS y control de puertos
    [B2] Sanitización inmutable de consultas
    [B3] Validaciones rigurosas (Teléfono/Límites)
    [B4] Optimización de consultas DB
    [F1] Deserialización segura de storage
    [F2] Consolidación de expresiones regulares
    [F3] Debounce / Desactivar botón en checkout
    [QA] Pruebas de explotación e inyecciones
```

#### Estado de las Tareas del Proyecto

* **POR HACER (`[ ]`):**
  * `[x]` **B1:** Configurar origen de CORS y controlar error `EADDRINUSE`.
  * `[x]` **B2:** Refactorizar middleware recursivo para retornar clones profundos sanitizados.
  * `[x]` **B3:** Corregir regex de teléfonos y restringir stock máximo por item en el backend.
  * `[x]` **B4:** Unificar llamadas a la base de datos en `createOrder` (eliminar consultas dobles en la ruta feliz).
  * `[x]` **F1:** Implementar validación `Array.isArray()` en la deserialización de `localStorage`.
  * `[x]` **F2:** Eliminar expresiones regulares duplicadas y consolidarlas en constantes globales de configuración.
  * `[x]` **F3:** Desactivar de forma inmediata el botón submit del checkout al procesar la compra.
  * `[x]` **QA:** Ejecutar casos de prueba felices, desbordamientos de cantidades y ataques de inyección de prototipos.

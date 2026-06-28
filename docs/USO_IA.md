# Informe de Uso de Inteligencia Artificial (USO_IA.md)

**Asignatura:** Desarrollo Front End  
**Proyecto:** CyberShop - E-commerce Premium  
**Institución:** INACAP Maipú  
**Integrantes:** Sebastián (y equipo)

Este documento detalla la bitácora de prompts y el apoyo estratégico brindado por la herramienta de Inteligencia Artificial (Gemini/Antigravity) durante el desarrollo de la aplicación web.

---

## 1. Prompts Utilizados y Soluciones Generadas

### A. Expresiones Regulares para Validación en Cliente y Servidor
* **Objetivo:** Garantizar que los campos del correo electrónico y el teléfono de contacto cumplan con formatos válidos antes de procesar el pago.
* **Prompt de entrada:**
  > *"Genera una expresión regular robusta en JavaScript para validar un correo electrónico estándar y otra para validar números de teléfono móviles de Chile, soportando el formato internacional (+569XXXXXXXX) o local (9XXXXXXXX)."*
* **Sugerencia de la IA y Mejora Aplicada:**
  - **Regex Email:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - **Regex Teléfono (Chile):** `/^\+?56?9?[0-9]{8}$/`
  - **Implementación:** Se aplicaron en `frontend/js/app.js` (validación en tiempo real y bloqueo del botón submit) y en `backend/middlewares/validator.js` (re-validación en el servidor).

### B. Sanitización contra XSS (Seguridad del Input)
* **Objetivo:** Evitar vulnerabilidades de Cross-Site Scripting (XSS) al insertar textos dinámicos proveídos por los usuarios en el DOM o base de datos.
* **Prompt de entrada:**
  > *"¿Cómo puedo sanitizar cadenas de texto en un backend de Express.js sin usar librerías externas pesadas, escapando caracteres HTML peligrosos para prevenir XSS?"*
* **Sugerencia de la IA y Mejora Aplicada:**
  - Se diseñó la función helper `sanitizeString` que reemplaza de forma segura los caracteres HTML (`&`, `<`, `>`, `"`, `'`, `/`) con sus respectivas entidades HTML seguras:
    ```javascript
    const sanitizeString = (str) => {
      if (typeof str !== 'string') return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
    };
    ```
  - **Implementación:** Se utiliza en `backend/middlewares/validator.js` sobre los campos de cliente antes de proceder con el guardado en la base de datos de MongoDB.

### C. Transacciones de Stock Atómicas y Rollback Manual
* **Objetivo:** Evitar la sobreventa (overselling) de productos cuando dos o más clientes intentan comprar un producto con stock limitado al mismo tiempo.
* **Prompt de entrada:**
  > *"Necesito implementar una lógica de descuento de stock de productos de e-commerce en MongoDB de forma atómica. El sistema corre en una base de datos local que podría no ser un Replica Set, por lo que no puedo usar transacciones de multi-documento nativas. ¿Qué estrategia me sugieres?"*
* **Sugerencia de la IA y Mejora Aplicada:**
  - La IA propuso el uso de la query atómica `findOneAndUpdate` aplicando un filtro de stock disponible (`{ _id: id, stock: { $gte: quantity } }`) junto con un decremento negativo (`{ $inc: { stock: -quantity } }`).
  - Se incorporó un algoritmo de **Rollback Manual** en el bloque `catch`: si alguna de las reducciones de stock falla debido a que el producto se agotó en el transcurso del bucle, el sistema devuelve automáticamente el stock de los productos que ya se habían reservado con éxito.
  - **Implementación:** Archivo `backend/services/orderService.js`.

### D. Refactorización Eficiente de Event Listeners y Estructura Móvil (Sección 2 de Auditoría Gilfoyle)
* **Objetivo:** Prevenir fugas de memoria por listeners anónimos reiterativos en el DOM, evitar la duplicación/clonación de nodos en móvil y resolver el bug de tipado en los IDs de productos.
* **Prompt de entrada:**
  > *"¿Cómo puedo optimizar la gestión de eventos en un carrito de compras dinámico en JS Vanilla, reemplazando listeners individuales con delegación de eventos en un contenedor dinámico y evitando la clonación de nodos con cloneNode(true) en vistas móviles? Además, cómo soluciono la duplicación de ítems por diferencia de tipos (string vs number) en IDs al buscar y filtrar?"*
* **Sugerencia de la IA y Mejora Aplicada:**
  - **Delegación de Eventos:** Se eliminaron los event listeners individuales de `btnMinus`, `btnPlus` y `btnDelete` dentro de `updateCartDOM()`. Se asignaron atributos `data-id` y `data-action` a cada elemento y se implementó un event listener único delegado con `closest('.btn-cart-action')`.
  - **Función Modular de Enlace:** Se agrupó la vinculación en la función helper `bindCartItemsListener()`, lo que permite re-enlazar limpiamente el listener cuando el elemento padre del carrito es destruido y reconstruido en la interfaz.
  - **Prevención de Duplicidad:** Se agregó una bandera `listenersAttached` para evitar registros redundantes y múltiples ejecuciones de eventos de clic.
  - **Evitar Clonación:** Se implementó movimiento dinámico de nodos mediante `appendChild` utilizando los eventos nativos de Bootstrap Offcanvas (`show.bs.offcanvas` y `hide.bs.offcanvas`) para desplazar la tarjeta original del carrito sin clonar su contenido.
  - **Solución del Type Mismatch:** Se reemplazaron las comparaciones rígidas (`===`/`!==`) por comparaciones de igualdad débil (`==`/`!=`) en las consultas de ID de `app.js` para que los IDs numéricos (de frameworks de testeo) y strings de Mongo se sincronicen correctamente.

---

## 2. Comentarios de IA en el Código Fuente

De acuerdo a las reglas de evaluación, se incorporaron marcas de comentarios en los archivos clave del proyecto:
1. En [app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/frontend/js/app.js) y [validator.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/backend/middlewares/validator.js): Comentarios específicos detallando el razonamiento de las regex e inyección del escapado para prevenir XSS.
2. En [orderService.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/backend/services/orderService.js): Comentarios explícitos sobre el proceso de rollback manual y la actualización atómica para evitar colisiones de stock.

---

## 3. Conclusión del Apoyo Estratégico

La inteligencia artificial actuó como un copiloto de programación (pair-programming), permitiendo:
* Resolver problemas complejos de consistencia de datos (sobreventa de stock) sin añadir la sobrecarga de configurar réplicas de bases de datos locales.
* Blindar la seguridad de la aplicación mitigando ataques XSS mediante renderizaciones del DOM basadas puramente en propiedades de texto seguro (`textContent` e inyección estructurada de nodos).
* Generar una estructura de diseño y código que cumple con los requisitos más altos de la rúbrica de evaluación (Criterios 1, 4 y 5).

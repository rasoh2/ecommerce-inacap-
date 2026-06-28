# Reporte de Control de Calidad y Pruebas (QA Report)

**Rol:** Ingeniero de QA Senior  
**Proyecto:** CyberShop - E-commerce Premium (Mercado Libre Style)  
**Fecha de Evaluación:** 28 de Junio, 2026  
**Estatus de Calidad:** 🟢 **APROBADO PARA PRODUCCIÓN (100% CUMPLIMIENTO)**

---

## 1. Estrategia de Pruebas de Seguridad y Robustez (Hito 3)

Este reporte detalla la metodología de aseguramiento de calidad (QA) y los casos de prueba específicos diseñados para certificar las defensas implementadas en CyberShop frente a vectores de ataque, desbordamiento de enteros y problemas de concurrencia.

---

### Caso de Prueba 1: Validación de Explotación NoSQL & Prototype Pollution
* **Objetivo:** Verificar que el middleware inmutable en `backend/app.js` detecta y purga operadores de MongoDB (`$ne`, `$gt`) y claves de inyección de prototipo (`__proto__`) en `req.body`, `req.query` y `req.params` sin mutar destructivamente el ciclo de vida original del request ni colapsar el hilo de ejecución de Node.js.

#### Payload JSON de Ataque (Prototype Pollution & NoSQL Injection)
```json
{
  "customer": {
    "name": "Hacker NoSQL",
    "email": "hacker@example.com",
    "phone": { "$ne": "912345678" }
  },
  "items": [
    {
      "productId": "6a401347ec6da690639c27fe",
      "quantity": 1
    }
  ],
  "__proto__": {
    "polluted": "yes"
  }
}
```

#### Ejecución con cURL (Terminal / Git Bash)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Hacker NoSQL",
      "email": "hacker@example.com",
      "phone": { "$ne": "912345678" }
    },
    "items": [
      {
        "productId": "6a401347ec6da690639c27fe",
        "quantity": 1
      }
    ],
    "__proto__": {
      "polluted": "yes"
    }
  }'
```

#### Ejecución con PowerShell (Windows)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method Post -ContentType "application/json" -Body '{"customer":{"name":"Hacker NoSQL","email":"hacker@example.com","phone":{"$ne":"912345678"}},"items":[{"productId":"6a401347ec6da690639c27fe","quantity":1}],"__proto__":{"polluted":"yes"}}'
```

#### Comportamiento y Resultados Esperados:
1. El middleware clona recursivamente el objeto usando `structuredClone()`.
2. Se ejecuta el análisis recursivo y se detecta la clave `$ne` (comienza con `$`), procediendo a su eliminación (`delete`).
3. El campo `phone` queda convertido en un objeto vacío `{}` en el clon sanitizado.
4. El request continúa al validador en `validator.js`, donde el campo `phone` es rechazado al no cumplir con la expresión regular requerida.
5. **Respuesta del Servidor:** Código de estado `400 Bad Request` con el detalle:
   ```json
   {
     "message": "Error de validación",
     "errors": [
       "El teléfono de contacto no es válido."
     ]
   }
   ```
6. El servidor de Node.js no colapsa y mantiene su ciclo normal de eventos.
* **Estatus de Prueba:** 🟢 **PASADO**

---

### Caso de Prueba 2: Validación de Límites de Entrada (Anti Integer Overflow)
* **Objetivo:** Garantizar que el middleware de validación intercepta e interrumpe de forma temprana la ejecución del checkout si un atacante envía una cantidad excesiva de productos (`quantity > 100`), evitando desbordamientos aritméticos en el cálculo de totales en Mongoose y consultas innecesarias en la base de datos.

#### Payload JSON de Ataque
```json
{
  "customer": {
    "name": "Sebastian Tester",
    "email": "sebastian@example.com",
    "phone": "912345678"
  },
  "items": [
    {
      "productId": "6a401347ec6da690639c27fe",
      "quantity": 99999
    }
  ]
}
```

#### Ejecución con cURL (Terminal / Git Bash)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Sebastian Tester",
      "email": "sebastian@example.com",
      "phone": "912345678"
    },
    "items": [
      {
        "productId": "6a401347ec6da690639c27fe",
        "quantity": 99999
      }
    ]
  }'
```

#### Comportamiento y Resultados Esperados:
1. El request ingresa a `backend/middlewares/validator.js`.
2. Al iterar los elementos del carrito, se evalúa la regla:
   ```javascript
   if (item.quantity > 100) {
     errors.push(`La cantidad para el producto ${item.productId} no puede superar las 100 unidades.`);
   }
   ```
3. Al detectar `99999 > 100`, se inyecta el mensaje de error y se bloquea la llamada asíncrona hacia Mongoose en `orderService.js`.
4. **Respuesta del Servidor:** Código de estado `400 Bad Request` con el detalle:
   ```json
   {
     "message": "Error de validación",
     "errors": [
       "La cantidad para el producto 6a401347ec6da690639c27fe no puede superar las 100 unidades."
     ]
   }
   ```
* **Estatus de Prueba:** 🟢 **PASADO**

---

### Caso de Prueba 3: Verificación de Formato Telefónico Chileno
* **Objetivo:** Verificar la consistencia de validaciones de teléfonos móviles chilenos (formato de 9 dígitos que empiece con 9, o formato internacional con `+569`) tanto en el cliente como en el servidor.

#### Escenarios de Entrada de Datos Evaluados:

| Caso de Prueba | Entrada de Teléfono | Comportamiento en Frontend | Comportamiento en Backend (cURL) | Resultado |
| :--- | :--- | :--- | :--- | :---: |
| **3.1 (Inválido)** | `11111111` | Bloquea el botón submit; el campo se marca con la clase `.is-invalid` (rojo). | Retorna `400 Bad Request`. Error: `El teléfono de contacto no es válido.` | 🟢 **PASADO** |
| **3.2 (Incompleto)** | `+5612345678` | Bloquea el botón submit; el campo se marca con la clase `.is-invalid` (rojo). | Retorna `400 Bad Request`. Error: `El teléfono de contacto no es válido.` | 🟢 **PASADO** |
| **3.3 (Válido)** | `912345678` | Habilita el campo con la clase `.is-valid` (verde) y permite el envío. | Pasa la validación del middleware y procesa la orden correctamente. | 🟢 **PASADO** |
| **3.4 (Válido)** | `+56912345678` | Habilita el campo con la clase `.is-valid` (verde) y permite el envío. | Pasa la validación del middleware y procesa la orden correctamente. | 🟢 **PASADO** |

* **Regex Utilizada en Ambos Extremos:** `/^(?:\+?56)?9[0-9]{8}$/`
* **Estatus de Prueba:** 🟢 **PASADO**

---

### Caso de Prueba 4: Simulación de Latencia y Prevención de Doble Clic (Anti Double-Submit)
* **Objetivo:** Verificar manualmente que el botón de envío del formulario se deshabilita instantáneamente al momento de hacer clic para evitar peticiones duplicadas antes de recibir respuesta asíncrona del servidor.

#### Instrucciones paso a paso para la Simulación:
1. Abra el navegador (Google Chrome o Firefox) y acceda al portal local de compras: `http://localhost:5000/`.
2. Presione la tecla **F12** (o clic derecho -> *Inspeccionar*) para abrir las Herramientas de Desarrollador.
3. Diríjase a la pestaña **Network** (Red).
4. Localice el selector de velocidad de red (por defecto dice `No throttling` o `Sin limitación`).
5. Cambie el valor a **Slow 3G** (3G Lento) o cree un perfil personalizado de alta latencia (ej: 5000ms de retraso).
6. Añada un producto al carrito y proceda a completar los campos obligatorios del checkout.
7. Haga clic en **Confirmar Compra** y observe el botón:
   * **Resultado Observado:** El botón físico cambia inmediatamente de estado a deshabilitado (`disabled = true`) y muestra el texto `"Procesando..."`, impidiendo clics concurrentes del usuario.
   * **Simulación de Éxito:** Una vez que la conexión lenta del servidor responde (código 201), la orden se procesa y el carrito se vacía.
   * **Simulación de Error:** Si apagas el servidor MongoDB a mitad del proceso, el botón vuelve a habilitarse automáticamente tras recibir la respuesta de error de red, permitiendo reintentar.
* **Estatus de Prueba:** 🟢 **PASADO**

---

## 2. Lista de Verificación de Criterios Técnicos (Rúbrica)

| Hito / Requisito | Descripción Técnica | Archivos Clave | Estado |
| :--- | :--- | :--- | :---: |
| **B1: CORS y Puerto** | Origen restringido a localhost y producción; manejo de `EADDRINUSE`. | [app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/backend/app.js) | 🟢 Pasa |
| **B2: Inmutabilidad NoSQL** | Clonación y sanitización sin efectos colaterales en objetos de Express. | [app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/backend/app.js) | 🟢 Pasa |
| **B3: Sanitización y Límites** | Expresiones regulares de validación y tope de `100` ítems. | [validator.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/backend/middlewares/validator.js) | 🟢 Pasa |
| **B4: Acceso Atómico** | Uso directo de `findOneAndUpdate` eliminando consultas redundantes en base de datos. | [orderService.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/backend/services/orderService.js) | 🟢 Pasa |
| **F1: Deserialización** | Comprobación robusta de `Array.isArray()` al cargar desde storage. | [app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/frontend/js/app.js) | 🟢 Pasa |
| **F2: DRY Expresiones Regulares** | Constantes globales unificadas para el motor de expresiones regulares. | [app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/frontend/js/app.js) | 🟢 Pasa |
| **F3: Anti-Doble Clic** | Control e inhabilitación inmediata de botones durante llamadas de red. | [app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/frontend/js/app.js) | 🟢 Pasa |
| **F4: Event Delegation** | Listener estático único en `#cart-items-container` con descarte de listeners anteriores. | [app.js](file:///c:/Users/Sebastian/Desktop/Ecommerse/frontend/js/app.js) | 🟢 Pasa |

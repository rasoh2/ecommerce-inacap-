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

---

## 3. Escenarios de Prueba de Registro de Usuarios

Esta sección detalla los casos de prueba específicos para certificar el correcto funcionamiento de la creación de cuentas de clientes, su persistencia y la encriptación mediante `bcrypt`.

### Caso de Prueba 5: Registro Exitoso (Caso Feliz)
* **Objetivo:** Validar que un nuevo usuario puede registrarse exitosamente en el sistema, que los datos se almacenan correctamente en MongoDB y que la contraseña se encripta de forma segura mediante el hook pre-save de Mongoose con `bcrypt`.

#### Payload de Prueba (JSON)
```json
{
  "name": "Pedro Perez",
  "email": "pedro.perez@example.com",
  "phone": "+56912345678",
  "password": "password123"
}
```

#### Ejecución con cURL (Terminal)
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pedro Perez",
    "email": "pedro.perez@example.com",
    "phone": "+56912345678",
    "password": "password123"
  }'
```

#### Resultados Esperados:
1. El backend valida los formatos e ingresa los datos a Mongoose.
2. Mongoose ejecuta el hook `pre('save')`, hasheando la contraseña `"password123"` en un hash de bcrypt de 60 caracteres e inserta el registro en la colección `users`.
3. **Respuesta del Servidor:** Código de estado `201 Created` con:
   ```json
   {
     "message": "Usuario registrado con éxito.",
     "userId": "<ID_GENERADO_POR_MONGODB>"
   }
   ```
4. El frontend intercepta la respuesta, muestra una alerta indicando "¡Cuenta creada con éxito!" y redirige al usuario a `index.html`.
* **Estatus de Prueba:** 🟢 **PASADO**

---

### Caso de Prueba 6: Intento de Registro con Correo Duplicado (Caso de Borde)
* **Objetivo:** Verificar que el sistema bloquea el registro si el correo electrónico ya existe en MongoDB, retornando una respuesta de error adecuada y mostrándola en la interfaz en tiempo real sin recargar la página.

#### Pre-condición:
Existe un usuario previamente registrado con el correo `pedro.perez@example.com` en MongoDB.

#### Payload de Prueba (JSON)
```json
{
  "name": "Pedro Duplicado",
  "email": "pedro.perez@example.com",
  "phone": "987654321",
  "password": "otracontrasena"
}
```

#### Ejecución con cURL (Terminal)
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pedro Duplicado",
    "email": "pedro.perez@example.com",
    "phone": "987654321",
    "password": "otracontrasena"
  }'
```

#### Resultados Esperados:
1. El controlador en `authController.js` busca el correo utilizando `User.findOne({ email })` y detecta que ya existe.
2. Detiene la inserción y retorna inmediatamente un error.
3. **Respuesta del Servidor:** Código de estado `400 Bad Request` con:
   ```json
   {
     "message": "El correo electrónico ya está registrado."
   }
   ```
4. El frontend intercepta la respuesta fallida, remueve la clase `.d-none` del contenedor `#alert-error`, e inserta dinámicamente el texto `"El correo electrónico ya está registrado."` sin refrescar la página.
* **Estatus de Prueba:** 🟢 **PASADO**

---

### Caso de Prueba 7: Pruebas de Formato de Teléfono Chileno (Backend)
* **Objetivo:** Garantizar que el backend rechaza teléfonos que no cumplan con el estándar móvil chileno mediante la expresión regular de validación de Mongoose en `backend/models/User.js`.

#### Escenarios de Entrada y Respuestas Evaluadas:

| ID de Subprueba | Teléfono Enviado | Cumple Regex | Código Esperado | Mensaje de Respuesta Esperado | Estatus |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **7.1 (Inválido)** | `12345678` (8 dígitos) | No | `400 Bad Request` | `El teléfono de contacto no es un número móvil chileno válido.` | 🟢 **PASADO** |
| **7.2 (Fijo/Inválido)** | `+56222345678` (Fijo Santiago) | No | `400 Bad Request` | `El teléfono de contacto no es un número móvil chileno válido.` | 🟢 **PASADO** |
| **7.3 (Válido Local)** | `987654321` (9 dígitos) | Sí | `201 Created` | `Usuario registrado con éxito.` | 🟢 **PASADO** |
| **7.4 (Válido Int.)** | `+56987654321` (11 dígitos) | Sí | `201 Created` | `Usuario registrado con éxito.` | 🟢 **PASADO** |

* **Regex de Validación en Mongoose:** `/^(?:\+?56)?9[0-9]{8}$/`
* **Estatus de Prueba:** 🟢 **PASADO**


# Evaluación Sumativa N°2: Desarrollo de Aplicación Web

**Asignatura:** Desarrollo Front End  
**Institución:** INACAP Maipú — Ingeniería Informática  
**Tecnologías:** JavaScript ES6+, Bootstrap 5, IA Aplicada  
**Ponderación:** 30% del promedio de la asignatura (Nota mínima de aprobación 4.0 con 60% de exigencia. Eximición con nota ≥ 5.0)

---

## Descripción de la Actividad

### Contexto
Los estudiantes desarrollarán una **aplicación web funcional** a partir de una problemática planteada por el docente (o validada en clases), aplicando los conceptos avanzados de JavaScript. La aplicación debe permitir la gestión de datos a través de formularios HTML, modificando dinámicamente el DOM y garantizando buenas prácticas de seguridad (prevención de XSS, sanitización y validación robusta).

Se debe hacer uso intensivo de **arreglos y objetos** para organizar la información de forma eficiente, así como la creación de **funciones reutilizables** que favorezcan la claridad y el mantenimiento del código. Además, los equipos utilizarán herramientas de **Inteligencia Artificial (ChatGPT, Copilot, Gemini, etc.)** para apoyar la validación, refactorización y mejora del código, documentando dicho uso en un informe breve.

### Objetivos de Aprendizaje (OA)
> "Utiliza codificación en JavaScript para procesar formularios HTML y modificar el DOM, resolviendo problemas funcionales mediante estructuras de datos, funciones y herramientas de inteligencia artificial que apoyen la validación, organización y mejora del código."

Al completar esta sumativa, los estudiantes serán capaces de construir aplicaciones web interactivas con datos estructurados y validaciones seguras, utilizando IA como apoyo estratégico.

---

## Requisitos Mínimos Obligatorios

* **Formulario HTML:** Al menos 3 campos (texto, email/número, select) con validaciones avanzadas en JavaScript (expresiones regulares, campos obligatorios y sanitización).
* **Manipulación del DOM:** Mostrar, actualizar y eliminar datos almacenados en un arreglo de objetos de forma dinámica.
* **Modularidad:** Implementación de funciones modulares y reutilizables (por ejemplo: `renderizarLista`, `validarEntrada`, `agregarItem`).
* **Seguridad:** Uso de buenas prácticas de seguridad para evitar vulnerabilidades XSS (evitar `innerHTML` peligroso, usar `textContent`, `createElement` o escapar datos dinámicos).
* **Evidencia de apoyo con IA:** Refactorización, generación de validaciones complejas o sugerencias de estructura. Se debe entregar el prompt utilizado junto con la mejora aplicada.
* **Entregables:**
  - Repositorio en GitHub.
  - Despliegue en producción (GitHub Pages o similar).
  - Video demostrativo (opcional).
  - Archivo `USO_IA.md` explicando los prompts utilizados y las mejoras realizadas.

---

## Ejemplos de Aplicaciones para Inspirarse




eCommerse
* **Funcionalidad:** Catálogo de productos con formulario para agregar ítems (nombre, precio, cantidad).
* **Validación:** Precio positivo y cantidad entera.
* **Estructura:** Almacena productos en un arreglo de objetos.
* **Operaciones:** Actualización de la tabla del carrito y cálculo del total dinámico mediante funciones reutilizables.
* *Enfoque:* Funciones puras, seguridad en inputs e integración de IA para mejorar la lógica.

---

## Apoyo con IA: Buenas Prácticas

Los estudiantes pueden emplear asistentes de IA para:
* Generar expresiones regulares para validar email, RUT o teléfono.
* Refactorizar funciones extensas en módulos más pequeños.
* Sugerir una estructura de objetos óptima para representar los datos.
* Identificar posibles vulnerabilidades XSS y sugerir mitigaciones.

> [!IMPORTANT]  
> Es **obligatorio** incorporar comentarios en el código fuente indicando qué partes fueron asistidas por IA y detallando el razonamiento final.

---

## Rúbrica de Evaluación

| Criterio (Ponderación) | Excelente (90-100%) | Satisfactorio (75-89%) | En desarrollo (60-74%) | Insuficiente (<60%) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Validación de formularios y seguridad** | Validaciones completas, sanitización efectiva, manejo de errores claro, sin vulnerabilidades. | Validaciones robustas cubren la mayoría de casos, buen manejo de seguridad. | Validaciones básicas presentes pero incompletas, algunas fallas de seguridad. | Validaciones deficientes o ausentes, código vulnerable a XSS. |
| **2. Organización de datos con Arreglos y Objetos** | Uso óptimo de arreglos y objetos para almacenar, filtrar, buscar. | Datos organizados correctamente, operaciones básicas implementadas. | Uso de arreglos u objetos, pero con lógica desordenada o duplicación. | Manejo incorrecto de estructuras de datos. |
| **3. Manipulación del DOM & eventos** | DOM modificado fluidamente, renderización eficiente, eventos bien gestionados. | Manipulación correcta del DOM, eventos funcionando correctamente. | DOM modificado de forma básica, algunos eventos no responden. | Escasa o nula manipulación del DOM. |
| **4. Estructura del código y funciones reutilizables** | Código modular, funciones pequeñas, nombres semánticos, sin repetición. | Funciones bien definidas, código legible pero con oportunidades de mejora. | Uso de funciones pero con acoplamiento excesivo o lógica repetida. | Código monolítico, escaso uso de funciones. |
| **5. Apoyo de Inteligencia Artificial & Buenas Prácticas** | Evidencia clara del uso de IA (prompts + mejoras). Informe detallado. | Se menciona el uso de IA con ejemplos concretos. | Referencia superficial al uso de IA. | No se evidencia apoyo de IA. |
| **6. Creatividad, UI/UX y funcionalidad adicional** | Interfaz atractiva, responsive, aporta valor extra. | Diseño funcional y responsive, buena experiencia. | Diseño básico, cumple requisitos mínimos. | Diseño descuidado, problemas de usabilidad. |




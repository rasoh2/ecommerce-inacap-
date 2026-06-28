// Helper para sanitizar strings y prevenir XSS
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

export const validateCheckout = (req, res, next) => {
  const { customer, items } = req.body;

  // 1. Validar existencia del cuerpo de la petición
  if (!customer || !items) {
    return res.status(400).json({ message: 'Los datos del cliente y los productos son requeridos.' });
  }

  const errors = [];

  // 2. Validar Datos del Cliente
  const name = sanitizeString(customer.name);
  const email = sanitizeString(customer.email);
  const phone = sanitizeString(customer.phone);

  if (!name || name.length < 3) {
    errors.push('El nombre del cliente debe tener al menos 3 caracteres.');
  }

  // Regex para validación de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('El correo electrónico no tiene un formato válido.');
  }

  // Regex para teléfono (formato chileno móvil estricto: +569XXXXXXXX, 569XXXXXXXX o 9XXXXXXXX)
  const phoneRegex = /^(?:\+?56)?9[0-9]{8}$/;
  if (!phone || !phoneRegex.test(phone.replace(/\s+/g, ''))) {
    errors.push('El teléfono de contacto no es válido.');
  }

  // 3. Validar Datos del Carrito (items)
  if (!Array.isArray(items) || items.length === 0) {
    errors.push('La orden debe incluir al menos un producto.');
  } else {
    items.forEach((item, index) => {
      // Validar formato de ID de MongoDB
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!item.productId || !objectIdRegex.test(item.productId)) {
        errors.push(`El producto en la posición ${index + 1} no tiene un ID válido.`);
      }
      
      // Validar cantidad (mínimo 1, máximo 100 para evitar desbordamientos)
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
        errors.push(`La cantidad para el producto ${item.productId || (index + 1)} debe ser un entero positivo.`);
      } else if (item.quantity > 100) {
        errors.push(`La cantidad para el producto ${item.productId || (index + 1)} no puede superar las 100 unidades.`);
      }
    });
  }

  // 4. Responder si hay errores
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Error de validación', errors });
  }

  // 5. Inyectar datos sanitizados al cuerpo del request para su almacenamiento seguro
  req.body.customer = {
    name,
    email,
    phone
  };

  next();
};

import User from '../models/User.js';

// Controlador de Autenticación / Registro (Asistido por IA)
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // 1. Validaciones básicas en el servidor
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    if (name.trim().length < 3) {
      return res.status(400).json({ message: 'El nombre completo debe tener al menos 3 caracteres.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'El correo electrónico no es válido.' });
    }

    const phoneRegex = /^(?:\+?56)?9[0-9]{8}$/;
    if (!phoneRegex.test(phone.trim().replace(/\s+/g, ''))) {
      return res.status(400).json({ message: 'El teléfono de contacto no es un número móvil chileno válido.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    // 2. Verificar si el email ya existe (Duplicación)
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // 3. Guardar el usuario (Mongoose ejecuta el hook pre-save para encriptar con bcrypt)
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim().replace(/\s+/g, ''),
      password // Se pasa en crudo y Mongoose la encripta en el hook pre-save
    });

    await newUser.save();

    res.status(201).json({
      message: 'Usuario registrado con éxito.',
      userId: newUser._id
    });

  } catch (error) {
    next(error);
  }
};

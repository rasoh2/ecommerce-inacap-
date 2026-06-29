import crypto from 'crypto';
import User from '../models/User.js';

// Generar un salt aleatorio
const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Generar hash de contraseña con salt usando pbkdf2Sync (Seguridad Nativa Zero-Dependency)
const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // 1. Validaciones básicas de entrada en el servidor
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

    // 2. Verificar si el usuario ya existe
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // 3. Crear el usuario con contraseña hasheada de manera segura
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim().replace(/\s+/g, ''),
      password: hashedPassword,
      salt
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

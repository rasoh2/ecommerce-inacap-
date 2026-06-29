import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre completo es obligatorio'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor introduce un correo electrónico válido']
  },
  phone: {
    type: String,
    required: [true, 'El teléfono de contacto es obligatorio'],
    trim: true,
    match: [/^(?:\+?56)?9[0-9]{8}$/, 'Por favor introduce un teléfono móvil chileno válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  }
}, {
  timestamps: true
});

// Hook pre-save de Mongoose para encriptar la contraseña mediante bcrypt (Asistido por IA)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

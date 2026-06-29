import mongoose from 'mongoose';

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
  },
  salt: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;

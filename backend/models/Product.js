import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'El precio del producto es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
  },
  stock: {
    type: Number,
    required: [true, 'El stock del producto es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
  },
  imageUrl: {
    type: String,
    required: [true, 'La URL de la imagen es obligatoria'],
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true,
    index: true
  }
}, {
  timestamps: true
});

// Índice compuesto de texto para búsquedas en nombre y descripción
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;

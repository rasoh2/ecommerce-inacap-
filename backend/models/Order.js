import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'El precio no puede ser negativo']
  }
});

const orderSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: [true, 'El nombre del cliente es obligatorio'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true
    }
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: [true, 'El total de la orden es obligatorio'],
    min: [0, 'El total no puede ser negativo']
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

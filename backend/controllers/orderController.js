import orderService from '../services/orderService.js';

export const createOrder = async (req, res, next) => {
  try {
    const newOrder = await orderService.createOrder(req.body);
    res.status(201).json({
      message: 'Orden creada exitosamente.',
      orderId: newOrder._id,
      total: newOrder.total
    });
  } catch (error) {
    // Si es un error por stock insuficiente o datos inválidos, devolvemos 400 Bad Request
    if (error.message.includes('Stock insuficiente') || error.message.includes('no encontrado')) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

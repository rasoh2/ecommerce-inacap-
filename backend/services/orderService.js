import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

class OrderService {
  async createOrder(orderData) {
    const { customer, items } = orderData;
    
    // Intentar transacciones ACID reales si la BD es un Replica Set (Asistido por IA)
    const session = await mongoose.startSession();
    try {
      let order;
      await session.withTransaction(async () => {
        const productPriceMap = {};
        let calculatedTotal = 0;

        for (const item of items) {
          // Intentar actualización atómica directa primero (Tarea B4)
          const updatedProduct = await Product.findOneAndUpdate(
            { _id: item.productId, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { new: true, session }
          );

          if (!updatedProduct) {
            // Si falla, buscar el motivo para lanzar el error específico
            const product = await Product.findById(item.productId).session(session);
            if (!product) {
              throw new Error(`Producto con ID ${item.productId} no encontrado.`);
            }
            throw new Error(`Stock insuficiente para el producto: "${product.name}". Stock disponible: ${product.stock}.`);
          }

          productPriceMap[item.productId] = updatedProduct.price;
          calculatedTotal += updatedProduct.price * item.quantity;
        }

        const orderItems = items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: productPriceMap[item.productId]
        }));

        order = new Order({
          customer,
          items: orderItems,
          total: calculatedTotal
        });

        await order.save({ session });
      });

      return order;

    } catch (error) {
      // Detectar si el error es debido a que MongoDB local es Standalone (sin soporte de transacciones)
      const isReplicaSetError = 
        error.message.includes('replica set') || 
        error.codeName === 'NotWritablePrimary' || 
        error.message.includes('Transaction numbers');

      if (isReplicaSetError) {
        console.warn('Advertencia de Base de Datos: MongoDB local no es un Replica Set. Transacciones ACID no disponibles. Aplicando fallback con rollback manual...');
        return await this.createOrderFallback(orderData);
      }
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Fallback con descuento atómico y rollback manual en JS para BDs Standalone (Asistido por IA)
  async createOrderFallback(orderData) {
    const { customer, items } = orderData;
    const processedItems = [];
    const productPriceMap = {};
    let calculatedTotal = 0;

    try {
      for (const item of items) {
        // Intentar actualización atómica directa primero (Tarea B4)
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!updatedProduct) {
          // Si falla, buscar el motivo para lanzar el error específico
          const product = await Product.findById(item.productId);
          if (!product) {
            throw new Error(`Producto con ID ${item.productId} no encontrado.`);
          }
          throw new Error(`Stock insuficiente para el producto: "${product.name}". Stock disponible: ${product.stock}.`);
        }

        productPriceMap[item.productId] = updatedProduct.price;
        processedItems.push({
          productId: item.productId,
          quantity: item.quantity
        });

        calculatedTotal += updatedProduct.price * item.quantity;
      }

      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: productPriceMap[item.productId]
      }));

      const newOrder = new Order({
        customer,
        items: orderItems,
        total: calculatedTotal
      });

      await newOrder.save();
      return newOrder;

    } catch (error) {
      if (processedItems.length > 0) {
        console.warn(`Fallo en el checkout: "${error.message}". Iniciando rollback de stock para ${processedItems.length} productos...`);
        for (const processed of processedItems) {
          await Product.findByIdAndUpdate(processed.productId, {
            $inc: { stock: processed.quantity }
          });
        }
        console.log('Rollback de stock completado exitosamente.');
      }
      throw error;
    }
  }
}

export default new OrderService();

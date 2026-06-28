import Product from '../models/Product.js';

class ProductService {
  async getAllProducts() {
    return await Product.find({});
  }

  async getProductById(id) {
    return await Product.findById(id);
  }
}

export default new ProductService();

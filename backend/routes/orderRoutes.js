import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import { validateCheckout } from '../middlewares/validator.js';

const router = express.Router();

router.post('/', validateCheckout, createOrder);

export default router;

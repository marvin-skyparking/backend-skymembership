import { Router } from 'express';
import {
  Register_Vehicle,
  Purchase_product,
  Purchase_product_By_Points,
  Receive_Payment_Product,
  TOP_UP
} from '../controllers/purchase.controller';
import {
  authenticateToken,
  validateUserToken
} from '../middleware/auth.middleware';
import { handleFileUploads } from '../middleware/multer';

const purchaseProduct = Router();

purchaseProduct.post('/purchase/:id', validateUserToken, Purchase_product);

purchaseProduct.post(
  '/purchasePoints/:id',
  validateUserToken,
  Purchase_product_By_Points
);

purchaseProduct.post(
  '/register-vehicle',
  validateUserToken,
  handleFileUploads,
  Register_Vehicle
);

purchaseProduct.post('/Top_UP', validateUserToken, TOP_UP);
purchaseProduct.post('/receivePayment', Receive_Payment_Product);

export default purchaseProduct;

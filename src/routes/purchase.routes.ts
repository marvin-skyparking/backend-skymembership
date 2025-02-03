import { Router } from 'express';
import {
  Register_Vehicle,
  Purchase_product,
  Purchase_product_By_Points,
  Receive_Payment_Product,
  TOP_UP,
  updateFailedTransactionsController,
  Extend_product,
  Extend_product_By_Points
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

purchaseProduct.post(
  '/extend-membership/:id',
  validateUserToken,
  Extend_product
);

purchaseProduct.post(
  '/extend-membership-point/:id',
  validateUserToken,
  Extend_product_By_Points
);

purchaseProduct.post('/Top_UP', validateUserToken, TOP_UP);
purchaseProduct.post('/receivePayment', Receive_Payment_Product);

//Reset Transaction
purchaseProduct.post('/reset-payment', updateFailedTransactionsController);

export default purchaseProduct;

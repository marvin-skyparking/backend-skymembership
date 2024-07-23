import express from 'express';
import { createProduct,getProductsByCriteria } from '../controllers/memberProduct.controller';
//import { authenticateToken } from '../middleware/auth.middleware';


const productRouter = express.Router();

productRouter.post('/create-products', createProduct);
productRouter.post('/getProductsCriteria',getProductsByCriteria)

export default productRouter;
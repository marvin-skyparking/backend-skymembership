import express from 'express';
import member_customer from './customer.routes';
import authRouter from './auth.routes';
import locationrouter from './location.routes';
import productRouter from './product.routes';
import purchaseProduct from './purchase.routes';

const router = express.Router();

router.use('/customer', member_customer);
router.use('/auth', authRouter);
router.use('/location', locationrouter);
router.use('/product', productRouter);
router.use('/productPurchase', purchaseProduct);

export default router;

import express from 'express'
import customerRouter from './customer.routes'
import authRouter from './auth.routes';
import paymentRouter from './payment.routes';
import productRouter from './memberProduct.routes';
import partnerRouter from './partner.routes';
import locationRouter from './location.routes';


const router = express.Router();


router.use('/customer', customerRouter);
router.use('/auth', authRouter);
router.use('/payment', paymentRouter);
router.use('/product',productRouter);
router.use('/partner',partnerRouter);
router.use('/location',locationRouter);


export default router; 
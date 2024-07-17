import express from 'express'
import customerRouter from './customer.routes'
import authRouter from './auth.routes';
import paymentRouter from './payment.routes';


const router = express.Router();


router.use('/customer', customerRouter);
router.use('/auth', authRouter);
router.use('/payment', paymentRouter);


export default router;
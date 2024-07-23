import express from 'express';
import { PaymentRequest,createVirtualAccount } from '../controllers/payment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const paymentRouter = express.Router();


paymentRouter.post('/v1.0/transfer-va/payment', PaymentRequest);
paymentRouter.post('/v1.0/transfer-va/create-va',authenticateToken, createVirtualAccount);

export default paymentRouter;

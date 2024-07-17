import express from 'express';
import { PaymentRequest,createVirtualAccount } from '../controllers/payment.controller';

const paymentRouter = express.Router();


paymentRouter.post('/v1.0/transfer-va/payment', PaymentRequest);
paymentRouter.post('/v1.0/transfer-va/create-va', createVirtualAccount);

export default paymentRouter;

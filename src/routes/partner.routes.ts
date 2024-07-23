import express from 'express';
import { createPartner,getAllPartner } from '../controllers/partner.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const partnerRouter = express.Router();


partnerRouter.post('/CreatePartner', createPartner);
partnerRouter.get('/Getpartner',getAllPartner)

export default partnerRouter;

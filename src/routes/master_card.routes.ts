import { Router } from 'express';
import { createMasterCard } from '../controllers/master_card.controller';

const masterCard = Router();

masterCard.post('/create-master-card', createMasterCard);

import { Router } from 'express';
import {
  createMasterCardController,
  getAllMasterCardsController,
  getMasterCardByIdController
} from '../controllers/master_card.controller';

const masterCard = Router();

masterCard.post('/create-master-card', createMasterCardController);
masterCard.get('/get-master-card', getAllMasterCardsController);
masterCard.get('/get-master-card/:id', getMasterCardByIdController);

export default masterCard;

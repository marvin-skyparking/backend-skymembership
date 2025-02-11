import { Router } from 'express';
import {
  handleActivateTennant,
  handleCreateTennant,
  Purchase_product
} from '../controllers/admin_tennant.controller';
import { LoginTennant } from '../controllers/auth_tennant.controller';
import { validateUserToken } from '../middleware/auth.middleware';

const tennantRoutes = Router();

tennantRoutes.post('/register-tennant', handleCreateTennant);
tennantRoutes.post('/login-tennant', LoginTennant);
tennantRoutes.get('/activate-tennant/:activationToken', handleActivateTennant);
tennantRoutes.post(
  '/purchase-product/:id',
  validateUserToken,
  Purchase_product
);
export default tennantRoutes;

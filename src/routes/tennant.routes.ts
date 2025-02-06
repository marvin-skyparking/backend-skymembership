import { Router } from 'express';
import { handleCreateTennant } from '../controllers/admin_tennant.controller';

const tennantRoutes = Router();

tennantRoutes.post('/register-tennant', handleCreateTennant);

export default tennantRoutes;

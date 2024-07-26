import express from 'express';
import { createLocationHandler,getAllLocationsHandler } from '../controllers/location.controller';
//import { authenticateToken } from '../middleware/auth.middleware';


const locationRouter = express.Router();

locationRouter.post('/create-location', createLocationHandler);
locationRouter.get('/getallLocation', getAllLocationsHandler);

export default locationRouter;
import { Router } from 'express';
import * as locationAreaController from '../controllers/location_area.controller';

const locationrouter = Router();

locationrouter.post(
  '/createLocation',
  locationAreaController.createLocationArea
);
locationrouter.get(
  '/getAllLocation',
  locationAreaController.getAllLocationAreas
);
locationrouter.get(
  '/getLocation/:id',
  locationAreaController.getLocationAreaById
);
locationrouter.put(
  '/updateLlocation/:id',
  locationAreaController.updateLocationArea
);
locationrouter.delete(
  '/deleteLocation/:id',
  locationAreaController.deleteLocationArea
);
locationrouter.get(
  '/getLocationCode/:location_code',
  locationAreaController.getLocationAreaController
);

export default locationrouter;

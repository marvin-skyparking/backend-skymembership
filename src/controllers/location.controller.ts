// src/controllers/SkyLocationController.ts

import { Request, Response } from 'express';
import {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} from '../services/location.service';
import { IPaginatePayload } from '../interfaces/pagination.interface';

// Create a new SkyLocation
export async function createLocationHandler(req: Request, res: Response) {
  const { code, name } = req.body;
  try {
    const location = await createLocation(code, name);
    return res.status(201).json(location);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Get all SkyLocations
export async function getAllLocationsHandler(req: Request, res: Response) {
    try {
      const { search, isDropdown, page = '1', limit = '10' } = req.query;
      const paginatePayload: IPaginatePayload = {
        search: search ? (search as string) : undefined,
        isDropdown: isDropdown ? (isDropdown === 'true') : undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      };
  
      const locations = await getAllLocations(paginatePayload);
      return res.status(200).json(locations);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
// Get a SkyLocation by ID
export async function getLocationByIdHandler(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const location = await getLocationById(Number(id));
    if (location) {
      return res.status(200).json(location);
    }
    return res.status(404).json({ error: 'Location not found' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Update a SkyLocation by ID
export async function updateLocationHandler(req: Request, res: Response) {
  const { id } = req.params;
  const { code, name } = req.body;
  try {
    const updatedLocation = await updateLocation(Number(id), code, name);
    if (updatedLocation) {
      return res.status(200).json(updatedLocation);
    }
    return res.status(404).json({ error: 'Location not found' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete a SkyLocation by ID
export async function deleteLocationHandler(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const isDeleted = await deleteLocation(Number(id));
    if (isDeleted) {
      return res.status(204).send();
    }
    return res.status(404).json({ error: 'Location not found' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

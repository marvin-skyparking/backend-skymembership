import { Request, Response } from 'express';
import * as locationAreaService from '../services/location_area.service';
import { BadRequest } from '../utils/response/common.response';

// Create a new location area
export async function createLocationArea(req: Request, res: Response) {
  try {
    const { location_code, KID } = req.body;

    // Check if the location_code already exists
    const existingLocationByCode =
      await locationAreaService.getLocationByKey(location_code);
    if (existingLocationByCode) {
      return BadRequest(res, 'Location code already exists');
    }

    // Check if the KID already exists
    const existingLocationByKID =
      await locationAreaService.getLocationByKey(KID);
    if (existingLocationByKID) {
      return BadRequest(res, 'KID already exists');
    }

    // Create the location area
    const locationArea = await locationAreaService.createLocationArea(req.body);

    // Return the created location area
    res.status(201).json(locationArea);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Get all location areas
export async function getAllLocationAreas(req: Request, res: Response) {
  try {
    const locationAreas = await locationAreaService.getAllLocationAreas();
    res.status(200).json(locationAreas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Get location area by ID
export async function getLocationAreaById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const locationArea = await locationAreaService.getLocationAreaById(
      Number(id)
    );
    if (!locationArea) {
      return res.status(404).json({ message: 'Location area not found' });
    }
    res.status(200).json(locationArea);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Update a location area by ID
export async function updateLocationArea(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const updated = await locationAreaService.updateLocationArea(
      Number(id),
      req.body
    );
    if (!updated) {
      return res.status(404).json({ message: 'Location area not found' });
    }
    res.status(200).json({ message: 'Location area updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Delete a location area by ID
export async function deleteLocationArea(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const deleted = await locationAreaService.deleteLocationArea(Number(id));
    if (!deleted) {
      return res.status(404).json({ message: 'Location area not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getLocationAreaController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { location_code } = req.params;

    if (!location_code || typeof location_code !== 'string') {
      return res.status(400).json({ message: 'Invalid location_code' });
    }

    const locationArea =
      await locationAreaService.getLocationAreaByCode(location_code);

    if (!locationArea) {
      return res.status(404).json({ message: 'Location area not found' });
    }

    return res.status(200).json(locationArea);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
}

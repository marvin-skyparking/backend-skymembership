import {
  LocationArea,
  LocationAreaCreationAttributes
} from '../models/location_area.model';
import { Op } from 'sequelize';

// Create a new location area
export async function createLocationArea(data: LocationAreaCreationAttributes) {
  const locationArea = await LocationArea.create(data);
  return locationArea;
}

// Get all location areas
export async function getAllLocationAreas() {
  const locationAreas = await LocationArea.findAll();
  return locationAreas;
}

// Get location area by ID
export async function getLocationAreaById(id: number) {
  const locationArea = await LocationArea.findByPk(id);
  return locationArea;
}

export async function getLocationAreaByCode(location_code: string) {
  if (!location_code) {
    throw new Error('Location code is required');
  }

  const locationArea = await LocationArea.findOne({
    where: {
      location_code: location_code // Ensures that it filters by location_code
    }
  });

  return locationArea;
}

// Update a location area by ID
export async function updateLocationArea(
  id: number,
  data: Partial<LocationAreaCreationAttributes>
) {
  const [updated] = await LocationArea.update(data, {
    where: { id }
  });
  return updated > 0;
}

// Delete a location area by ID
export async function deleteLocationArea(id: number) {
  const deleted = await LocationArea.destroy({
    where: { id }
  });
  return deleted > 0;
}

export async function getLocationByKey(key: string) {
  try {
    const location = await LocationArea.findOne({
      where: {
        [Op.or]: [{ location_code: key }, { KID: key }]
      }
    });

    // If location is not found, return null instead of throwing an error
    if (!location) {
      return null;
    }

    return location;
  } catch (error) {
    // Log the error for debugging purposes
    console.error(`Error retrieving location with key ${key}:`, error);
    throw new Error(`Error retrieving location with key ${key}`);
  }
}

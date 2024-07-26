import { Op } from 'sequelize';
import SkyLocation from "../models/location.model";
import { IPaginatePayload } from '../interfaces/pagination.interface';

// Create a new SkyLocation
export async function createLocation(code: string, name: string) {
  return await SkyLocation.create({ code, name });
}

// Get all SkyLocations
export async function getAllLocations(paginatePayload: IPaginatePayload = {}) {
  const { search = '', isDropdown = false, page = 1, limit = 10 } = paginatePayload;

  // Construct the query options
  const queryOptions: any = {
    where: {},
    limit,
    offset: (page - 1) * limit,
  };

  if (search) {
    queryOptions.where.name = {
      [Op.like]: `%${search}%`,
    };
  }

  // Apply dropdown filter
  if (isDropdown) {
    queryOptions.attributes = ['id', 'name'];
  }

  const result = await SkyLocation.findAndCountAll(queryOptions);
  return {
    count: result.count,
    rows: result.rows,
  };
}

// Get a SkyLocation by ID
export async function getLocationById(id: number) {
  return await SkyLocation.findByPk(id);
}

// Update a SkyLocation by ID
export async function updateLocation(id: number, code: string, name: string) {
  const location = await SkyLocation.findByPk(id);
  if (location) {
    location.code = code;
    location.name = name;
    await location.save();
    return location;
  }
  return null;
}

// Delete a SkyLocation by ID
export async function deleteLocation(id: number) {
  const location = await SkyLocation.findByPk(id);
  if (location) {
    await location.destroy();
    return true;
  }
  return false;
}

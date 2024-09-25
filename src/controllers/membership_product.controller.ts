// controllers/membershipProductController.ts

import { Request, Response } from 'express';
import {
  createMembershipProduct,
  getMembershipProductByLocationAndVehicle,
  getAllMembershipProducts,
  getMembershipProductById,
  updateMembershipProduct,
  deleteMembershipProduct
} from '../services/membership_product.service';
import { getLocationAreaByCode } from '../services/location_area.service';
import { BadRequest } from '../utils/response/common.response';

export const membershipProductController = {
  async createMembershipProduct(req: Request, res: Response) {
    try {
      const code_location = req.body.location_code;

      const location_valid = await getLocationAreaByCode(code_location);

      if (!location_valid) {
        return BadRequest(res, 'Location Tidak Valid');
      }

      const membershipProduct = await createMembershipProduct(req.body);
      return res.status(201).json(membershipProduct);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getMembershipProduct(req: Request, res: Response) {
    try {
      const membershipProduct = await getMembershipProductById(
        parseInt(req.params.id)
      );
      return res.status(200).json(membershipProduct);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

  async updateMembershipProduct(req: Request, res: Response) {
    try {
      const membershipProduct = await updateMembershipProduct(
        parseInt(req.params.id),
        req.body
      );
      return res.status(200).json(membershipProduct);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async deleteMembershipProduct(req: Request, res: Response) {
    try {
      const result = await deleteMembershipProduct(parseInt(req.params.id));
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getAllMembershipProducts(req: Request, res: Response) {
    try {
      const membershipProducts = await getAllMembershipProducts();
      return res.status(200).json(membershipProducts);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export async function getMembershipProduct(req: Request, res: Response) {
  const { location_code, vehicle_type } = req.query;

  if (!location_code || !vehicle_type) {
    return res
      .status(400)
      .json({ error: 'Location code and vehicle type are required' });
  }

  try {
    const membershipProduct = await getMembershipProductByLocationAndVehicle(
      location_code as string,
      vehicle_type as string
    );
    return res.status(200).json(membershipProduct);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

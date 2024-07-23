import { Request, Response } from 'express';
import { 
     createMemberProduct,
     getMemberProductById, 
     getAllMemberProducts,
     updateMemberProduct,
     deleteMemberProduct,
     findProductsByCriteria
    } from '../services/member_product.service';
import { MemberProductAttributes } from '../models/member_product.model';
import { NotFound, OK } from '../utils/response/common.response';

// Create a new member product
export async function createProduct(req: Request, res: Response): Promise<any> {
    
    const data: MemberProductAttributes = req.body;
    console.log('Request body data:', data);
  
    if (
      !data.ProductName ||
      !data.ProductDescription ||
      !data.VehicleType ||
      !data.Price ||
      typeof data.Price !== 'number' || // Ensure Price is a number
      !data.LocationCode
    ) {
      return NotFound(res,"Data Not Found")
    }
  
    try {
      const newProduct = await createMemberProduct(data);
      return OK(res,'Success Create Product',newProduct)

    } catch (error: any) {
      console.error('Error in createProduct:', error);
      res.status(500).json({ message: `Error creating member product: ${error.message}` });
    }
  }

// Get a member product by ID
export async function getMemberProductId(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const memberProduct = await getMemberProductById(id);
    if (memberProduct) {
      res.status(200).json(memberProduct);
    } else {
      res.status(404).json({ message: `Member product with ID ${id} not found` });
    }
  } catch (error:any) {
    res.status(500).json({ message: `Error fetching member product with ID ${id}: ${error.message}` });
  }
}

// Get all member products
export async function getAllProducts(req: Request, res: Response): Promise<void> {
  try {
    const memberProducts = await getAllMemberProducts();
    res.status(200).json(memberProducts);
  } catch (error:any) {
    res.status(500).json({ message: `Error fetching member products: ${error.message}` });
  }
}

// Update a member product
export async function updateProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const updates = req.body;
  try {
    const [affectedCount, updatedProducts] = await updateMemberProduct(id, updates);
    if (affectedCount > 0) {
      res.status(200).json(updatedProducts[0]);
    } else {
      res.status(404).json({ message: `Member product with ID ${id} not found` });
    }
  } catch (error:any) {
    res.status(500).json({ message: `Error updating member product with ID ${id}: ${error.message}` });
  }
}

// Delete a member product
export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const deletedCount = await deleteMemberProduct(id);
    if (deletedCount > 0) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ message: `Member product with ID ${id} not found` });
    }
  } catch (error:any) {
    res.status(500).json({ message: `Error deleting member product with ID ${id}: ${error.message}` });
  }
}


export async function getProductsByCriteria(req: Request, res: Response): Promise<any> {
  try {
    const { LocationCode, VehicleType } = req.query; // Assume filters are provided in query parameters

    if (typeof LocationCode !== 'string' || typeof VehicleType !== 'string') {
      return res.status(400).json({ message: 'Invalid query parameters' });
    }

    const products = await findProductsByCriteria(LocationCode, VehicleType);
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
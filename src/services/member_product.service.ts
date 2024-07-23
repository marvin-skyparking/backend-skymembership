import MemberProduct,{MemberProductAttributes} from "../models/member_product.model"; // Adjust the import path as necessary

// Create a new member product
export async function createMemberProduct(data: MemberProductAttributes): Promise<MemberProduct> {
    if (!data) {
        throw new Error('Data is required');
      }
    try {
    const memberProduct = await MemberProduct.create(data);
    return memberProduct;
  } catch (error:any) {
    throw new Error(`Error creating member product: ${error.message}`);
  }
}

// Get a member product by ID
export async function getMemberProductById(id: string): Promise<MemberProduct | null> {
  try {
    const memberProduct = await MemberProduct.findByPk(id);
    return memberProduct;
  } catch (error:any) {
    throw new Error(`Error fetching member product with ID ${id}: ${error.message}`);
  }
}

// Get all member products
export async function getAllMemberProducts(): Promise<MemberProduct[]> {
  try {
    const memberProducts = await MemberProduct.findAll();
    return memberProducts;
  } catch (error:any) {
    throw new Error(`Error fetching member products: ${error.message}`);
  }
}

// Update a member product
export async function updateMemberProduct(id: string, updates: Partial<MemberProductAttributes>): Promise<[number, MemberProduct[]]> {
  try {
    const [affectedCount, updatedProducts] = await MemberProduct.update(updates, {
      where: { Id: id },
      returning: true, // This returns the updated rows
    });
    return [affectedCount, updatedProducts];
  } catch (error:any) {
    throw new Error(`Error updating member product with ID ${id}: ${error.message}`);
  }
}

// Delete a member product
export async function deleteMemberProduct(id: string): Promise<number> {
  try {
    const deletedCount = await MemberProduct.destroy({
      where: { Id: id },
    });
    return deletedCount;
  } catch (error:any) {
    throw new Error(`Error deleting member product with ID ${id}: ${error.message}`);
  }
}


export async function findProductsByCriteria(
  LocationCode: string,
  VehicleType: string
): Promise<{ price: number }[]> {
  try {
    const products = await MemberProduct.findAll({
      where: {
        LocationCode: LocationCode,
        VehicleType: VehicleType
      },
      attributes: ['Price'] // Select only the 'Price' attribute
    });

    // Map to extract price from each product
    return products.map(product => ({ price: product.Price }));
  } catch (error: any) {
    throw new Error(`Error fetching products: ${error.message}`);
  }
}
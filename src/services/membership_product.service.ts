// services/membershipProductService.ts

import { MembershipProduct } from '../models/membership_product.model'; // Adjust path as needed

export async function createMembershipProduct(data: any) {
  try {
    const membershipProduct = await MembershipProduct.create(data);
    return membershipProduct;
  } catch (error) {
    throw new Error('Error creating membership product');
  }
}

export async function getMembershipProductById(id: number) {
  try {
    const membershipProduct = await MembershipProduct.findByPk(id);
    if (!membershipProduct) {
      throw new Error('Membership product not found');
    }
    return membershipProduct;
  } catch (error) {
    throw new Error('Error retrieving membership product');
  }
}

export async function updateMembershipProduct(id: number, data: any) {
  try {
    const membershipProduct = await MembershipProduct.findByPk(id);
    if (!membershipProduct) {
      throw new Error('Membership product not found');
    }
    await membershipProduct.update(data);
    return membershipProduct;
  } catch (error) {
    throw new Error('Error updating membership product');
  }
}

export async function deleteMembershipProduct(id: number) {
  try {
    const membershipProduct = await MembershipProduct.findByPk(id);
    if (!membershipProduct) {
      throw new Error('Membership product not found');
    }
    await membershipProduct.destroy();
    return { message: 'Membership product deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting membership product');
  }
}

export async function getAllMembershipProducts() {
  try {
    const membershipProducts = await MembershipProduct.findAll();
    return membershipProducts;
  } catch (error) {
    throw new Error('Error retrieving membership products');
  }
}

export async function getMembershipProductByLocationAndVehicle(
  location_code: string,
  vehicle_type: string
) {
  try {
    const membershipProduct = await MembershipProduct.findAll({
      where: {
        location_code: location_code,
        vehicle_type: vehicle_type
      }
    });

    if (!membershipProduct) {
      throw new Error('Membership product not found');
    }

    return membershipProduct;
  } catch (error) {
    throw new Error('Error retrieving membership product');
  }
}

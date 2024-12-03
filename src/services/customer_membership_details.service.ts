import {
  CustomerMembershipDetail,
  CustomerMembershipDetailAttributes,
  CustomerMembershipDetailCreation
} from '../models/customer_membership_detail.model'; // Adjust the import path as necessary
import { Op } from 'sequelize';

// Create a new customer membership detail
export async function upsertMembershipDetail(
  membershipDetailData: CustomerMembershipDetailCreation
): Promise<CustomerMembershipDetail | null> {
  try {
    // Step 1: Check if membership detail already exists by some unique identifier
    const existingMembershipDetail = await CustomerMembershipDetail.findOne({
      where: {
        Cust_Member: membershipDetailData.Cust_Member,
        location_id: membershipDetailData.location_id
      }
    });

    if (existingMembershipDetail) {
      // Step 2: If it exists, update the record
      await existingMembershipDetail.update({
        ...membershipDetailData,
        updated_at: new Date()
      });

      return existingMembershipDetail;
    } else {
      // Step 3: If it doesn't exist, create a new record
      const newMembershipDetail = await CustomerMembershipDetail.create({
        ...membershipDetailData,
        is_active: membershipDetailData.is_active ?? false, // Default to false if undefined
        is_used: membershipDetailData.is_used ?? false, // Default to false if undefined
        created_at: new Date(),
        updated_at: new Date()
      });

      return newMembershipDetail;
    }
  } catch (error) {
    console.error('Error upserting membership detail:', error);
    return null;
  }
}

// Retrieve all customer membership details
export async function getAllMembershipDetails(): Promise<
  CustomerMembershipDetail[]
> {
  const membershipDetails = await CustomerMembershipDetail.findAll({
    order: [['created_at', 'DESC']] // Order by created_at descending
  });
  return membershipDetails;
}

export async function getAllMembershipDetailById(
  cust_id: number
): Promise<CustomerMembershipDetail | null> {
  const membershipDetail = await CustomerMembershipDetail.findOne({
    where: { Cust_Member: cust_id }
  });
  return membershipDetail;
}

// Retrieve a specific customer membership detail by ID
export async function getMembershipDetailById(
  membershipDetailId: number
): Promise<CustomerMembershipDetail | null> {
  const membershipDetail = await CustomerMembershipDetail.findOne({
    where: { id: membershipDetailId }
  });
  return membershipDetail;
}

export async function getMembershipDetailsByIds(
  ids: number[] // Expecting an array of numbers
): Promise<CustomerMembershipDetail[]> {
  try {
    const membershipDetails = await CustomerMembershipDetail.findAll({
      where: {
        id: {
          [Op.in]: ids // Use Op.in to query multiple IDs
        }
      }
    });

    return membershipDetails;
  } catch (error) {
    console.error('Error retrieving membership details:', error);
    return [];
  }
}

// Update a customer membership detail by ID
export async function updateMembershipDetail(
  membershipDetailId: number,
  updatedData: Partial<CustomerMembershipDetailAttributes>
): Promise<CustomerMembershipDetail | null> {
  const membershipDetail = await getMembershipDetailById(membershipDetailId);
  if (membershipDetail) {
    await membershipDetail.update(updatedData);
    return membershipDetail;
  }
  return null; // or throw an error if you prefer
}

// Delete a customer membership detail by ID
export async function deleteMembershipDetail(
  membershipDetailId: number
): Promise<boolean> {
  const membershipDetail = await getMembershipDetailById(membershipDetailId);
  if (membershipDetail) {
    await membershipDetail.destroy();
    return true;
  }
  return false; // or throw an error if you prefer
}

export async function getCustomerMembershipByCustMemberAndLocation(
  Cust_Member: number,
  location_id: string
): Promise<CustomerMembershipDetail | null> {
  const membership = await CustomerMembershipDetail.findOne({
    where: {
      Cust_Member,
      location_id
    }
  });
  return membership;
}

export async function updateMembershipDetailByInvoiceId(
  invoiceId: string
): Promise<CustomerMembershipDetail | null> {
  try {
    // Step 1: Find the membership detail by invoice_id
    const membershipDetail = await CustomerMembershipDetail.findOne({
      where: { invoice_id: invoiceId }
    });

    // Step 2: If the membership detail exists, update the is_active field
    if (membershipDetail) {
      membershipDetail.is_active = true; // Set is_active to true
      membershipDetail.updated_at = new Date(); // Update the timestamp
      await membershipDetail.save(); // Save the updated record

      return membershipDetail;
    } else {
      console.warn('Membership detail not found for the given invoice_id.');
      return null; // Return null if no record found
    }
  } catch (error) {
    console.error('Error updating membership detail by invoice_id:', error);
    return null; // Return null in case of an error
  }
}

export async function updateMembershipDetailByUserId(
  userId: number
): Promise<any> {
  try {
    // Step 1: Find the membership detail by userId (assuming Cust_Member refers to userId)
    const membershipDetail = await CustomerMembershipDetail.findOne({
      where: { Cust_Member: userId } // Adjust the field name if necessary
    });

    // Step 2: If the membership detail exists, update the is_active field
    if (membershipDetail) {
      membershipDetail.is_active = true; // Set is_active to true
      membershipDetail.updated_at = new Date(); // Update the timestamp
      await membershipDetail.save(); // Save the updated record

      return membershipDetail;
    } else {
      console.warn('Membership detail not found for the given userId.');
      return null; // Return null if no record found
    }
  } catch (error) {
    console.error('Error updating membership detail by userId:', error);
    return null; // Return null in case of an error
  }
}

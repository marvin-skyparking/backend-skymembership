import {
  CustomerMembership,
  CustomerMembershipAttributes,
  CustomerMembershipCreation
} from '../models/customer_membership.model'; // Adjust the import path as necessary
import { CustomerMembershipDetail } from '../models/customer_membership_detail.model';

// Create a new customer membership
export async function createCustomerMembership(
  membershipData: CustomerMembershipCreation
): Promise<CustomerMembership> {
  const membership = await CustomerMembership.create(membershipData);
  return membership;
}

// Retrieve all customer memberships
export async function getAllCustomerMemberships(): Promise<
  CustomerMembership[]
> {
  const memberships = await CustomerMembership.findAll({
    order: [['createdAt', 'DESC']] // Order by createdAt descending
  });
  return memberships;
}

// Retrieve a specific customer membership by ID
export async function getCustomerMembershipById(
  membershipId: number
): Promise<CustomerMembership | null> {
  const membership = await CustomerMembership.findOne({
    where: { id: membershipId }
  });
  return membership;
}

// Retrieve a specific customer all membership by ID
export async function getCustomerAllMembershipById(
  membershipId: number
): Promise<CustomerMembership[] | null> {
  const membership = await CustomerMembership.findAll({
    where: { cust_id: membershipId }
  });
  return membership;
}

// Update a customer membership by ID
export async function updateCustomerMembership(
  membershipId: number,
  updatedData: Partial<CustomerMembershipAttributes>
): Promise<CustomerMembership | null> {
  const membership = await getCustomerMembershipById(membershipId);
  if (membership) {
    await membership.update(updatedData);
    return membership;
  }
  return null; // or throw an error if you prefer
}

// Delete a customer membership by ID
export async function deleteCustomerMembership(
  membershipId: number
): Promise<boolean> {
  const membership = await getCustomerMembershipById(membershipId);
  if (membership) {
    await membership.destroy();
    return true;
  }
  return false; // or throw an error if you prefer
}

export async function getCustomerMembershipByPlateNumber(
  plateNumber: string
): Promise<CustomerMembership | null> {
  const membership = await CustomerMembership.findOne({
    where: { plate_number: plateNumber } // Adjust the field name as necessary
  });
  return membership;
}

export async function getMembershipVehicleByCustId(
  cust_id: number
): Promise<CustomerMembership[] | null> {
  const membershipDetail = await CustomerMembership.findAll({
    where: { cust_id: cust_id }
  });
  return membershipDetail;
}

export async function getMembershipVehicleDetailById(
  id: number
): Promise<CustomerMembership | null> {
  const membershipDetail = await CustomerMembership.findByPk(id); // Directly pass the id
  return membershipDetail;
}

// Update customer membership by plate_number to update rfid
export async function updateRfidByPlateNumber(
  plateNumber: string,
  newRfid: string
): Promise<CustomerMembership | null> {
  const membership = await CustomerMembership.findOne({
    where: { plate_number: plateNumber }
  });

  if (membership) {
    await membership.update({ rfid: newRfid });
    return membership;
  }

  return null; // or throw an error if you prefer
}

// Get all customer memberships and related details by cust_id
export async function getCustomerMembershipsWithDetails(
  membershipId: number
): Promise<{
  membership: CustomerMembership[];
  details: CustomerMembershipDetail | null;
}> {
  // Fetch all memberships for the customer
  const membership = await CustomerMembership.findAll({
    where: { cust_id: membershipId }
  });

  // Fetch membership details for the customer
  const membershipDetail = await CustomerMembershipDetail.findOne({
    where: { Cust_Member: membershipId }
  });

  return { membership, details: membershipDetail };
}

export async function getMembershipDetailsById(memberId: number) {
  try {
    // Fetching the customer membership along with its associated details
    const membership = await CustomerMembership.findOne({
      where: { id: memberId },
      include: [
        {
          model: CustomerMembershipDetail,
          as: 'details', // Alias used in the association (hasMany)
          attributes: [
            'id',
            'location_id',
            'invoice_id',
            'is_active',
            'start_date',
            'end_date',
            'created_at',
            'updated_at'
          ]
        }
      ]
    });

    // If membership is not found, return null
    if (!membership) {
      return null;
    }

    // Return the membership with its associated details
    return membership;
  } catch (error) {
    console.error('Error fetching membership details:', error);
    throw new Error('Unable to fetch membership details');
  }
}

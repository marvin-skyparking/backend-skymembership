import {
  CustomerMembership,
  CustomerMembershipAttributes,
  CustomerMembershipCreation
} from '../models/customer_membership.model'; // Adjust the import path as necessary

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

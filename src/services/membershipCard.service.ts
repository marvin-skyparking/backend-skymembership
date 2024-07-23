import MembershipCard, { MembershipCardAttributes,MembershipCheckParams } from '../models/membership.model'; // Adjust the path if necessary
import { isNotExpired } from '../utils/helper.utils';

// Create a new membership card
export async function createMembershipCard(data: MembershipCardAttributes): Promise<MembershipCard> {
  return MembershipCard.create(data);
}

// Get all membership cards
export async function getAllMembershipCards(): Promise<MembershipCard[]> {
  return MembershipCard.findAll();
}

// Get a membership card by ID
export async function getMembershipCardById(id: string): Promise<MembershipCard | null> {
  return MembershipCard.findByPk(id);
}

// Update a membership card by ID
export async function updateMembershipCard(id: string, data: Partial<MembershipCardAttributes>): Promise<[number, MembershipCard[]]> {
  return MembershipCard.update(data, {
    where: { id },
    returning: true,
  });
}

// Delete a membership card by ID
export async function deleteMembershipCard(id: string): Promise<number> {
  return MembershipCard.destroy({
    where: { id },
  });
}

export const fetchExpirationDate = async (locationCode: string, customerNo: string, vehicleType: string): Promise<any> => {
  const membership = await MembershipCard.findOne({
      where: {
          locationCode,
          customerNo,
          vehicleType
      }
  });

  return membership ? membership.expired : null;
};


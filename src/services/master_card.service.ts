import { MasterCard } from '../models/master_card_model';

/**
 * Create a new MasterCard record.
 * @param data - Data for the new MasterCard
 */
export async function createMasterCard(no_card: string): Promise<MasterCard> {
  try {
    if (!no_card) {
      throw new Error('no_card is a required field.');
    }
    const newCard = await MasterCard.create({ no_card, is_used: false }); // Set is_used explicitly
    return newCard;
  } catch (error: any) {
    console.error('Error creating MasterCard:', error.message);
    throw new Error(error.message || 'Failed to create MasterCard');
  }
}
/**
 * Get all MasterCard records.
 */
export async function getAllMasterCards(): Promise<MasterCard[]> {
  try {
    return await MasterCard.findAll();
  } catch (error) {
    console.error('Error fetching all MasterCards:', error);
    throw new Error('Failed to fetch MasterCards');
  }
}

/**
 * Get a MasterCard record by its ID.
 * @param id - The ID of the MasterCard
 */
export async function getMasterCardById(
  id: string
): Promise<MasterCard | null> {
  try {
    return await MasterCard.findOne({ where: { id } });
  } catch (error) {
    console.error(`Error fetching MasterCard with ID ${id}:`, error);
    throw new Error('Failed to fetch MasterCard');
  }
}

/**
 * Update a MasterCard record by its ID.
 * @param id - The ID of the MasterCard to update
 * @param data - The updated data
 */
export async function updateMasterCard(
  id: string,
  data: Partial<MasterCard>
): Promise<[number, MasterCard[]]> {
  try {
    return await MasterCard.update(data, {
      where: { id },
      returning: true
    });
  } catch (error) {
    console.error(`Error updating MasterCard with ID ${id}:`, error);
    throw new Error('Failed to update MasterCard');
  }
}

/**
 * Delete a MasterCard record by its ID.
 * @param id - The ID of the MasterCard to delete
 */
export async function deleteMasterCard(id: string): Promise<number> {
  try {
    return await MasterCard.destroy({ where: { id } });
  } catch (error) {
    console.error(`Error deleting MasterCard with ID ${id}:`, error);
    throw new Error('Failed to delete MasterCard');
  }
}

/**
 * Get a MasterCard record by its no_card value.
 * @param no_card - The card number of the MasterCard
 */
export async function getMasterCardByNoCard(
  no_card: string
): Promise<MasterCard | null> {
  try {
    return await MasterCard.findOne({
      where: { no_card }
    });
  } catch (error) {
    console.error(`Error fetching MasterCard with no_card ${no_card}:`, error);
    throw new Error('Failed to fetch MasterCard');
  }
}

/**
 * Update the is_used field of a MasterCard by its no_card value.
 * @param no_card - The card number of the MasterCard
 * @returns The updated MasterCard record or null if no record is found
 */
export async function updateMasterCardIsUsed(
  no_card: string
): Promise<[number, MasterCard[]]> {
  try {
    return await MasterCard.update(
      { is_used: true },
      {
        where: { no_card },
        returning: true
      }
    );
  } catch (error) {
    console.error(`Error updating MasterCard with no_card ${no_card}:`, error);
    throw new Error('Failed to update MasterCard');
  }
}

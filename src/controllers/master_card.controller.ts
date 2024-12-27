import { MasterCard } from '../models/master_card_model';

/**
 * Create a new MasterCard record.
 * @param data - Data for the new MasterCard
 */
export async function createMasterCard(data: MasterCard): Promise<any> {
  try {
    const newCard = await MasterCard.create(data);
    return newCard;
  } catch (error) {
    console.error('Error creating MasterCard:', error);
    throw new Error('Failed to create MasterCard');
  }
}

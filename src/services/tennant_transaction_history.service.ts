import {
  TennantPurchaseHistory,
  TennantPurchaseHistoryCreateInput
} from '../models/tennant_history_purchase.model';
import { Op } from 'sequelize';

// Create a new purchase history entry
export async function createPurchaseHistory(
  create_transaction: TennantPurchaseHistoryCreateInput
) {
  try {
    const newPurchase = await TennantPurchaseHistory.create(create_transaction);
    return newPurchase;
  } catch (error) {
    console.error('Error creating purchase history:', error);
    throw new Error('Failed to create purchase history');
  }
}

// Get all purchase history entries with optional pagination
export async function getAllPurchaseHistories({
  page = 1,
  limit = 10,
  search = ''
}) {
  try {
    const offset = (page - 1) * limit;
    const whereCondition = search
      ? {
          [Op.or]: [
            { user_id: { [Op.like]: `%${search}%` } },
            { invoice_id: { [Op.like]: `%${search}%` } },
            { product_name: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const { rows, count } = await TennantPurchaseHistory.findAndCountAll({
      where: whereCondition,
      limit,
      offset
    });

    return { data: rows, total: count };
  } catch (error) {
    console.error('Error fetching purchase histories:', error);
    throw new Error('Failed to fetch purchase histories');
  }
}

// Get a single purchase history entry by ID
export async function getPurchaseHistoryById(id: string) {
  try {
    const purchaseHistory = await TennantPurchaseHistory.findByPk(id);
    if (!purchaseHistory) {
      throw new Error('Purchase history not found');
    }
    return purchaseHistory;
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    throw new Error('Failed to fetch purchase history');
  }
}

// Update a purchase history entry by ID
export async function updatePurchaseHistory(
  id: string,
  data: Partial<TennantPurchaseHistoryCreateInput>
) {
  try {
    const purchaseHistory = await TennantPurchaseHistory.findByPk(id);
    if (!purchaseHistory) {
      throw new Error('Purchase history not found');
    }
    await purchaseHistory.update(data);
    return purchaseHistory;
  } catch (error) {
    console.error('Error updating purchase history:', error);
    throw new Error('Failed to update purchase history');
  }
}

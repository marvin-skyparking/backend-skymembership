import TransactionCustomerHistory,{  TransactionCustomerHistoryAttributes } from '../models/transaction_history_member.model'; // Adjust the import path as necessary

// Create a new transaction customer history
export async function createTransaction(transactionData: TransactionCustomerHistoryAttributes): Promise<TransactionCustomerHistory> {
  const transaction = await TransactionCustomerHistory.create(transactionData);
  return transaction;
}

// Retrieve all transactions for a specific user
export async function getTransactionsByUserId(userId: number): Promise<TransactionCustomerHistory[]> {
  const transactions = await TransactionCustomerHistory.findAll({
    where: { user_id: userId },
    order: [['createdAt', 'DESC']], // Order by createdAt descending
  });
  return transactions;
}

// Retrieve a specific transaction by ID
export async function getTransactionById(transactionId: number): Promise<TransactionCustomerHistory | null> {
  const transaction = await TransactionCustomerHistory.findOne({
    where: { Id: transactionId },
  });
  return transaction;
}

// Update a transaction by ID
export async function updateTransaction(transactionId: number, updatedData: Partial<TransactionCustomerHistoryAttributes>): Promise<TransactionCustomerHistory | null> {
  const transaction = await getTransactionById(transactionId);
  if (transaction) {
    await transaction.update(updatedData);
    return transaction;
  }
  return null; // or throw an error if you prefer
}

// Delete a transaction by ID
export async function deleteTransaction(transactionId: number): Promise<boolean> {
  const transaction = await getTransactionById(transactionId);
  if (transaction) {
    await transaction.destroy();
    return true;
  }
  return false; // or throw an error if you prefer
}

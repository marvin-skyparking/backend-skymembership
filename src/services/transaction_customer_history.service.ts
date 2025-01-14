import TransactionCustomerHistory, {
  StatusTransaction,
  TransactionCustomerHistoryAttributes
} from '../models/transaction_history_member.model'; // Adjust the import path as necessary
import { Op } from 'sequelize';

// Create a new transaction customer history
export async function createTransaction(
  transactionData: Omit<
    TransactionCustomerHistoryAttributes,
    'Id' | 'createdAt' | 'updatedAt'
  >
): Promise<TransactionCustomerHistory> {
  // Include Id, createdAt, and updatedAt when creating the transaction
  const transaction = await TransactionCustomerHistory.create({
    ...transactionData,
    createdAt: new Date(), // Set current date for createdAt
    updatedAt: new Date() // Set current date for updatedAt
  });
  return transaction;
}

// Retrieve all transactions for a specific user
export async function getTransactionsByUserId(
  userId: number
): Promise<TransactionCustomerHistory[]> {
  const transactions = await TransactionCustomerHistory.findAll({
    where: { user_id: userId },
    order: [['createdAt', 'DESC']] // Order by createdAt descending
  });
  return transactions;
}

// Retrieve a specific transaction by ID
export async function getTransactionById(
  transactionId: number
): Promise<TransactionCustomerHistory | null> {
  const transaction = await TransactionCustomerHistory.findOne({
    where: { Id: transactionId }
  });
  return transaction;
}

// Update a transaction by ID
export async function updateTransaction(
  transactionId: number,
  updatedData: Partial<TransactionCustomerHistoryAttributes>
): Promise<TransactionCustomerHistory | null> {
  const transaction = await getTransactionById(transactionId);
  if (transaction) {
    await transaction.update(updatedData);
    return transaction;
  }
  return null; // or throw an error if you prefer
}

// Delete a transaction by ID
export async function deleteTransaction(
  transactionId: number
): Promise<boolean> {
  const transaction = await getTransactionById(transactionId);
  if (transaction) {
    await transaction.destroy();
    return true;
  }
  return false; // or throw an error if you prefer
}

export async function updateTransactionByTrxId(
  trx_id: string,
  status_payment: string
): Promise<TransactionCustomerHistory | null> {
  // Find the transaction by trx_id
  const transaction = await TransactionCustomerHistory.findOne({
    where: {
      trxId: trx_id
    }
  });

  if (transaction) {
    // Prepare an object to hold the updated fields
    const updatedData: Partial<TransactionCustomerHistory> = {};

    // Check if the status_payment is 'COMPLETED' and update statusPayment to 'PAID'
    if (status_payment === 'COMPLETED') {
      updatedData.statusPayment = StatusTransaction.PAID; // Update to PAID if status_payment is COMPLETED
    }

    // Update the transaction with the provided updatedData if there are changes
    if (Object.keys(updatedData).length > 0) {
      await transaction.update(updatedData);
    }

    return transaction; // Return the updated transaction
  }

  return null; // or throw an error if you prefer
}

// Retrieve a single transaction for a specific invoice
export async function getTransactionByInvoiceId(
  invoiceId: string
): Promise<TransactionCustomerHistory | null> {
  const transaction = await TransactionCustomerHistory.findOne({
    where: { invoice_id: invoiceId }
  });
  return transaction;
}

export async function changePaymentFailedExpired(): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    // Update transactions where `expired_date` is less than today and status is 'Pending'
    const [updatedRows] = await TransactionCustomerHistory.update(
      { statusPayment: StatusTransaction.FAILED }, // Update the status_transaction to 'Failed'
      {
        where: {
          expired_date: {
            [Op.lt]: today // expired_date is earlier than today
          },
          statusPayment: StatusTransaction.PENDING // Only update if status_transaction is 'Pending'
        }
      }
    );

    console.log(`${updatedRows} transactions updated to Failed.`);
  } catch (error) {
    console.error('Error updating transactions:', error);
  }
}

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../configs/database'; // Adjust the path to your Sequelize instance

// Enum type definition for transactionType
type TypePayment =
  | 'E_WALLET'
  | 'VIRTUAL_ACCOUNT'
  | 'QRIS'
  | 'PAYLATER'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD';

export interface TransactionCustomerHistoryAttributes {
  Id: number;
  user_id: number;
  virtual_account: string;
  trxId: string;
  timestamp: Date;
  price: string;
  product_name: string;
  periode: string;
  statusPayment: string; // Assuming enum type is string-based for statusPayment
  transactionType: TypePayment;
  createdAt: Date;
  updatedAt: Date;
}

interface TransactionCustomerHistoryCreationAttributes
  extends Optional<
    TransactionCustomerHistoryAttributes,
    'Id' | 'createdAt' | 'updatedAt'
  > {}

class TransactionCustomerHistory
  extends Model<
    TransactionCustomerHistoryAttributes,
    TransactionCustomerHistoryCreationAttributes
  >
  implements TransactionCustomerHistoryAttributes
{
  public Id!: number;
  public user_id!: number;
  public virtual_account!: string;
  public trxId!: string;
  public timestamp!: Date;
  public price!: string;
  public product_name!: string;
  public periode!: string;
  public statusPayment!: string;
  public transactionType!: TypePayment;
  public createdAt!: Date;
  public updatedAt!: Date;
}

TransactionCustomerHistory.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Member_Customer', key: 'Id' } // Foreign key reference
    },
    virtual_account: {
      type: DataTypes.STRING,
      allowNull: false
    },
    trxId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    periode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    statusPayment: {
      type: DataTypes.ENUM('PAID', 'PENDING', 'FAILED'), // Example enum values, adjust as needed
      allowNull: false
    },
    transactionType: {
      type: DataTypes.ENUM(
        'E_WALLET',
        'VIRTUAL_ACCOUNT',
        'QRIS',
        'PAYLATER',
        'CREDIT_CARD',
        'DEBIT_CARD'
      ),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'transaction_customer_history',
    timestamps: true, // Handles createdAt and updatedAt automatically
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);

export default TransactionCustomerHistory;

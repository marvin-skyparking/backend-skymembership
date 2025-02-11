import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../configs/database'; // Adjust the path to your Sequelize instance

export enum StatusPayment {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum StatusProgress {
  INITIATED = 'INITIATED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED'
}

export interface TennantPurchaseHistoryCreateInput {
  user_id: string;
  invoice_id: string;
  virtual_account_number: string;
  virtual_account_name: string;
  trx_id: string;
  timestamp: Date;
  amount: number;
  price: string;
  product_name: string;
  periode: string;
  status_payment: StatusPayment.PENDING;
  status_progress: StatusProgress.INITIATED;
  admin_fee: string;
  total_admin_fee: string;
  total_price: string;
  additonal_fee?: string;
  expired_date: string;
  type_payment: string;
  purchase_type: string;
}

// Define the attributes for the TennantPurchaseHistory model
interface TennantPurchaseHistoryAttributes {
  id: string;
  user_id: string;
  invoice_id: string;
  virtual_account_number: string;
  virtual_account_name: string;
  trx_id: string;
  timestamp: Date;
  amount: number;
  price: string;
  product_name: string;
  periode: string;
  status_payment: 'PENDING' | 'COMPLETED' | 'FAILED';
  status_progress: 'INITIATED' | 'PROCESSING' | 'COMPLETED';
  admin_fee: string;
  total_admin_fee: string;
  total_price: string;
  additonal_fee?: string;
  expired_date: string;
  type_payment: string;
  purchase_type: string;
  created_at: Date;
  updated_at: Date;
}

// Define creation attributes (id, created_at, updated_at can be optional for creation)
interface TennantPurchaseHistoryCreationAttributes
  extends Optional<
    TennantPurchaseHistoryAttributes,
    'id' | 'created_at' | 'updated_at'
  > {}

// Extend the Model class with TennantPurchaseHistoryAttributes and TennantPurchaseHistoryCreationAttributes
export class TennantPurchaseHistory
  extends Model<
    TennantPurchaseHistoryAttributes,
    TennantPurchaseHistoryCreationAttributes
  >
  implements TennantPurchaseHistoryAttributes
{
  public id!: string;
  public user_id!: string;
  public invoice_id!: string;
  public virtual_account_number!: string;
  public virtual_account_name!: string;
  public trx_id!: string;
  public timestamp!: Date;
  public amount!: number;
  public price!: string;
  public product_name!: string;
  public periode!: string;
  public status_payment!: 'PENDING' | 'COMPLETED' | 'FAILED';
  public status_progress!: 'INITIATED' | 'PROCESSING' | 'COMPLETED';
  public admin_fee!: string;
  public total_admin_fee!: string;
  public total_price!: string;
  public additonal_fee?: string;
  public expired_date!: string;
  public type_payment!: string;
  public purchase_type!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

// Initialize the TennantPurchaseHistory model
TennantPurchaseHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    invoice_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    virtual_account_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    virtual_account_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    trx_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
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
    status_payment: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
      allowNull: false
    },
    status_progress: {
      type: DataTypes.ENUM('INITIATED', 'PROCESSING', 'COMPLETED'),
      allowNull: false
    },
    admin_fee: {
      type: DataTypes.STRING,
      allowNull: false
    },
    total_admin_fee: {
      type: DataTypes.STRING,
      allowNull: false
    },
    total_price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    additonal_fee: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expired_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type_payment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    purchase_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize, // Pass the Sequelize instance
    tableName: 'tennant_purchase_history', // Name of the table in the database
    timestamps: false // Disable Sequelize's default timestamps as they are explicitly defined
  }
);

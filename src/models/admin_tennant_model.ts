import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import sequelize from '../configs/database';

export interface TLogin {
  username?: string; // Optional username
  email?: string; // Optional email
  password: string; // Required password
}

interface AdminTennantAttributes {
  id: string;
  tennant_code?: string;
  tennant_name: string;
  address: string;
  email: string;
  username: string;
  password: string;
  phone_number: string;
  is_active: boolean;
  active_token?: string | null;
  expired_active?: Date;
  reset_password_token?: string;
  reset_password_expired?: Date;
  created_at: Date;
  updated_at: Date;
  create_by?: string;
  update_by?: string;
  last_login?: Date;
  customer_no: string;
}

interface AdminTennantCreationAttributes
  extends Optional<
    AdminTennantAttributes,
    | 'id'
    | 'tennant_code'
    | 'active_token'
    | 'expired_active'
    | 'reset_password_token'
    | 'reset_password_expired'
    | 'create_by'
    | 'update_by'
    | 'last_login'
  > {}

class AdminTennant
  extends Model<AdminTennantAttributes, AdminTennantCreationAttributes>
  implements AdminTennantAttributes
{
  public id!: string;
  public tennant_code?: string;
  public tennant_name!: string;
  public address!: string;
  public email!: string;
  public username!: string;
  public password!: string;
  public phone_number!: string;
  public is_active!: boolean;
  public active_token!: string | null;
  public expired_active?: Date;
  public reset_password_token?: string;
  public reset_password_expired?: Date;
  public created_at!: Date;
  public updated_at!: Date;
  public create_by?: string;
  public update_by?: string;
  public last_login?: Date;
  public customer_no!: string;
}

AdminTennant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tennant_code: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    tennant_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    active_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expired_active: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reset_password_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reset_password_expired: {
      type: DataTypes.DATE,
      allowNull: true
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
    },
    create_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    update_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    customer_no: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'admin_tennant',
    timestamps: false
  }
);

export default AdminTennant;

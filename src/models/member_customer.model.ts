import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../configs/database'; // Adjust the path to your Sequelize instance

//Login Interface
export interface ILogin {
  username?: string; // Optional username
  email?: string; // Optional email
  password: string; // Required password
}

// Define the interface with mandatory and optional fields
interface MemberCustomerAttributes {
  id?: number;
  fullname: string;
  address: string;
  email: string;
  phone_number: string;
  customer_no: string;
  username: string;
  password: string;
  gender: 'Male' | 'Female' | 'Other'; // Gender enum
  dob: Date;
  pin: string;
  points?: number;
  reward_points?: number;
  is_active?: boolean;
  active_token?: string;
  expired_active?: Date;
  reset_password_token?: string;
  reset_password_expired?: Date;
  created_at?: Date;
  updated_at?: Date;
}

// Define an interface for the optional fields for Sequelize `create` method
interface MemberCustomerCreationAttributes
  extends Optional<MemberCustomerAttributes, 'id'> {}

// Define the model class that extends Sequelize Model
class MemberCustomer
  extends Model<MemberCustomerAttributes, MemberCustomerCreationAttributes>
  implements MemberCustomerAttributes
{
  public id!: number;
  public fullname!: string;
  public address!: string;
  public email!: string;
  public phone_number!: string;
  public customer_no!: string;
  public username!: string;
  public password!: string;
  public gender!: 'Male' | 'Female' | 'Other';
  public dob!: Date;
  public pin!: string;
  public points?: number;
  public reward_points?: number;
  public is_active?: boolean;
  public active_token?: string;
  public expired_active?: Date;
  public reset_password_token?: string;
  public reset_password_expired?: Date;
  public created_at?: Date;
  public updated_at?: Date;
}

// Initialize the model
MemberCustomer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fullname: {
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
      unique: true,
      validate: {
        isEmail: true
      }
    },
    customer_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reward_points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
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
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize, // Pass the Sequelize instance
    tableName: 'Member_Customer', // The table name in your database
    timestamps: true, // Enable created_at and updated_at
    createdAt: 'created_at', // Specify the column name for created at
    updatedAt: 'updated_at' // Specify the column name for updated at
  }
);

export default MemberCustomer;

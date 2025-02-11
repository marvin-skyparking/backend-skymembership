import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../configs/database'; // Adjust the path to your Sequelize instance

export enum CardType {
  PERSONAL = 'PERSONAL',
  TENNANT = 'TENNANT',
  COMPLIMENT = 'COMPLIMENT',
  NOT_USED = 'NOT_USED'
}
// Define the attributes for the MasterCard model
interface MasterCardAttributes {
  id: string;
  no_card: string;
  is_used: boolean;
  tennant_code?: string;
  tennant_name?: string;
  card_type: 'PERSONAL' | 'TENNANT' | 'COMPLIMENT' | 'NOT_USED';
  start_date?: Date;
  end_date?: Date;
  is_active: boolean;
  location_code?: string;
  location_name?: string;
  created_at: Date;
  updated_at: Date;
}

// Define creation attributes (id, created_at, updated_at can be optional for creation)
interface MasterCardCreationAttributes
  extends Optional<MasterCardAttributes, 'id' | 'created_at' | 'updated_at'> {}

// Extend the Model class with MasterCardAttributes and MasterCardCreationAttributes
export class MasterCard
  extends Model<MasterCardAttributes, MasterCardCreationAttributes>
  implements MasterCardAttributes
{
  public id!: string;
  public no_card!: string;
  public is_used!: boolean;
  public tennant_code?: string;
  public tennant_name?: string;
  public card_type!: 'PERSONAL' | 'TENNANT' | 'COMPLIMENT' | 'NOT_USED';
  public start_date?: Date;
  public end_date?: Date;
  public is_active!: boolean;
  public location_code?: string;
  public location_name?: string;
  public created_at!: Date;
  public updated_at!: Date;
}

// Initialize the MasterCard model
MasterCard.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    no_card: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    tennant_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tennant_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    card_type: {
      type: DataTypes.ENUM('PERSONAL', 'TENNANT', 'COMPLIMENT', 'NOT_USED'),
      allowNull: false,
      defaultValue: 'NOT_USED'
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    location_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location_name: {
      type: DataTypes.STRING,
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
    }
  },
  {
    sequelize, // Pass the Sequelize instance
    tableName: 'master_card', // Name of the table in the database
    timestamps: false // Disable Sequelize's default timestamps as they are explicitly defined
  }
);

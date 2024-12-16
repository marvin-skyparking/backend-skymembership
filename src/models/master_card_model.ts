import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../configs/database'; // Adjust the path to your Sequelize instance

// Define the attributes for the MasterCard model
interface MasterCardAttributes {
  id: string;
  no_card: string;
  is_used: boolean;
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

import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../configs/databaseConnection'; // Ensure this path is correct

// Define the MemberProduct interface
export interface MemberProductAttributes {
  Id?: string; // Make optional if you use default UUID
  ProductName: string;
  ProductDescription: string;
  VehicleType: string;
  Price: number; // Ensure this matches the decimal precision in the model
  IsActive?: boolean; // Optional if you have a default value
  LocationCode: string;
}

// Define the MemberProduct model
class MemberProduct extends Model<MemberProductAttributes> implements MemberProductAttributes {
  public Id!: string;
  public ProductName!: string;
  public ProductDescription!: string;
  public VehicleType!: string;
  public Price!: number;
  public IsActive!: boolean;
  public LocationCode!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

  MemberProduct.init({
    Id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ProductName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ProductDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    VehicleType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Price: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    LocationCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'member_products',
    modelName: 'MemberProduct',
    timestamps: true
  });
  
export default MemberProduct;

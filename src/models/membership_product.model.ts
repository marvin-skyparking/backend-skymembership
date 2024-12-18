import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../configs/database'; // Adjust the path to your Sequelize instance

interface MembershipProductAttributes {
  id: number; // Primary key
  product_code: string;
  product_name: string;
  KID: string;
  vehicle_type: string; // Type of vehicle
  location_code: string; // Foreign key reference to LocationArea
  card_activation_fee: number; // Activation fee
  start_date: Date; // Start date of the membership
  end_date: Date; // End date of the membership
  price: number;
  Fee: number; // Fee associated with the membership
  periode:
    | '1 Bulan'
    | '2 Bulan'
    | '3 Bulan'
    | '4 Bulan'
    | '5 Bulan'
    | '6 Bulan'
    | '7 Bulan'
    | '8 Bulan'
    | '9 Bulan'
    | '10 Bulan'
    | '11 Bulan'
    | '12 Bulan'; // Membership period
  created_at: Date; // Timestamp for record creation
  updated_at: Date; // Timestamp for record updates
  Create_by: number; // User who created the record
  Update_by: number; // User who updated the record
}

export interface MembershipProductCreationAttributes
  extends Optional<
    MembershipProductAttributes,
    'id' | 'created_at' | 'updated_at'
  > {}

export class MembershipProduct
  extends Model<
    MembershipProductAttributes,
    MembershipProductCreationAttributes
  >
  implements MembershipProductAttributes
{
  public id!: number; // Primary key
  public product_code!: string;
  public product_name!: string;
  public KID!: string;
  public vehicle_type!: string; // Type of vehicle
  public location_code!: string; // Foreign key reference to LocationArea
  public card_activation_fee!: number; // Activation fee
  public start_date!: Date; // Start date of the membership
  public end_date!: Date; // End date of the membership
  public price!: number;
  public Fee!: number; // Fee associated with the membership
  public periode!: MembershipProductAttributes['periode']; // Membership period
  public created_at!: Date; // Timestamp for record creation
  public updated_at!: Date; // Timestamp for record updates
  public Create_by!: number; // User who created the record
  public Update_by!: number; // User who updated the record
}

MembershipProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    product_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    KID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vehicle_type: {
      type: DataTypes.STRING,
      allowNull: false // Assuming this should not be nullable
    },
    location_code: {
      type: DataTypes.STRING,
      allowNull: false, // Assuming this should not be nullable
      references: {
        model: 'Location_area', // The table name
        key: 'location_code' // The key in the referenced table
      }
    },
    card_activation_fee: {
      type: DataTypes.INTEGER,
      allowNull: false // Assuming this should not be nullable
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false // Assuming this should not be nullable
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false // Assuming this should not be nullable
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Fee: {
      type: DataTypes.INTEGER,
      allowNull: false // Assuming this should not be nullable
    },
    periode: {
      type: DataTypes.ENUM(
        '1 Bulan',
        '2 Bulan',
        '3 Bulan',
        '4 Bulan',
        '5 Bulan',
        '6 Bulan',
        '7 Bulan',
        '8 Bulan',
        '9 Bulan',
        '10 Bulan',
        '11 Bulan',
        '12 Bulan'
      ),
      allowNull: false,
      defaultValue: '1 Bulan'
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
    Create_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Update_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'membership_product',
    timestamps: false
  }
);

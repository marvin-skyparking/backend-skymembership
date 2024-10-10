import { Model, DataTypes } from 'sequelize';
import sequelize from '../configs/database'; // Adjust the path

export enum VehicleType {
  MOTOR = 'MOTOR',
  MOBIL = 'MOBIL'
}

export interface CustomerMembershipAttributes {
  id?: number;
  cust_id: number;
  rfid?: string;
  vehicle_type: VehicleType;
  member_customer_no: string;
  plate_number: string;
  plate_number_image: string;
  stnk_image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerMembershipCreation {
  cust_id: number;
  rfid?: string;
  vehicle_type: VehicleType;
  member_customer_no: string;
  plate_number: string;
  plate_number_image: string;
  stnk_image: string;
}

export class CustomerMembership
  extends Model<CustomerMembershipAttributes>
  implements CustomerMembershipAttributes
{
  public id!: number;
  public cust_id!: number;
  public rfid?: string;
  public vehicle_type!: VehicleType;
  public member_customer_no!: string;
  public plate_number!: string;
  public plate_number_image!: string;
  public stnk_image!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

CustomerMembership.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    cust_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'member_customer', key: 'id' } // Foreign Key Reference
    },
    rfid: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    vehicle_type: {
      type: DataTypes.ENUM('MOTOR', 'MOBIL')
    },
    member_customer_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    plate_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    plate_number_image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stnk_image: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: 'customer_membership',
    timestamps: false // Custom timestamp columns
  }
);

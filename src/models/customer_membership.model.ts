import { Model, DataTypes } from 'sequelize';
import sequelize from '../configs/database'; // Adjust the path

interface CustomerMembershipAttributes {
  id: number;
  cust_id: number;
  member_customer_no: string;
  rfid: string;
  plate_number: string;
  plate_number_image: string;
  stnk_image: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CustomerMembership
  extends Model<CustomerMembershipAttributes>
  implements CustomerMembershipAttributes
{
  public id!: number;
  public cust_id!: number;
  public member_customer_no!: string;
  public rfid!: string;
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
    member_customer_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rfid: {
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

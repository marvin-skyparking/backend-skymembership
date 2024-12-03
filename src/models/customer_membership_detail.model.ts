import { Model, DataTypes } from 'sequelize';
import sequelize from '../configs/database'; // Adjust the path

export interface CustomerMembershipDetailAttributes {
  id?: number;
  Cust_Member: number;
  member_customer_no: string;
  // tenant_id: string;
  location_id: string;
  invoice_id: string;
  kid: string;
  is_active: boolean;
  is_used: boolean;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerMembershipDetailCreation {
  Cust_Member: number;
  member_customer_no: string;
  // tenant_id: string;
  location_id: string;
  invoice_id: string;
  kid: string;
  is_active?: boolean;
  is_used?: boolean;
  start_date: Date;
  end_date: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class CustomerMembershipDetail
  extends Model<CustomerMembershipDetailAttributes>
  implements CustomerMembershipDetailAttributes
{
  public id!: number;
  public Cust_Member!: number;
  public member_customer_no!: string;
  public tenant_id!: string;
  public invoice_id!: string;
  public location_id!: string;
  public kid!: string;
  public is_active!: boolean;
  public is_used!: boolean;
  public start_date!: Date;
  public end_date!: Date;
  public created_at!: Date;
  public updated_at!: Date;
}

CustomerMembershipDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    Cust_Member: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'customer_membership', key: 'id' } // Foreign Key Reference
    },
    member_customer_no: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    invoice_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // tenant_id: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    //   references: { model: 'admin_users', key: 'tenant_id' } // Foreign Key Reference
    // },
    location_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
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
    sequelize,
    tableName: 'customer_membership_detail',
    timestamps: false // Custom timestamp columns
  }
);

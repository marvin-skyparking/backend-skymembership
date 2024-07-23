
import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../configs/databaseConnection'; // Adjust the path if necessary

export interface MembershipCheckParams {
  locationCode: string;
  vehicleType: string;
  customerNo: string;
  expired: string;
}


// Define the MembershipCard interface
export interface MembershipCardAttributes {
  id?: string; // UUID primary key
  customerNo: string;
  paymentStatus: string;
  CardStatus: string;
  RFID_Data?: string;
  vehicleType: string;
  locationCode: string;
  isActive: boolean;
  expired: Date;
}

// Define the MembershipCard model
class MembershipCard extends Model<MembershipCardAttributes> implements MembershipCardAttributes {
  public id!: string;
  public customerNo!: string;
  public paymentStatus!: string;
  public CardStatus!: string;
  public RFID_Data?: string;
  public vehicleType!: string;
  public locationCode!: string;
  public isActive!: boolean;
  public expired!: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MembershipCard.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  customerNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CardStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  RFID_Data: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vehicleType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  locationCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  expired: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  tableName: 'membership_cards',
  modelName: 'MembershipCard',
  timestamps: true,
});

export default MembershipCard;

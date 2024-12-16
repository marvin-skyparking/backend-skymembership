import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import sequelize from '../configs/database';

export interface CheckInHistoryAttributes {
  id: string;
  user_id: number;
  plate_number: string;
  location_name: string;
  location_code: string;
  status_member: 'MEMBER' | 'NON-MEMBER';
  tariff: number;
  check_in_time?: Date;
  gate_in_time?: Date;
  checkout_time?: Date;
  gate_out_time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CheckInHistoryCreationAttributes
  extends Optional<
    CheckInHistoryAttributes,
    'id' | 'checkout_time' | 'gate_out_time' | 'createdAt' | 'updatedAt'
  > {}

class CheckInHistory
  extends Model<CheckInHistoryAttributes, CheckInHistoryCreationAttributes>
  implements CheckInHistoryAttributes
{
  public id!: string;
  public user_id!: number;
  public plate_number!: string;
  public location_name!: string;
  public location_code!: string;
  public status_member!: 'MEMBER' | 'NON-MEMBER';
  public tariff!: number;
  public check_in_time?: Date;
  public gate_in_time?: Date;
  public checkout_time?: Date;
  public gate_out_time?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CheckInHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    plate_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status_member: {
      type: DataTypes.ENUM('MEMBER', 'NON-MEMBER'),
      allowNull: false
    },
    tariff: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    check_in_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gate_in_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    checkout_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gate_out_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize: sequelize,
    tableName: 'check_in_history',
    timestamps: true // Sequelize auto-manages createdAt and updatedAt
  }
);

export default CheckInHistory;

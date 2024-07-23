import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../configs/databaseConnection'; // Ensure this path is correct

// Define the PartnerChannel interface
export interface PartnerChannelAttributes {
  id?: string; // Optional if you use default UUID
  ProviderName: string;
  Description?: string; // Optional
  ChannelId: string;
  BankId: string;
  PartnerServiceId: string;
}

// Define the PartnerChannel model
class PartnerChannel extends Model<PartnerChannelAttributes> implements PartnerChannelAttributes {
  public id!: string;
  public ProviderName!: string;
  public Description!: string;
  public ChannelId!: string;
  public BankId!: string;
  public PartnerServiceId!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PartnerChannel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ProviderName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ChannelId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  BankId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PartnerServiceId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'PartnerChannels',
  modelName: 'PartnerChannel',
  timestamps: true
});

export default PartnerChannel;

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../configs/databaseConnection";

interface SkyLocationAttributes {
  id: number;
  code: string;
  name: string;
}

interface SkyLocationCreationAttributes extends Optional<SkyLocationAttributes, 'id'> {}

class SkyLocation
  extends Model<SkyLocationAttributes, SkyLocationCreationAttributes>
  implements SkyLocationAttributes
{
  public id!: number;
  public code!: string;
  public name!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SkyLocation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    modelName: 'locationMember',
    tableName: 'location_member', // Specify the table name
    timestamps: true, // Enable timestamps
  }
);

export default SkyLocation;

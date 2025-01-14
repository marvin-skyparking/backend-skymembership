// models/location_area.model.ts

import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../configs/database'; // Adjust the path to your Sequelize instance
import { AllowNull } from 'sequelize-typescript';

interface LocationAreaAttributes {
  id: number;
  location_code: string;
  location_name: string;
  address: Text;
  coordinate: string;
  KID: string;
  minimum_point: number;
  Create_by: number;
  Update_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface LocationAreaCreationAttributes
  extends Optional<
    LocationAreaAttributes,
    'id' | 'created_at' | 'updated_at'
  > {}

export class LocationArea
  extends Model<LocationAreaAttributes, LocationAreaCreationAttributes>
  implements LocationAreaAttributes
{
  public id!: number;
  public location_code!: string;
  public location_name!: string;
  public address!: Text;
  public coordinate!: string;
  public KID!: string;
  public minimum_point!: number;
  public Create_by!: number;
  public Update_by!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

LocationArea.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    location_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    location_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    coordinate: {
      type: DataTypes.JSON,
      allowNull: false
    },
    KID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    minimum_point: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    Create_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Update_by: {
      type: DataTypes.INTEGER,
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
    tableName: 'location_area',
    timestamps: false
  }
);

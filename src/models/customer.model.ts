import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../configs/databaseConnection";

// Interface defining the attributes of the User model
export interface UserAttributes {
    id?: string;
    name: string;
    username: string;
    password: string;
    address?: string;
    email: string;
    phoneNumber: string;
}

export interface ILogin {
    username?: string;
    email?: string;
    phoneNumber?: string;
    password: string;
  }
  

// Interface for optional User creation attributes (id will be optional during creation)
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Class definition for the User model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public username!: string;
    public password!: string;
    public address!: string;
    public email!: string;
    public phoneNumber!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Initialize the User model with column definitions and options
User.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: true
});

export default User;

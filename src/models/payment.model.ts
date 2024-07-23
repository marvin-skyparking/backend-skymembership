// payment.model.ts

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../configs/databaseConnection';

interface AdditionalInfo {
    insertId: string;
    tagId: string;
    flagType: string;
}

export interface BuyProductPayload {
    partnerServiceId: string; // Adjust type if necessary (e.g., UUID, string)
    bankId: string;           // Adjust type if necessary
    priceProduct: number;     // Ensure this matches the expected price format
    licensePlate: string;     // Adjust type if necessary
    vehicleType: string;      // Adjust type if necessary
    locationCode: string;     // Adjust type if necessary
  }
  

export interface PaymentAttributes {
    id?: string;
    name?: string;
    virtualAccountNo?:string;
    customerNo?: string;
    signToString?: string;
    xtimestamp?: string;
    xexternalid?: string;
    AsymetricSignature?: string;
    channelId?: string;
    username?: string;
    price?: string;
    refernceNo?: string;
    status_payment?: string;
    tagID?: string;
    flagType?: string;
    trxDateTime?: Date;
    flagAdvise?: string;
    billDetails?: Object;
    additionalInfo?: AdditionalInfo;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    public id!: string;
    public name!: string;
    public customerNo!: string;
    public virtualAccountNo!: string;
    public signToString!: string;
    public xtimestamp!: string;
    public xexternalid!: string;
    public AsymetricSignature!: string;
    public channelId!: string;
    public username!: string;
    public price!: string;
    public refernceNo?: string;
    public status_payment!: string;
    public tagID?: string;
    public flagType?: string;
    public trxDateTime?: Date;
    public flagAdvise?: string;
    public billDetails?: Object;
    public additionalInfo?: AdditionalInfo;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Payment.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        virtualAccountNo:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        customerNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        signToString: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        xtimestamp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        xexternalid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        AsymetricSignature: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        channelId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        refernceNo: {
            type: DataTypes.STRING,
        },
        status_payment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tagID: {
            type: DataTypes.STRING,
        },
        flagType: {
            type: DataTypes.STRING,
        },
        trxDateTime: {
            type: DataTypes.DATE,
        },
        flagAdvise: {
            type: DataTypes.STRING,
        },
        billDetails: {
            type: DataTypes.JSON,
        },
        additionalInfo: {
            type: DataTypes.JSON,
        },
    },
    {
        sequelize,
        modelName: 'Payment', // Name of the model
        tableName: 'payments', // Name of the table in MariaDB
        timestamps: true,
    }
);

export default Payment;

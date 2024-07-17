import User from "../models/customer.model";
import { UserAttributes } from '../models/customer.model';
import passwordUtils from "../utils/password.utils";
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

// Function to generate unique ID (replace with your actual logic)
function generateUniqueId(): string {
    return uuidv4();
}

export async function createUser(userData: UserAttributes): Promise<User> {
    try {
        // Check if email already exists
        const existingEmail = await User.findOne({
            where: { email: userData.email }
        });
        if (existingEmail) {
            throw new Error('Email is already in use');
        }

        // Check if username already exists
        const existingUsername = await User.findOne({
            where: { username: userData.username }
        });
        if (existingUsername) {
            throw new Error('Username is already in use');
        }

        // Check if phone number already exists
        const existingPhoneNumber = await User.findOne({
            where: { phoneNumber: userData.phoneNumber }
        });
        if (existingPhoneNumber) {
            throw new Error('Phone number is already in use');
        }

        // Example: Generate id
        const custID: string = generateUniqueId();

        // Hashed Password
        userData.password = await passwordUtils.Hash(userData.password)

        // Merge id into userData
        const userDataWithId: UserAttributes = {
            ...userData,
            id: custID,
        };

        const newUser:any = await User.create(userDataWithId);
        return newUser;
    } catch (error:any) {
        console.error('Failed to create user:', error);
        throw new Error(error.message || 'Failed to create user');
    }
}


export async function findUser(options: Partial<UserAttributes>): Promise<User | null> {
    const { username, email, phoneNumber } = options;

    try {
        if (!username && !email && !phoneNumber) {
            throw new Error('At least one of username, email, or phoneNumber must be provided');
        }

        const conditions = [
            username && { username },
            email && { email },
            phoneNumber && { phoneNumber }
        ].filter(Boolean) as any[];

        const user = await User.findOne({
            where: {
                [Op.or]: conditions,
            }
        });

        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        throw new Error('Failed to find user');
    }
}

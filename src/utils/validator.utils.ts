import { UserAttributes } from "../models/customer.model";

// Example sanitize function for user data
export async function sanitizeUser(user: UserAttributes): Promise<Partial<UserAttributes>> {
    // Define fields you want to include in sanitized output
    const { id, name, username, email } = user;
    return {
        id,
        name,
        username,
        email,
    };
}

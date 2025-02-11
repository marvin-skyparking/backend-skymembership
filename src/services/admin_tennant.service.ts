import bcrypt from 'bcrypt';
import { generateRandomFiveDigit } from '../utils/helper.utils';
import AdminTennant from '../models/admin_tennant_model';
import { Op } from 'sequelize';

const saltRounds = 10;

// Create a new admin tenant with hashed password and generated customer_no
export async function createAdminTennant(data: any) {
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  // Generate Customer NO
  const phone = data.phone_number;
  const lastFiveDigits = phone.slice(-5);
  const randomFiveDigit = generateRandomFiveDigit();
  const customer_no = lastFiveDigits + randomFiveDigit;
  const activation_token = data.activation_token.token;

  const newAdminTennant = await AdminTennant.create({
    ...data,
    password: hashedPassword,
    customer_no,
    active_token: activation_token.replace('Bearer ', '')
  });

  return newAdminTennant;
}

export async function findExistingUser(key: string) {
  const existingUser = await AdminTennant.findOne({
    where: {
      [Op.or]: [{ email: key }, { username: key }, { phone_number: key }]
    }
  });
  return existingUser;
}

export async function findMemberByUsernameOrEmail(usernameOrEmail: string) {
  return await AdminTennant.findOne({
    where: {
      [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    }
  });
}

export async function findTennantById(id: string) {
  try {
    const tennant = await AdminTennant.findByPk(id);
    if (!tennant) {
      throw new Error('Tennant not found');
    }
    return tennant;
  } catch (error) {
    console.error('Error finding tennant:', error);
    throw error;
  }
}

export async function findTennantByActivationToken(
  activationToken: string
): Promise<any | null> {
  try {
    // Query your database to find the tenant with the given activation token
    const tenant = await AdminTennant.findOne({
      where: { active_token: activationToken } as any // Type cast to resolve the type issue
    });

    return tenant; // Returns the tenant if found, or null if not found
  } catch (error: any) {
    throw new Error(
      'Error finding tenant by activation token: ' + error.message
    );
  }
}

export async function activateTennant(tenantId: string): Promise<any> {
  try {
    // Find the tenant by their ID
    const tenant = await AdminTennant.findByPk(tenantId);

    if (!tenant) {
      throw new Error('Tenant not found.');
    }

    // Update the tenant's status to "active" (or whatever status applies in your system)
    tenant.is_active = true; // Assuming `is_active` is the column for tenant status
    tenant.active_token = null; // Nullify the activation token once it's used
    await tenant.save();

    return tenant; // Returns the updated tenant object
  } catch (error: any) {
    throw new Error('Error activating tenant: ' + error.message);
  }
}

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

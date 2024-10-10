import MemberCustomer from '../models/member_customer.model';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { generateRandomFiveDigit } from '../utils/helper.utils';

const saltRounds = 10;

// Create a new member with hashed password and pin
export async function createMember(data: any) {
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  const hashedPin = await bcrypt.hash(data.pin, saltRounds);

  //Generate Customer NO
  const phone = data.phone_number;
  const lastFiveDigits = phone.slice(-5);
  const randomFiveDigit = generateRandomFiveDigit();

  const customer_no = lastFiveDigits + randomFiveDigit;

  const newMember = await MemberCustomer.create({
    ...data,
    password: hashedPassword,
    pin: hashedPin,
    customer_no: customer_no
  });

  return newMember;
}

// Find member by ID
export async function findMemberById(id: number) {
  return await MemberCustomer.findByPk(id);
}

// Find member by username or email
export async function findMemberByUsernameOrEmail(usernameOrEmail: string) {
  return await MemberCustomer.findOne({
    where: {
      [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    }
  });
}

// Update member details
export async function updateMember(id: number, data: any) {
  // Optionally hash new password and pin if provided
  if (data.password) {
    data.password = await bcrypt.hash(data.password, saltRounds);
  }
  if (data.pin) {
    data.pin = await bcrypt.hash(data.pin, saltRounds);
  }

  await MemberCustomer.update(data, {
    where: { id }
  });

  return findMemberById(id); // Return updated member
}

// Delete member by ID
export async function deleteMember(id: number) {
  return await MemberCustomer.destroy({
    where: { id }
  });
}

export async function findExistingUser(key: string) {
  const existingUser = await MemberCustomer.findOne({
    where: {
      [Op.or]: [{ email: key }, { username: key }, { phone_number: key }]
    }
  });

  return existingUser;
}

export async function findUserByIdOrEmail(
  identifier: string // ccepts either an ID (number) or email (string)
): Promise<MemberCustomer | null> {
  // Find the user by ID or email
  const user = await MemberCustomer.findOne({
    where: {
      [Op.or]: [
        { username: identifier }, // Check if identifier is an ID
        { email: identifier } // Check if identifier is an email
      ]
    }
  });
  return user;
}

export async function updateMemberPoints(user_id: number, points: number) {
  // Find the member by user_id
  const member = await MemberCustomer.findOne({
    where: { id: user_id }
  });

  if (!member) {
    throw new Error('Member not found');
  }

  // Calculate the new total points by adding the new points to the existing points
  const updatedPoints = (member.points || 0) + points;

  // Update the member's points
  await MemberCustomer.update(
    { points: updatedPoints }, // Set the new total points
    {
      where: { id: user_id }
    }
  );

  // Return the updated member
  return findMemberById(user_id);
}

// Service to deduct points from a user
export async function deductPoints(
  userId: number,
  pointsToDeduct: number
): Promise<boolean> {
  const user = await findMemberById(userId);

  if (!user || user.points == null) {
    throw new Error('User not found or points not available');
  }

  // Check if user has enough points
  if (user.points < pointsToDeduct) {
    throw new Error('Insufficient points');
  }

  // Deduct points
  user.points -= pointsToDeduct;

  // Save updated points
  const updatedUser = await user.save();

  return !!updatedUser;
}

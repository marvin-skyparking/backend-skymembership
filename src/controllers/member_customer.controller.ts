import { Request, Response } from 'express';
import {
  createMember,
  findMemberById,
  findMemberByUsernameOrEmail,
  updateMember,
  deleteMember,
  findExistingUser
} from '../services/member_customer.service';
import { BadRequest } from '../utils/response/common.response';

// Register  member
export async function handleCreateMember(req: Request, res: Response) {
  try {
    const email_valid = await findExistingUser(req.body.email);

    if (email_valid) {
      return BadRequest(res, 'Email already exists');
    }

    const phone_number = await findExistingUser(req.body.phone_number);

    if (phone_number) {
      return BadRequest(res, 'Phone number already exists');
    }

    const username = await findExistingUser(req.body.username);

    if (username) {
      return BadRequest(res, 'Username already exists');
    }

    const newMember = await createMember(req.body);
    res.status(201).json(newMember);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// Read member by ID
export async function handleFindMemberById(req: Request, res: Response) {
  const { id } = req.params;
  const member = await findMemberById(Number(id));

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  res.json(member);
}

// Read member by username or email
export async function handleFindMemberByUsernameOrEmail(
  req: Request,
  res: Response
) {
  const { usernameOrEmail } = req.params;
  const member = await findMemberByUsernameOrEmail(usernameOrEmail);

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  res.json(member);
}

// Update member
export async function handleUpdateMember(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const updatedMember = await updateMember(Number(id), req.body);

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(updatedMember);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// Delete member
export async function handleDeleteMember(req: Request, res: Response) {
  const { id } = req.params;

  const deletedCount = await deleteMember(Number(id));

  if (deletedCount === 0) {
    return res.status(404).json({ message: 'Member not found' });
  }

  res.status(204).send(); // No content
}

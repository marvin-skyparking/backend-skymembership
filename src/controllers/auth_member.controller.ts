import { Request, Response } from 'express'; // Make sure to import Request and Response
import { ILogin } from '../models/member_customer.model';
import {
  BadRequest,
  NotFound,
  ServerError,
  OK
} from '../utils/response/common.response';
import * as passwordUtils from '../utils/password.utils'; // Ensure correct import path
import * as jwtUtils from '../utils/jwt.utils';
import {
  findExistingUser,
  findMemberByUsernameOrEmail
} from '../services/member_customer.service';
import { sanitizeResponseUser } from '../utils/validator.utils';

export async function LoginMember(req: Request, res: Response) {
  try {
    const body = req.body as ILogin;

    // Validate input
    if (!body.username) {
      return BadRequest(res, 'Username or email cannot be empty.');
    }

    // Find user by username or email
    const user = await findMemberByUsernameOrEmail(body.username);

    if (!user) {
      return NotFound(res, 'User not found.');
    }

    if (!user.is_active) {
      return NotFound(res, 'Please activate your account first.');
    }

    // Validate password
    const validPassword = await passwordUtils.Compare(
      body.password,
      user.password
    );

    if (!validPassword) {
      return BadRequest(res, 'Username or password is incorrect.');
    }

    // Sanitize user response for safety
    const sanitizedResponse = await sanitizeResponseUser(user);

    // Generate JWT token
    const { token } = await jwtUtils.generate(sanitizedResponse, '24h');

    // Respond with success
    return OK(res, 'Login successful', {
      ...sanitizedResponse,
      token: token
    });
  } catch (error: any) {
    return ServerError(
      req,
      res,
      error?.message || 'An unexpected error occurred.',
      error
    );
  }
}

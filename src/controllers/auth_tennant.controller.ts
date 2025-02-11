import { NextFunction, Request, Response } from 'express'; // Make sure to import Request and Response
import { TLogin } from '../models/admin_tennant_model';
import { findMemberByUsernameOrEmail } from '../services/admin_tennant.service';
import jwtUtils from '../utils/jwt.utils';
import passwordUtils from '../utils/password.utils';
import {
  BadRequest,
  NotFound,
  OK,
  ServerError
} from '../utils/response/common.response';
import { sanitizeResponseTennat } from '../utils/validator.utils';

export async function LoginTennant(req: Request, res: Response): Promise<any> {
  try {
    const body = req.body as TLogin;

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

    if (user.tennant_code === null) {
      return NotFound(res, 'Silahkan Tunggu Admin Untuk Aktivasi');
    }

    // Validate password
    const validPassword = await passwordUtils.Compare(
      body.password,
      user.password
    );

    if (!validPassword) {
      return BadRequest(res, 'Username or password is incorrect.');
    }

    // Update last_login field
    await user.update({ last_login: new Date() });

    // Sanitize user response for safety
    const sanitizedResponse = await sanitizeResponseTennat(user);

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

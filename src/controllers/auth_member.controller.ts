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

export const authMiddleware = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Authorization header

  try {
    // Check if token exists
    if (!token) {
      return ServerError(req, res, 'Authorization token missing.');
    }

    // Validate the token using your jwtUtils
    const user = await jwtUtils.validateToken(token);

    // If token is invalid or no user found, send an error response
    if (!user) {
      return ServerError(req, res, 'Invalid token or user not found.');
    }

    // Attach the user object to the request object, so it can be accessed in other routes
    req.user = user;

    // If token is valid and user exists, return success response (instead of next)
    return res.status(200).json({ message: 'Token is valid', user });
  } catch (error: any) {
    // Handle any errors during the token validation process
    return res
      .status(401)
      .json({ message: 'Invalid Token', error: error.message });
  }
};

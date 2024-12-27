import { NextFunction, Request, Response } from 'express';
import jwtUtils from '../utils/jwt.utils';
import {
  BadRequest,
  Forbidden,
  OK,
  ServerError,
  Unauthorized
} from '../utils/response/common.response';
import User, { ILogin } from '../models/member_customer.model';
import { removeUploadedFiles } from './multer';

interface AuthenticatedRequest extends Request {
  user?: ILogin;
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // check apakah token itu ada
    if (!token) return Unauthorized(res, 'Session telah berakhir');

    // // check apakah token itu masih ada di remember user
    // const existSession = await RememberUserFind(authHeader);
    // if (!existSession) return Unauthorized(res, 'Session telah berakhir');

    const decoded = await jwtUtils.validateToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error?.message.includes('invalid signature')) {
      await Forbidden(res, 'Token tidak valid');
    } else if (error?.message.includes('expired')) {
      await Forbidden(res, 'Session telah berakhir');
    } else {
      await ServerError(req, res, 'something went wrong', error);
    }
  }
}

export const logout = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    return OK(res, 'Logout Successfully');
  } else {
    return BadRequest(res, 'Please Provide Token');
  }
};

export async function validateUserToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      ServerError(req, res, 'Authorization token missing.');
      return; // Stop further execution
    }

    const user = await jwtUtils.validateToken(token);

    if (!user) {
      ServerError(req, res, 'Invalid token or user not found.');
      return; // Stop further execution
    }

    req.user = user; // Attach the user object to the request

    next(); // Pass control to the next middleware
  } catch (err) {
    ServerError(req, res, 'Token validation failed.');
    return; // Stop further execution
  }
}

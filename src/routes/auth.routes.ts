import express from 'express';
import {
  authMiddleware,
  LoginMember
} from '../controllers/auth_member.controller';
import { validateToken } from '../utils/jwt.utils';

const authRouter = express.Router();

authRouter.post('/login', LoginMember);
authRouter.post('/verify-token', authMiddleware);

export default authRouter;

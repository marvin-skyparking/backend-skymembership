import express from 'express';
import { LoginMember } from '../controllers/auth_member.controller';

const authRouter = express.Router();

authRouter.post('/login', LoginMember);

export default authRouter;

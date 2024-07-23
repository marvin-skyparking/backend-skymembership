import { Request, Response } from 'express';
import { findUser } from '../services/customer.service';
import passwordUtils, { Compare } from '../utils/password.utils';
import jwtUtils from '../utils/jwt.utils';
import { ILogin } from '../models/customer.model';
import { BadRequest, NotFound, OK, ServerError } from '../utils/response/common.response';
import { sanitizeUser } from '../utils/validator.utils';

export async function login(req: Request, res: Response): Promise<any> {
    
    const body = req.body as ILogin;

    try {
        // Find user by username or email
        const user = await findUser({username: body.username});

        if (!user) {
            return NotFound(res,'User Not Found');
        }

        // Validate password
        const validPassword = await passwordUtils.Compare(
            body.password,
            user?.password
          );
      

        if (!validPassword) {
            return BadRequest(res,'Invalid Password')
        }

        const dataUser = await sanitizeUser(user.dataValues)
        // Generate JWT token
        const { token } = await jwtUtils.generate(dataUser, '24h');

        console.log(dataUser)
        // Return token and user details
        return OK(res,'Login Success',{
            token,
            user: {
                id: user.id,
                username: user.username,
                phoneNumber: user.phoneNumber
            },
        });
    } catch (error:any) {
        return ServerError(req, res, error?.message, error);
    }
}

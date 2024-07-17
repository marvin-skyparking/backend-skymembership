import { Request, Response } from 'express';
import { createUser } from '../services/customer.service';
import { BadRequest, OK, ServerError } from '../utils/response/common.response';
import { sanitizeUser } from '../utils/validator.utils';

export async function registerUser(req: Request, res: Response): Promise<any> {
   
    const { name, username, password, address, email, confirmPassword, phoneNumber } = req.body;
    try {
        if(password !==confirmPassword){
            return BadRequest(res,'Password dan Confirm Password Tidak Sama')
        }

        const newUser = await createUser({ name, username, password, address, email, phoneNumber });
        
        const DataUser = await sanitizeUser(newUser)

        return OK(res, 'Data User', DataUser)
    } catch (error:any) {
        return ServerError(req, res, error?.message, error);
    }
}

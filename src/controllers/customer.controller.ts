import { Request, Response } from 'express';
import { createUser, addPin } from '../services/customer.service';
import { BadRequest, NotFound, OK, ServerError, Unauthorized } from '../utils/response/common.response';
import { BuyProductPayload } from '../models/payment.model';
import { sanitizeUser } from '../utils/validator.utils';
import jwtUtils from '../utils/jwt.utils';
import {createMembershipCard, fetchExpirationDate } from '../services/membershipCard.service';
import { endMonth,removeCountryCode,extractNumbers, getEndOfMonthString, customLengthTrxId} from '../utils/helper.utils';
import { CreateVARequest } from '../ThirdParty/BayarINDPaymentGateway';
import { createVirtualAccount } from '../services/payment.service';

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
  
export async function addPins(req: Request, res: Response): Promise<any> {
    
    const authHeader = req.headers['authorization'];
    const jwttoken = authHeader && authHeader.split(' ')[1];

    if (!jwttoken) return Unauthorized(res, 'Session telah berakhir');

    const decoded = await jwtUtils.validateToken(jwttoken);
    
    const userId = decoded.id

    try {
        
      const {pin } = req.body;
      const user = await addPin(userId, pin);
      if (user) {
        return OK(res,"Success Add Pin")
      } else {
        return NotFound(res,'user not found')
      }
    } catch (error: any) {
      return ServerError(req, res, error?.message, error); 
    }
  }
  


  export async function BuyProducts(req: Request, res: Response): Promise<any> {
    try {
      const authHeader = req.headers['authorization'];
      const jwttoken = authHeader && authHeader.split(' ')[1];
  
      if (!jwttoken) return Unauthorized(res, 'Session telah berakhir');
  
      const decoded = await jwtUtils.validateToken(jwttoken)
      const phoneNumber = decoded.phoneNumber
  
     
      // Assert the type of req.body
      const payload = req.body as BuyProductPayload;
      const customerId =extractNumbers(payload.licensePlate)+removeCountryCode(phoneNumber)
      const priceProductString = Number(payload.priceProduct).toFixed(2);



      const ValidationMember = await fetchExpirationDate(payload.locationCode,customerId,payload.vehicleType)
      
      if (ValidationMember) {
        return BadRequest(res, "Anda Masih Punya Member Aktif Pada Lokasi Tersebut")
      }

      //Insertto Membership
      const newMembershipCard = await createMembershipCard({
        customerNo: customerId, // Assuming customerNo is set to userId for simplicity
        paymentStatus: 'Pending', // Set as per your business logic
        CardStatus: 'InActive', // Set as per your business logic
        RFID_Data: '', // Set or generate RFID data as needed
        vehicleType: payload.vehicleType,
        locationCode: payload.locationCode,
        isActive: false,
        expired: endMonth
      });


      const requestData: CreateVARequest = {
        partnerServiceId: payload.bankId, // Assuming `partnerServiceId` is from payload
        customerNo: customerId, // Assuming `customerId` is correctly set
        virtualAccountNo: payload.bankId+ customerId, // Adjust as needed
        virtualAccountName: decoded.username,
        virtualAccountEmail: decoded.email,
        trxId:"", 
        totalAmount: {
            value: priceProductString, // Ensure this is a string
            currency: 'IDR' // Set the currency code as needed
        },
        expiredDate: getEndOfMonthString(), // Ensure this returns the correct date string
        billDetails: [
            {
                billDescription: {
                    english: "PaymentSkyparkingMember", // Adjust description as needed
                    indonesia: "PembayaranSkyparkingMember" // Adjust description as needed
                }
            }
        ],
        additionalInfo: {} // Add any additional info if needed
    };

    
    const virtualAccountResponse = await createVirtualAccount(requestData,decoded.username,decoded.email);
  
      res.status(200).json({
        message: 'Product purchase processed successfully',
        virtualAccountResponse
        // result
      });
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }
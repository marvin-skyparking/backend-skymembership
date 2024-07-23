import { Request, Response } from 'express';
import { generateStringToSigns, verifySymmetricSignature,signAsymmetricSignature, PaymentRequest, Headers, CreateVARequest } from '../ThirdParty/BayarINDPaymentGateway'
import axios from 'axios';
import moment from 'moment-timezone'; 
import { createPayment } from '../services/payment.service';
import { PaymentAttributes } from '../models/payment.model';
import { Unauthorized } from '../utils/response/common.response';
import jwtUtils from '../utils/jwt.utils';
import { customLengthTrxId, generateRandomNumber } from '../utils/helper.utils';

const getCurrentTimestamp = (): string => {
    return moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ssZ');
};


export async function createVirtualAccount(req: Request, res: Response): Promise<any> {
    try {

        const authHeader = req.headers['authorization'];
        const jwttoken = authHeader && authHeader.split(' ')[1];

         // check apakah token itu ada
        if (!jwttoken) return Unauthorized(res, 'Session telah berakhir');

        const decoded = await jwtUtils.validateToken(jwttoken);
       
        const { partnerServiceId, customerNo, virtualAccountNo, virtualAccountName, virtualAccountEmail,
            trxId, totalAmount, expiredDate, billDetails, additionalInfo } = req.body;

        
        const timestamp = getCurrentTimestamp()

        const paddedPartnerServiceId = partnerServiceId.padStart(8, ' ');
        const paddedVirtualAccountNo = (paddedPartnerServiceId + customerNo).padStart(8, ' ');
        
        const requestBody: CreateVARequest = {
            partnerServiceId:paddedPartnerServiceId,
            customerNo,
            virtualAccountNo:paddedVirtualAccountNo,
            virtualAccountName:decoded.username,
            virtualAccountEmail:decoded.email,
            trxId:customLengthTrxId,
            totalAmount,
            expiredDate,
            billDetails,
            additionalInfo,
        };

        const httpMethod = 'POST'
        const endpoint = '/api/v1.0/transfer-va/create-va'

        const stringToSign = generateStringToSigns(httpMethod,endpoint,requestBody,timestamp)
        const signature = signAsymmetricSignature(stringToSign);
        const isSignatureValid = verifySymmetricSignature(signature, stringToSign);
        const externalID = generateRandomNumber(20)
 
        
         if (!isSignatureValid) {
                return res.status(400).json({ message: 'Invalid signature' });
        }
        const headers = {
            'Accept': '*/*',
            'Content-type':'application/json',
            'X-TIMESTAMP':timestamp,
            'X-SIGNATURE':signature,
            'X-PARTNER-ID':'SKYPABVA01', // Replace with your partner ID
            'X-EXTERNAL-ID':externalID, // Replace with your external ID
            'CHANNEL-ID':'1021', // Replace with your channel ID
        };

        const response = await axios.post(`https://snaptest.bayarind.id/api/v1.0/transfer-va/create-va`, requestBody, {
            headers,
        });


        const paymentData = response.data.virtualAccountData;
        
        const formattedPaymentData: PaymentAttributes = {
            price: paymentData.totalAmount.value, // Assuming price is a string
            customerNo: paymentData.customerNo,
            virtualAccountNo: paymentData.virtualAccountNo.trim(), // Remove extra spaces
            name: paymentData.virtualAccountName,
            username: paymentData.virtualAccountName,
            signToString: signature || '', // Provide default values if necessary
            xtimestamp: timestamp, // Provide default values if necessary
            xexternalid: externalID || '', // Provide default values if necessary
            AsymetricSignature: signature || '', // Provide default values if necessary
            channelId: "1021" || '', // Provide default values if necessary
            status_payment:'Pending', // Provide default values if necessary
            //trxDateTime: paymentData.trxDateTime ? new Date(paymentData.trxDateTime) : null,
            //flagAdvise: paymentData.flagAdvise || null,
            //billDetails: paymentData.billDetails || null,
            //additionalInfo: paymentData.additionalInfo || null,
            //refernceNo: paymentData.refernceNo || null,
            //tagID: paymentData.tagID || null,
            //flagType: paymentData.flagType || null,
        };
        // Add any other required fields that exist in PaymentAttributes
        const createdPayment = await createPayment(formattedPaymentData)
        console.log(decoded)
        res.status(200).json(paymentData);
        
    } catch (error) {
        console.error('Error creating virtual account:', error);
        res.status(500).json({ error: 'Failed to create virtual account' });
    }
}



export async function PaymentRequest(req: Request, res: Response): Promise<any> {
    try {
        const { partnerServiceId, customerNo, virtualAccountNo, virtualAccountName, virtualAccountEmail,
            trxId, totalAmount, expiredDate, billDetails, additionalInfo } = req.body;

        const timestamp = getCurrentTimestamp()

        const paddedPartnerServiceId = partnerServiceId.padStart(8, ' ');
        const paddedVirtualAccountNo = (paddedPartnerServiceId + customerNo).padStart(8, ' ');
        
        const requestBody: CreateVARequest = {
            partnerServiceId:paddedPartnerServiceId,
            customerNo,
            virtualAccountNo:paddedVirtualAccountNo,
            virtualAccountName,
            virtualAccountEmail,
            trxId,
            totalAmount,
            expiredDate,
            billDetails,
            additionalInfo,
        };

        const httpMethod = 'POST'
        const endpoint = '/api/v1.0/transfer-va/payment'

        const stringToSign = generateStringToSigns(httpMethod,endpoint,requestBody,timestamp)
        const signature = signAsymmetricSignature(stringToSign);
        const isSignatureValid = verifySymmetricSignature(signature, stringToSign);
        
        
        
         if (!isSignatureValid) {
                return res.status(400).json({ message: 'Invalid signature' });
        }
        const headers = {
            'Accept': '*/*',
            'Content-type':'application/json',
            'X-TIMESTAMP':'2024-07-17T11:02:28+07:00',
            'X-SIGNATURE':'xvrk7Mw7BTqwrIXdFgxdCh+b2vGJpk583ZQSAumk52Stdp+MasB8G0iVC2ISFOHk4zxXn+5iOpgxAlABhT14FRt9scsP5MgtgveX+bIT+UG/tquPRUcYZrOaJGO4ICDJkU/kR+qkV+G5FLeEqDLVbLL2LnsPg6Jl1+2GOeY22pXjozPNj/rMT99F1WsDb0v64AFl1TWpwYb2dERqLjA+mUaI+TrHx0YIyCvftvYkNJmaetq2K1tRKPDvIrVmP4TNKDjVn0ZSt7WEIH168FwlKCTlWxNVODc1ynDBZrsbJn+y1Oc5K9dZpYUSdtN10heIa86+8YS/xMXBEEKyD4uJ2g==',
            'X-PARTNER-ID':'SKYPABVA01', // Replace with your partner ID
            'X-EXTERNAL-ID':'202407151721013764421', // Replace with your external ID
            'CHANNEL-ID':'1021', // Replace with your channel ID
        };

        const response = await axios.post(`https://snaptest.bayarind.id/api/v1.0/transfer-va/transfer`, requestBody, {
            headers,
        });
        
        console.log(stringToSign)
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error creating virtual account:', error);
        res.status(500).json({ error: 'Failed to create virtual account' });
    }
}
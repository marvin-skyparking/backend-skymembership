import Payment, { PaymentAttributes } from '../models/payment.model';
import { CreateVARequest, generateStringToSigns, signAsymmetricSignature, verifySymmetricSignature } from '../ThirdParty/BayarINDPaymentGateway';
import { generateRandomNumber, getCurrentTimestamp } from '../utils/helper.utils';
import axios from 'axios';
import { sanitizeVirtualAccountResponse } from '../utils/validator.utils';

async function createPayment(paymentData: PaymentAttributes): Promise<Payment> {
    try {
        const payment = await Payment.create(paymentData);
        return payment;
    } catch (error) {
        throw new Error(`Failed to create payment: ${error}`);
    }
}

async function getPaymentById(id: string): Promise<Payment | null> {
    try {
        const payment = await Payment.findByPk(id);
        return payment;
    } catch (error) {
        throw new Error(`Failed to fetch payment: ${error}`);
    }
}

async function updatePayment(id: string, updateData: Partial<PaymentAttributes>): Promise<Payment | null> {
    try {
        const payment = await Payment.findByPk(id);
        if (payment) {
            await payment.update(updateData);
        }
        return payment;
    } catch (error) {
        throw new Error(`Failed to update payment: ${error}`);
    }
}

async function deletePayment(id: string): Promise<number> {
    try {
        const result = await Payment.destroy({
            where: {
                id
            }
        });
        return result;
    } catch (error) {
        throw new Error(`Failed to delete payment: ${error}`);
    }
}


export async function createVirtualAccount(payload: CreateVARequest, username: string, email: string): Promise<any> {
    try {
        const timestamp = getCurrentTimestamp();
        const paddedPartnerServiceId = payload.partnerServiceId.padStart(8, ' ');
        const paddedVirtualAccountNo = (paddedPartnerServiceId + payload.customerNo).padStart(8, ' ');
        const externalID = generateRandomNumber(20)
        
        // Construct the request body
        const requestBody: CreateVARequest = {
            ...payload,
            trxId:externalID,
            partnerServiceId: paddedPartnerServiceId,
            virtualAccountNo: paddedVirtualAccountNo,
            virtualAccountName: username,
            virtualAccountEmail: email,
        };

        
        const httpMethod = 'POST';
        const endpoint = '/api/v1.0/transfer-va/create-va';
        const stringToSign = generateStringToSigns(httpMethod, endpoint, requestBody, timestamp);
        const signature = signAsymmetricSignature(stringToSign);
        const isSignatureValid = verifySymmetricSignature(signature, stringToSign);

        if (!isSignatureValid) {
            throw new Error('Invalid signature');
        }

        const headers = {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'X-TIMESTAMP': timestamp,
            'X-SIGNATURE': signature,
            'X-PARTNER-ID': 'SKYPABVA01',
            'X-EXTERNAL-ID': externalID,
            'CHANNEL-ID': '1021',
        };

        // Send the request
        const response = await axios.post('https://snaptest.bayarind.id/api/v1.0/transfer-va/create-va', requestBody, { headers });

        
        // Process the response data
        const paymentData = response.data.virtualAccountData;



        const formattedPaymentData: PaymentAttributes = {
            price: paymentData.totalAmount.value,
            customerNo: paymentData.customerNo,
            virtualAccountNo: paymentData.virtualAccountNo.trim(),
            name: paymentData.virtualAccountName,
            username: paymentData.virtualAccountName,
            signToString: signature || '',
            xtimestamp: timestamp,
            xexternalid: externalID || '',
            AsymetricSignature: signature || '',
            channelId: '1021',
            status_payment: 'Pending',
        };
        const createdPayment = await createPayment(formattedPaymentData)

        const clearPayment = sanitizeVirtualAccountResponse(createdPayment)

        return clearPayment;

    } catch (error) {
        console.error('Error creating virtual account:', error);
        throw new Error('Failed to create virtual account');
    }
}

export {
    createPayment,
    getPaymentById,
    updatePayment,
    deletePayment
};

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface PaymentRequest {
  partnerServiceId: string;
  customerNo: string;
  virtualAccountNo: string;
  trxDateTime: string;
  channelCode: string;
  paymentRequestId: string;
  paidAmount: {
    value: string;
    currency: string;
  };
  trxId: string;
  journalNum: string;
  referenceNo: string;
  flagAdvise: string;
  additionalInfo: {
    insertId: string;
    tagId: string;
    flagType: string;
  };
}

export interface Headers {
  'Content-type': string;
  'X-TIMESTAMP': string;
  'X-SIGNATURE': string;
  'X-PARTNER-ID': string;
  'X-EXTERNAL-ID': string;
  'CHANNEL-ID': string;
}

interface Amount {
    value: string;
    currency: string;
}

interface BillDescription {
    english: string;
    indonesia: string;
}

interface BillDetails {
    billDescription: BillDescription;
}

export interface CreateVARequest {
    partnerServiceId: string;
    customerNo: string;
    virtualAccountNo: string;
    virtualAccountName: string;
    virtualAccountEmail: string;
    trxId: string;
    totalAmount: Amount;
    expiredDate: string;
    billDetails: BillDetails[];
    additionalInfo: object;
}



// Hash the request body using SHA-256 and convert to lowercase
const hashSHA256 = (data: string): string => {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex').toLowerCase();
};



// Define the path to your public key file
const publicKeyPath = path.join(__dirname, 'sky-public.pub');
const privateKeyPath = path.join(__dirname, 'sky-private.pem');

// Read the public key file
const PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');
const PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');



export function generateStringToSigns(httpMethod: string, relativePath: string, requestBody: object, timestamp: string): string {
    const minifiedRequestBody = JSON.stringify(requestBody);
    const hashedRequestBody = hashSHA256(minifiedRequestBody);
    const lowercaseHashBody = hashedRequestBody.toLowerCase();
    return `${httpMethod}:${relativePath}:${lowercaseHashBody}:${timestamp}`;
};


export function signAsymmetricSignature(stringToSign: string): string {
    const sign = crypto.createSign('SHA256');
    sign.update(stringToSign);
    sign.end();
    const signature = sign.sign(PRIVATE_KEY, 'base64');
    return signature;
}

export function verifySymmetricSignature(signature: string, stringToSign: string): boolean {
  try {
    const verifier = crypto.createVerify('sha256');
    verifier.update(stringToSign);
    verifier.end();
    const isValid = verifier.verify(PUBLIC_KEY, Buffer.from(signature, 'base64'));
    return isValid;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

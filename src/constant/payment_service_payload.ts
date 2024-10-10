//Payload Should Send On Payment Service
export interface VirtualAccountDetails {
  customerNo: string; // Customer number
  virtualAccountName: string; // Name associated with the virtual account
  virtualAccountEmail: string; // Email associated with the virtual account
  totalAmount: string; // Total amount as a string
  AppModule: string;
  ExpiredDate: string;
  Invoice: string;
  Payment_using: string;
}

// Get Status VA
export interface CustomerTransactionDetails {
  customerNo: string; // Customer number
  additionalInfo: AdditionalInfo[]; // Array of additional transaction info
}

interface AdditionalInfo {
  trxId: string; // Transaction ID
  trxDateInit: string; // Transaction date in ISO 8601 format
}

import moment from 'moment-timezone';   

export function generateRandomNumber(length: number): string {
    const digits = '0123456789';
    let randomNumber = '';

    // Ensure the length is positive
    if (length <= 0) {
        throw new Error('Length must be a positive integer.');
    }

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        randomNumber += digits[randomIndex];
    }

    return randomNumber;
}

function getEndOfMonth(): Date {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return endOfMonth;
  }


  export const isNotExpired = (expirationDate: string): boolean => {
    const now = moment().tz('Asia/Jakarta');
    const expDate = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta');
    return now.isBefore(expDate);
};

  export function removeCountryCode(phoneNumber: any): string {
    // Ensure phoneNumber is a string
    if (typeof phoneNumber !== 'string') {
      throw new Error('Invalid phone number format');
    }
  
    // Define the country code to remove, e.g., +62 for Indonesia
    const countryCode = '+62';
  
    // Check if the phone number starts with the country code
    if (phoneNumber.startsWith(countryCode)) {
      // Remove the country code
      return phoneNumber.slice(countryCode.length);
    }
  
    // Return the phone number as is if it doesn't start with the country code
    return phoneNumber;
  }


export function extractNumbers(licensePlate: string): string {
    // Use a regular expression to match all digits
    return licensePlate.replace(/\D/g, '');
  }


export const getCurrentTimestamp = (): string => {
    return moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ssZ');
};

export const convertToDecimal = (priceProductString: string): number => {
    const decimalValue = parseFloat(priceProductString);
    if (isNaN(decimalValue)) {
        throw new Error('Invalid number format');
    }
    return decimalValue;
};


export const getEndOfMonthString = (): string => {
    const endOfMonth = moment().endOf('month'); // Get the end of the current month
    return endOfMonth.format('YYYY-MM-DDTHH:mm:ssZ'); // Format as YYYY-MM-DDTHH:mm:ssZ
};

export const customLengthTrxId = generateRandomNumber(8);
export const endMonth = getEndOfMonth();
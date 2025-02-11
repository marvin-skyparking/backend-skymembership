import { Request, Response } from 'express';
import {
  activateTennant,
  findExistingUser,
  findTennantByActivationToken,
  findTennantById
} from '../services/admin_tennant.service';
import {
  BadRequest,
  NotFound,
  OK,
  ServerError
} from '../utils/response/common.response';
import { createAdminTennant } from '../services/admin_tennant.service';
import jwtUtils from '../utils/jwt.utils'; // Assuming the generate function is here
import { sendMail } from '../utils/mail.utils';
import EnvConfig from '../configs/env.config'; // Configuration
import { getMembershipProductById } from '../services/membership_product.service';
import { generateRandomNumber } from '../utils/helper.utils';
import {
  StatusPayment,
  StatusProgress,
  TennantPurchaseHistoryCreateInput
} from '../models/tennant_history_purchase.model';
import { VirtualAccountDetails } from '../constant/payment_service_payload';
import axios from 'axios';
import { Endpoint_BayarIND } from '../Payment_Service/api_services';
import { getLocationAreaByCode } from '../services/location_area.service';
import { purchase_types } from '../models/transaction_history_member.model';
import { createPurchaseHistory } from '../services/tennant_transaction_history.service';

// Register member and send activation token
export async function handleCreateTennant(
  req: Request,
  res: Response
): Promise<any> {
  try {
    // Check if email, phone number, or username already exists
    const emailExists = await findExistingUser(req.body.email);
    if (emailExists) {
      return BadRequest(res, 'Email already exists');
    }

    const phoneExists = await findExistingUser(req.body.phone_number);
    if (phoneExists) {
      return BadRequest(res, 'Phone number already exists');
    }

    const usernameExists = await findExistingUser(req.body.username);
    if (usernameExists) {
      return BadRequest(res, 'Username already exists');
    }

    // Generate the activation token
    const activationToken = await jwtUtils.generate(
      { email: req.body.email, username: req.body.username },
      '1h' // Ensure this is passed as a valid string or number
    );

    // Add the activationToken to the request body before creating the new member
    req.body.activation_token = activationToken; // Attach the token to the member data

    // Create new tenant with the activation token
    const newMember = await createAdminTennant(req.body);

    // Make sure activationToken is a string and properly included in the URL
    const activationUrl = `${EnvConfig.APP_URL}/v1/tennant/activate-tennant/${activationToken.token.replace('Bearer ', '')}`;

    const emailContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="text-align: center; padding-bottom: 20px;">
      <img src="cid:logo" alt="SKY Parking Logo" style="width: 150px;" />
    </div>
    <h2 style="color: #333;">Hi, ${newMember.username}</h2>
    <p style="color: #555;">
      Terima kasih telah menggunakan layanan membership <strong>SKY PARKING</strong>. Kami sangat senang menyambut kamu!
      Sebelum kamu bisa menikmati semua keuntungan sebagai member, silakan aktifkan akunmu dengan mengklik tombol di bawah ini.
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${activationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
        Aktifkan Akun
      </a>
    </div>
    <p style="color: #555;">
      Jika kamu mengalami masalah atau butuh bantuan lebih lanjut, jangan ragu untuk menghubungi kami.
    </p>
    <p style="color: #555;">
      Best Regards,<br/>
      <strong>SKY Parking Utama</strong>
    </p>
  </div>
`;

    const mailOptions = {
      from: EnvConfig.EMAIL_USER,
      to: newMember.email,
      subject: 'Activate Your SKY Parking Account',
      html: emailContent,
      attachments: [
        {
          filename: 'logo.png', // Name of the file to be shown in email
          path: './images/logo.png', // Path to the logo image in your local directory
          cid: 'logo' // Content-ID used in the email body
        }
      ]
    };

    // Send activation email
    await sendMail(newMember.email, 'Account Activation', emailContent);

    // Filter response to exclude sensitive fields
    const responsePayload = {
      tennant_name: newMember.tennant_name,
      address: newMember.address,
      email: newMember.email,
      username: newMember.username,
      phone_number: newMember.phone_number,
      customer_no: newMember.customer_no
    };

    return OK(
      res,
      'Success Registration. Please check your email for activation.',
      responsePayload
    );
  } catch (error: any) {
    console.error(error); // Log the error to help with debugging
    return res.status(400).json({ error: error.message });
  }
}

export async function handleActivateTennant(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const { activationToken } = req.params;

    if (!activationToken) {
      return BadRequest(res, 'Activation token is required.');
    }

    // Verify the activation token
    const decodedToken = jwtUtils.validateToken(activationToken); // Use your JWT secret key to verify the token

    if (!decodedToken) {
      return BadRequest(res, 'Invalid or expired activation token.');
    }

    // Find the tenant by activation token (assuming your model stores the token with the user)
    const tenant = await findTennantByActivationToken(activationToken);

    if (!tenant) {
      return BadRequest(res, 'No tenant found for this token.');
    }

    // Activate the tenant account
    const activatedTenant = await activateTennant(tenant.id); // This function should set the tenant as activated in your database

    // Return a success response
    return OK(res, 'Account activated successfully.', {
      username: activatedTenant.username,
      email: activatedTenant.email
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getListMember(req: Request, res: Response): Promise<any> {
  try {
    const user = req.user;

    if (!user) {
      return NotFound(res, 'Invalid token or user not found.');
    }
  } catch (error: any) {
    return ServerError(req, res, error);
  }
}

export async function Purchase_product(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const product_id = req.params.id;
    const { amount, bank_id } = req.body;

    // Validate Product
    const check_product = await getMembershipProductById(Number(product_id));
    if (!check_product) {
      return BadRequest(res, 'Product not found');
    }
    if (new Date(check_product.end_date) < new Date()) {
      return BadRequest(res, 'Periode Produk Tersebut Sudah Tidak Berlaku');
    }

    // Validate Tennant
    const user = req.user;
    if (!user) {
      return ServerError(req, res, 'Invalid token or user not found.');
    }

    const user_data = await findTennantById(user.id);
    if (!user_data) {
      return ServerError(req, res, 'Invalid token or user not found.');
    }

    const add_invoice = 'INV/MEMBERSHIP_B2B/' + generateRandomNumber(10);

    // Expiration Transaction
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 1);
    const formattedExpiredDate =
      expiredDate.toISOString().slice(0, 19) + '+07:00';

    // Get Payment Services Data Partner
    const data_bank = `${EnvConfig.PAYMENT_SERVICE_URL}${Endpoint_BayarIND.get_payment_services_id}${bank_id}`;
    const response_bank = await axios.get(data_bank);

    const total_prices = req.body.amount * check_product.price;
    const total_admin_fees = response_bank.data.admin_fee * req.body.amount;

    const payment_data: VirtualAccountDetails = {
      customerNo: user_data.customer_no,
      virtualAccountName: user_data.username,
      virtualAccountEmail: user_data.email,
      ExpiredDate: formattedExpiredDate,
      totalAmount: (total_prices + total_admin_fees).toString(),
      AppModule: 'APP_MEMBERSHIP',
      Invoice: add_invoice,
      Payment_using: response_bank.data.type_payment
    };

    const url = `${EnvConfig.PAYMENT_SERVICE_URL}${Endpoint_BayarIND.create_va}${bank_id}`;

    const response = await axios.post(url, payment_data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = response.data;

    const location_name = await getLocationAreaByCode(
      check_product.location_code
    );

    const create_transaction: TennantPurchaseHistoryCreateInput = {
      user_id: user.id,
      virtual_account_number:
        result.paymentData.virtualAccountData.virtualAccountNo?.trim() ||
        result.paymentData.virtualAccountData.virtual_account_number.trim(),
      virtual_account_name: user_data.username,
      trx_id:
        result.paymentData.virtualAccountData?.trxId ||
        result.paymentData.virtualAccountData.trx_id,
      expired_date: formattedExpiredDate,
      timestamp: new Date(),
      product_name: check_product.product_name,
      periode: `${check_product.start_date} To ${check_product.end_date}`,
      invoice_id: payment_data.Invoice,
      status_payment: StatusPayment.PENDING,
      type_payment: response_bank.data.type_payment,
      purchase_type: 'B2B Membership',
      amount: amount,
      price: check_product.price.toString(),
      admin_fee: response_bank.data.admin_fee,
      total_price: (total_prices + total_admin_fees).toString(),
      total_admin_fee: total_admin_fees.toString(),
      status_progress: StatusProgress.INITIATED
    };

    const transaction_data = await createPurchaseHistory(create_transaction);

    return res.status(200).json({
      status: true,
      message: 'Successfully Created Transaction',
      data: {
        transaction_data // Spread the existing transaction data
      }
    });
  } catch (error: any) {
    console.error('Error processing purchase:', error);
    return ServerError(req, res, 'Error initiating purchase.', error.message);
  }
}

// export async function Extended_Product(
//   req: Request,
//   res: Response
// ): Promise<any> {
//   try {
//     const product_id = req.params.id;
//     const { no_card } = req.body;

//     // Validate if no_card is an array and has at least one card
//     if (!Array.isArray(no_card) || no_card.length === 0) {
//       return BadRequest(res, 'No cards provided. Please select at least one card.');
//     }

//     // Validate Product
//     const check_product = await getMembershipProductById(Number(product_id));
//     if (!check_product) {
//       return BadRequest(res, 'Product not found');
//     }
//     if (new Date(check_product.end_date) < new Date()) {
//       return BadRequest(res, 'Periode Produk Tersebut Sudah Tidak Berlaku');
//     }

//     // Validate Tenant
//     const user = req.user;
//     if (!user) {
//       return ServerError(req, res, 'Invalid token or user not found.');
//     }

//     const user_data = await findTennantById(user.id);
//     if (!user_data) {
//       return ServerError(req, res, 'Invalid token or user not found.');
//     }

//     // Process each card
//     const results = [];
//     for (const card of no_card) {
//       // Example of processing logic per card
//       const cardResult = await processCardExtension(product_id, card, user_data);
//       results.push(cardResult);
//     }

//     // Return successful response with processed card details
//     return res.status(200).json({
//       message: 'Product extension processed successfully.',
//       processedCards: results
//     });

//   } catch (error: any) {
//     console.error('Error processing product extension:', error);
//     return ServerError(req, res, 'Error initiating product extension.', error.message);
//   }
// }

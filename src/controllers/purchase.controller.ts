import { Request, Response } from 'express'; // Make sure to import Request and Response
import { getMembershipProductById } from '../services/membership_product.service';
import {
  deductPoints,
  findMemberById,
  updateMemberPoints
} from '../services/member_customer.service';
import {
  BadRequest,
  NotFound,
  OK,
  ServerError
} from '../utils/response/common.response';
import jwtUtils from '../utils/jwt.utils';
import axios from 'axios';
import { VirtualAccountDetails } from '../constant/payment_service_payload';
import EnvConfig from '../configs/env.config';
import { Endpoint_BayarIND } from '../Payment_Service/api_services';
import {
  generateRandomNumber,
  generateRandomNumberFromPlate
} from '../utils/helper.utils';
import {
  changePaymentFailedExpired,
  createTransaction,
  getTransactionByInvoiceId,
  updateTransactionByTrxId
} from '../services/transaction_customer_history.service';
import {
  purchase_types,
  Type_Payment
} from '../models/transaction_history_member.model';
import { CustomerMembershipCreation } from '../models/customer_membership.model';
import {
  createCustomerMembership,
  getCustomerMembershipByPlateNumber
} from '../services/customer_membership.service';
import { CustomerMembershipDetailCreation } from '../models/customer_membership_detail.model';
import {
  upsertMembershipDetail,
  getCustomerMembershipByCustMemberAndLocation,
  updateMembershipDetailByInvoiceId,
  updateMembershipDetailByUserId
} from '../services/customer_membership_details.service';
import { removeUploadedFiles } from '../middleware/multer';
import { DateTimes } from '../utils/date.utils';
import { getLocationAreaByCode } from '../services/location_area.service';

export async function Purchase_product_By_Points(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const { id: product_id } = req.params;
    const { bank_id, plate_number } = req.body;

    // Get Payment Services Data Partner
    const {
      data: { partner_key }
    } = await axios.get(
      `${EnvConfig.PAYMENT_SERVICE_URL}${Endpoint_BayarIND.get_payment_services_id}${bank_id}`
    );

    if (partner_key !== 'SKYPOINTS') {
      return BadRequest(res, 'Wrong Payment Services');
    }

    // Validate Product
    const check_product = await getMembershipProductById(Number(product_id));
    if (!check_product || new Date(check_product.end_date) < new Date()) {
      return BadRequest(
        res,
        check_product
          ? 'Periode Produk Tersebut Sudah Tidak Berlaku'
          : 'Product not found'
      );
    }

    // Validate User
    const user = req.user;
    if (!user || !(await findMemberById(user.id))) {
      return ServerError(req, res, 'Invalid token or user not found.');
    }

    // Check Vehicle Registration
    const get_vehicle_member =
      await getCustomerMembershipByPlateNumber(plate_number);
    if (!get_vehicle_member) return NotFound(res, 'Vehicle Not Exist');

    const check_product_existence =
      await getCustomerMembershipByCustMemberAndLocation(
        get_vehicle_member.id,
        check_product.location_code
      );

    // Validate Expired Payment
    const validate_expired_payment = await getTransactionByInvoiceId(
      check_product_existence?.invoice_id ?? ''
    );
    if (
      check_product_existence?.is_active === false &&
      validate_expired_payment?.expired_date &&
      new Date(validate_expired_payment.expired_date) > new Date()
    ) {
      return BadRequest(res, 'Silahkan Lakukan Pembayaran Lebih dahulu');
    }

    // Check if already registered
    if (check_product_existence?.is_active === true)
      return BadRequest(
        res,
        'Anda Sudah Terdaftar Silahkan Lakukan Perpanjangan'
      );

    // Deduct Points
    const deduct_points = await findMemberById(user.id);
    if (!deduct_points?.points || deduct_points.points <= check_product.price)
      return BadRequest(res, 'POINT Tidak Cukup');

    if (!(await deductPoints(user.id, check_product.price))) {
      return BadRequest(res, 'Failed Deduct Point');
    }

    const location_names = await getLocationAreaByCode(
      check_product.location_code
    );

    if (!location_names) {
      return BadRequest(res, 'location Not Found');
    }

    // Create Membership Detail
    const add_invoice = `INV/MEMBERSHIP/${generateRandomNumber(10)}`;
    const membership_detail_creation = await upsertMembershipDetail({
      Cust_Member: get_vehicle_member.id,
      member_customer_no: get_vehicle_member.member_customer_no,
      location_id: check_product.location_code,
      location_name: location_names.location_name,
      invoice_id: add_invoice,
      kid: check_product.KID,
      is_active: true,
      start_date: check_product.start_date,
      end_date: check_product.end_date
    });

    if (!membership_detail_creation)
      return ServerError(req, res, 'Error Registering Member Detail.');

    const location_name = await getLocationAreaByCode(
      check_product.location_code
    );

    // Create Transaction History
    const transaction_data = await createTransaction({
      user_id: user.id,
      virtual_account: '',
      trxId: generateRandomNumber(16),
      expired_date: new Date().toString(),
      timestamp: new Date(),
      price: check_product.price.toString(),
      product_name: check_product.product_name,
      periode: `${check_product.start_date} To ${check_product.end_date}`,
      invoice_id: add_invoice,
      statusPayment: 'PAID',
      transactionType: Type_Payment.POINT,
      purchase_type: purchase_types.MEMBERSHIP,
      location_code: check_product.location_code,
      location_name: location_name?.location_name
    });

    // Activate Membership
    if (!(await updateMembershipDetailByUserId(get_vehicle_member!.id))) {
      return ServerError(req, res, 'Error Update Membership Detail');
    }

    return OK(res, 'Successfully Created Transaction', transaction_data);
  } catch (error) {
    console.error('Error processing purchase:', error);
    return ServerError(
      req,
      res,
      'An error occurred while processing your request.'
    );
  }
}

export async function Purchase_product(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const product_id = req.params.id;
    const { bank_id, plate_number } = req.body;

    // Validate Product
    const check_product = await getMembershipProductById(Number(product_id));
    if (!check_product) {
      return BadRequest(res, 'Product not found');
    }
    if (new Date(check_product.end_date) < new Date()) {
      return BadRequest(res, 'Periode Produk Tersebut Sudah Tidak Berlaku');
    }

    // Validate Member
    const user = req.user;
    if (!user) {
      return ServerError(req, res, 'Invalid token or user not found.');
    }

    const user_data = await findMemberById(user.id);
    if (!user_data) {
      return ServerError(req, res, 'Invalid token or user not found.');
    }

    // Check Vehicle Registration
    const get_vehicle_member =
      await getCustomerMembershipByPlateNumber(plate_number);
    if (!get_vehicle_member) {
      return NotFound(res, 'Vehicle Not Exist');
    }

    const check_product_existence =
      await getCustomerMembershipByCustMemberAndLocation(
        get_vehicle_member.id,
        check_product.location_code
      );

    const validate_expired_payment = await getTransactionByInvoiceId(
      check_product_existence?.invoice_id ?? ''
    );

    // Validate Expired Payment
    if (
      check_product_existence?.is_active === false &&
      validate_expired_payment?.expired_date &&
      new Date(validate_expired_payment.expired_date) > new Date()
    ) {
      return BadRequest(res, 'Silahkan Lakukan Pembayaran Lebih dahulu');
    }

    // Check if already registered
    if (check_product_existence?.is_active === true) {
      return BadRequest(
        res,
        'Anda Sudah Terdaftar Silahkan Lakukan Perpanjangan'
      );
    }

    const location_names = await getLocationAreaByCode(
      check_product.location_code
    );

    if (!location_names) {
      return BadRequest(res, 'location Not Found');
    }

    // Create Membership Detail
    const add_invoice = 'INV/MEMBERSHIP/' + generateRandomNumber(10);
    const create_membership_detail: CustomerMembershipDetailCreation = {
      Cust_Member: get_vehicle_member.id,
      member_customer_no: get_vehicle_member.member_customer_no,
      location_id: check_product.location_code,
      location_name: location_names.location_name,
      invoice_id: add_invoice,
      kid: check_product.KID,
      start_date: check_product.start_date,
      end_date: check_product.end_date
    };

    const membership_detail_creation = await upsertMembershipDetail(
      create_membership_detail
    );
    // if (!membership_detail_creation) {
    //   return ServerError(req, res, 'Error Registering Member Detail.');
    // }

    // Expiration Transaction
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 1);
    const formattedExpiredDate =
      expiredDate.toISOString().slice(0, 19) + '+07:00';

    // Get Payment Services Data Partner
    const data_bank = `${EnvConfig.PAYMENT_SERVICE_URL}${Endpoint_BayarIND.get_payment_services_id}${bank_id}`;
    const response_bank = await axios.get(data_bank);

    const payment_data: VirtualAccountDetails = {
      customerNo: get_vehicle_member.member_customer_no,
      virtualAccountName: user_data.fullname,
      virtualAccountEmail: user_data.email,
      ExpiredDate: formattedExpiredDate,
      totalAmount: (
        check_product.price + response_bank.data.admin_fee
      ).toString(),
      AppModule: 'APP_MEMBERSHIP',
      Invoice: add_invoice,
      Payment_using: response_bank.data.type_payment
    };

    // Hit Payment Service And Save Payment
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

    const transaction_history = {
      user_id: user.id,
      virtual_account:
        result.paymentData.virtualAccountData.virtualAccountNo?.trim() ||
        result.paymentData.virtualAccountData.virtual_account_number.trim(),
      trxId:
        result.paymentData.virtualAccountData?.trxId ||
        result.paymentData.virtualAccountData.trx_id,
      expired_date: formattedExpiredDate,
      timestamp: new Date(),
      price: result.paymentData.virtualAccountData.totalAmount?.value
        ? (
            Number(result.paymentData.virtualAccountData.totalAmount.value) -
            Number(response_bank.data.admin_fee)
          ).toString()
        : (
            Number(result.paymentData.virtualAccountData.paid_amount) -
            Number(response_bank.data.admin_fee)
          ).toString(),
      product_name: check_product.product_name,
      periode: `${check_product.start_date} To ${check_product.end_date}`,
      invoice_id: payment_data.Invoice,
      statusPayment: 'PENDING',
      transactionType: response_bank.data.type_payment,
      purchase_type: purchase_types.MEMBERSHIP,
      location_code: check_product.location_code,
      location_name: location_name?.location_name
    };

    // Create transaction history in the database
    const transaction_data = await createTransaction({
      ...transaction_history // Correctly trim and assign
    });

    return OK(res, 'Successfully Created Transaction', transaction_data);
  } catch (error: any) {
    console.error('Error processing purchase:', error);
    return ServerError(req, res, 'Error initiating purchase.', error.message);
  }
}

export async function Register_Vehicle(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const { vehicle_type, plate_number } = req.body;
    const user = req.user;

    // Validate User
    if (!user) {
      removeUploadedFiles(
        req.files as { [key: string]: Express.Multer.File[] }
      );
      return ServerError(req, res, 'Invalid token or user not found.');
    }

    const user_data = await findMemberById(user.id);
    if (!user_data) {
      removeUploadedFiles(
        req.files as { [key: string]: Express.Multer.File[] }
      );
      return ServerError(req, res, 'Invalid token or user not found.');
    }

    // Check if the plate number is already registered
    const plate_number_existence =
      await getCustomerMembershipByPlateNumber(plate_number);
    if (plate_number_existence) {
      removeUploadedFiles(
        req.files as { [key: string]: Express.Multer.File[] }
      );
      return BadRequest(res, 'Plat Nomor Sudah Terdaftar');
    }

    // File handling
    let plate_number_image: string | null = null;
    let stnk_image: string | null = null;

    // Access uploaded files from req.files
    if (req.files && typeof req.files === 'object') {
      const files = req.files as { [key: string]: Express.Multer.File[] };
      plate_number_image = files.plate_number_image?.[0]?.filename || null;
      stnk_image = files.stnk_image?.[0]?.filename || null;
    }

    // Validate that both images are provided
    if (!plate_number_image || !stnk_image) {
      removeUploadedFiles(
        req.files as { [key: string]: Express.Multer.File[] }
      );
      return BadRequest(
        res,
        'Both plate number image and STNK image are required.'
      );
    }

    const card_identifier = generateRandomNumberFromPlate(plate_number);

    // Prepare customer membership data
    const create_membership: CustomerMembershipCreation = {
      cust_id: user.id,
      vehicle_type: vehicle_type,
      rfid: '',
      member_customer_no: card_identifier,
      plate_number: plate_number,
      plate_number_image: plate_number_image,
      stnk_image: stnk_image
    };

    // Save the create_membership data to the database
    const create_member = await createCustomerMembership(create_membership);
    if (!create_member) {
      removeUploadedFiles(
        req.files as { [key: string]: Express.Multer.File[] }
      );
      return ServerError(req, res, 'Error Registering Member.');
    }

    return OK(res, 'Successfully Created Transaction', create_member);
  } catch (error: any) {
    console.error('Error during vehicle registration:', error);
    removeUploadedFiles(req.files as { [key: string]: Express.Multer.File[] });
    return ServerError(
      req,
      res,
      'Error processing vehicle registration.',
      error.message
    );
  }
}

export async function TOP_UP(req: Request, res: Response): Promise<any> {
  try {
    // Validate Product First
    const { bank_id, amount } = req.body;

    // Validate Member
    const user = req.user;

    if (!user) {
      return ServerError(req, res, 'Invalid token or user not found.');
    }

    const user_data = await findMemberById(user.id);
    if (!user_data) {
      return ServerError(req, res, 'Invalid token or user not found.');
    }

    if (amount < 10000) {
      return BadRequest(res, 'Minimum Top Up Rp. 10.000');
    }

    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 1);

    // Format the date string without milliseconds and with Jakarta timezone
    const formattedExpiredDate =
      expiredDate.toISOString().slice(0, 19) + '+07:00';

    // Get Payment Services Data Partner
    const data_bank = `${EnvConfig.PAYMENT_SERVICE_URL}${Endpoint_BayarIND.get_payment_services_id}${bank_id}`;
    const response_bank = await axios.get(data_bank);

    const payment_data: VirtualAccountDetails = {
      customerNo: user_data.customer_no,
      virtualAccountName: user_data.fullname,
      virtualAccountEmail: user_data.email,
      ExpiredDate: formattedExpiredDate,
      totalAmount: (amount + response_bank.data.admin_fee).toString(),
      AppModule: 'APP_MEMBERSHIP',
      Invoice: 'INV/MEMBERSHIP/' + generateRandomNumber(10),
      Payment_using: response_bank.data.type_payment
    };

    // Hit Payment Service And Save Payment
    const url = `${EnvConfig.PAYMENT_SERVICE_URL}${Endpoint_BayarIND.create_va}${bank_id}`;

    // Send POST request to the external API
    const response = await axios.post(url, payment_data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = response.data;

    const transaction_history = {
      user_id: user.id,
      virtual_account:
        result.paymentData.virtualAccountData.virtualAccountNo?.trim() ||
        result.paymentData.virtualAccountData.virtual_account_number.trim(),
      trxId:
        result.paymentData.virtualAccountData?.trxId ||
        result.paymentData.virtualAccountData.trx_id,
      expired_date: formattedExpiredDate,
      timestamp: new Date(),
      price: result.paymentData.virtualAccountData.totalAmount?.value
        ? (
            Number(result.paymentData.virtualAccountData.totalAmount.value) -
            Number(response_bank.data.admin_fee)
          ).toString()
        : (
            Number(result.paymentData.virtualAccountData.paid_amount) -
            Number(response_bank.data.admin_fee)
          ).toString(),
      product_name: 'TOP UP',
      periode: '',
      invoice_id: payment_data.Invoice,
      statusPayment: 'PENDING',
      transactionType: response_bank.data.type_payment,
      purchase_type: purchase_types.TOPUP
    };

    // Create transaction history in the database

    const transaction_data = await createTransaction(transaction_history);
    return res.status(200).json({
      status: true,
      message: 'Successfully Created Transaction',
      data: {
        transaction_data, // Spread the existing transaction data
        admin_fee: response_bank.data.admin_fee // Add admin_fee to the response
      }
    });
  } catch (error: any) {
    console.error('Error during top-up:', error);
    return ServerError(req, res, 'Error initiating payment.', error.message);
  }
}

export async function Receive_Payment_Product(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const trx_id = req.body.trx_id;
    const status_payment = req.body.status_transaction;

    console.log(status_payment);

    const update_status_payment = await updateTransactionByTrxId(
      trx_id,
      status_payment
    );

    if (!update_status_payment) {
      return BadRequest(res, 'Transaction not found or update failed.');
    }

    if (update_status_payment.purchase_type === 'TOPUP') {
      const user_id = update_status_payment.user_id;
      const points = update_status_payment.price;

      const update_points = await updateMemberPoints(user_id, Number(points));

      return OK(res, 'TOP UP Berhasil', update_points);
    } else if (update_status_payment.purchase_type === 'MEMBERSHIP') {
      const invoice_id = update_status_payment.invoice_id;

      const activation_membership =
        await updateMembershipDetailByInvoiceId(invoice_id);

      return OK(res, 'Membership Activation', activation_membership);
    } else {
      return BadRequest(res, 'Invalid purchase type.');
    }
  } catch (error: any) {
    return ServerError(req, res, 'Error processing payment.', error.message);
  }
}

export async function updateFailedTransactionsController(
  req: Request,
  res: Response
): Promise<any> {
  try {
    await changePaymentFailedExpired();
    return res.status(200).json({
      message: 'Expired transactions successfully updated to Failed.'
    });
  } catch (error: any) {
    console.error('Error updating transactions:', error);
    return res.status(500).json({
      message: 'An error occurred while updating transactions.',
      error: error.message
    });
  }
}

export async function Extend_product(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const product_id = req.params.id;
    const { bank_id, plate_number } = req.body;

    // Validate Product
    const check_product = await getMembershipProductById(Number(product_id));
    if (!check_product) {
      return BadRequest(res, 'Product not found');
    }
    if (new Date(check_product.end_date) < new Date()) {
      return BadRequest(res, 'Periode Produk Tersebut Sudah Tidak Berlaku');
    }

    // Validate Member
    const user = req.user;
    if (!user) {
      return ServerError(req, res, 'Invalid token or user not found.');
    }

    const user_data = await findMemberById(user.id);
    if (!user_data) {
      return ServerError(req, res, 'Invalid token or user not found.');
    }

    // Check Vehicle Registration
    const get_vehicle_member =
      await getCustomerMembershipByPlateNumber(plate_number);
    if (!get_vehicle_member) {
      return NotFound(res, 'Vehicle Not Exist');
    }

    const check_product_existence =
      await getCustomerMembershipByCustMemberAndLocation(
        get_vehicle_member.id,
        check_product.location_code
      );

    const validate_expired_payment = await getTransactionByInvoiceId(
      check_product_existence?.invoice_id ?? ''
    );

    // Validate Expired Payment
    if (
      check_product_existence?.is_active === true &&
      validate_expired_payment?.expired_date &&
      new Date(validate_expired_payment.expired_date) > new Date()
    ) {
      return BadRequest(res, 'Silahkan Lakukan Pembayaran Lebih dahulu');
    }

    if (
      check_product_existence?.end_date &&
      check_product_existence.end_date > check_product.end_date
    ) {
      return BadRequest(res, 'Anda Tidak Bisa Beli Produk Bulan Sebelumnya');
    }

    const location_names = await getLocationAreaByCode(
      check_product.location_code
    );

    if (!location_names) {
      return BadRequest(res, 'location Not Found');
    }

    // Create Membership Detail
    const add_invoice = 'INV/MEMBERSHIP/' + generateRandomNumber(10);
    const create_membership_detail: CustomerMembershipDetailCreation = {
      Cust_Member: get_vehicle_member.id,
      member_customer_no: get_vehicle_member.member_customer_no,
      location_id: check_product.location_code,
      location_name: location_names.location_name,
      invoice_id: add_invoice,
      kid: check_product.KID,
      start_date: check_product.start_date,
      end_date: check_product.end_date
    };

    const membership_detail_creation = await upsertMembershipDetail(
      create_membership_detail
    );
    // if (!membership_detail_creation) {
    //   return ServerError(req, res, 'Error Registering Member Detail.');
    // }

    // Expiration Transaction
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 1);
    const formattedExpiredDate =
      expiredDate.toISOString().slice(0, 19) + '+07:00';

    // Get Payment Services Data Partner
    const data_bank = `${EnvConfig.PAYMENT_SERVICE_URL}${Endpoint_BayarIND.get_payment_services_id}${bank_id}`;
    const response_bank = await axios.get(data_bank);

    const payment_data: VirtualAccountDetails = {
      customerNo: get_vehicle_member.member_customer_no,
      virtualAccountName: user_data.fullname,
      virtualAccountEmail: user_data.email,
      ExpiredDate: formattedExpiredDate,
      totalAmount: (
        check_product.price + response_bank.data.admin_fee
      ).toString(),
      AppModule: 'APP_MEMBERSHIP',
      Invoice: add_invoice,
      Payment_using: response_bank.data.type_payment
    };

    // Hit Payment Service And Save Payment
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

    const transaction_history = {
      user_id: user.id,
      virtual_account:
        result.paymentData.virtualAccountData.virtualAccountNo?.trim() ||
        result.paymentData.virtualAccountData.virtual_account_number.trim(),
      trxId:
        result.paymentData.virtualAccountData?.trxId ||
        result.paymentData.virtualAccountData.trx_id,
      expired_date: formattedExpiredDate,
      timestamp: new Date(),
      price: result.paymentData.virtualAccountData.totalAmount?.value
        ? (
            Number(result.paymentData.virtualAccountData.totalAmount.value) -
            Number(response_bank.data.admin_fee)
          ).toString()
        : (
            Number(result.paymentData.virtualAccountData.paid_amount) -
            Number(response_bank.data.admin_fee)
          ).toString(),
      product_name: check_product.product_name,
      periode: `${check_product.start_date} To ${check_product.end_date}`,
      invoice_id: payment_data.Invoice,
      statusPayment: 'PENDING',
      transactionType: response_bank.data.type_payment,
      purchase_type: purchase_types.MEMBERSHIP,
      location_code: check_product.location_code,
      location_name: location_name?.location_name
    };

    // Create transaction history in the database
    const transaction_data = await createTransaction({
      ...transaction_history // Correctly trim and assign
    });

    return OK(res, 'Successfully Created Transaction', transaction_data);
  } catch (error: any) {
    console.error('Error processing purchase:', error);
    return ServerError(req, res, 'Error initiating purchase.', error.message);
  }
}

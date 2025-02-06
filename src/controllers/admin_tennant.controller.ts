import { Request, Response } from 'express';
import { findExistingUser } from '../services/admin_tennant.service';
import { BadRequest, OK } from '../utils/response/common.response';
import { createAdminTennant } from '../services/admin_tennant.service';
import jwtUtils from '../utils/jwt.utils'; // Assuming the generate function is here
import { sendMail } from '../utils/mail.utils';
import EnvConfig from '../configs/env.config'; // Configuration

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
    const activationToken = jwtUtils.generate(
      { email: req.body.email, username: req.body.username },
      '1h' // Ensure this is passed as a valid string or number
    );

    // Add the activationToken to the request body before creating the new member
    req.body.activation_token = await activationToken; // Attach the token to the member data

    // Create new tenant with the activation token
    const newMember = await createAdminTennant(req.body);

    // Prepare the HTML content for the activation email
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
        <a href="${EnvConfig.APP_URL}/activate/${activationToken}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
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
    return res.status(400).json({ error: error.message });
  }
}

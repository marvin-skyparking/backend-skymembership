import { Request, Response } from 'express';
import {
  createMember,
  findMemberById,
  findMemberByUsernameOrEmail,
  updateMember,
  deleteMember,
  findExistingUser,
  userDetail
} from '../services/member_customer.service';
import {
  BadRequest,
  NotFound,
  OK,
  ServerError
} from '../utils/response/common.response';
import {
  getCustomerAllMembershipById,
  getCustomerMembershipByPlateNumber,
  getMembershipsByCustomerNo,
  getMembershipVehicleByCustId,
  getMembershipVehicleDetailById,
  updateRfidByPlateNumber
} from '../services/customer_membership.service';
import {
  getMasterCardByNoCard,
  updateMasterCard,
  updateMasterCardIsUsed
} from '../services/master_card.service';
// import {
//   getAllMembershipDetailById,
//   getMembershipDetailsByIds
// } from '../services/customer_membership_details.service';

export async function getUserDetailController(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const user = req.user;

    if (!user || !user.id) {
      return res
        .status(404)
        .json({ message: 'Invalid token or user not found.' });
    }

    const userId = user.id; // Extract user ID from the `user` object

    const userDetails = await userDetail(userId);

    const data_details = {
      fullName: userDetails.fullName,
      email: userDetails.email,
      phone_number: userDetails.phone_number,
      points: userDetails.points,
      reward_points: userDetails.reward_points
    };

    res.status(200).json({
      message: 'Success Retrieve User',
      data_details
    });
  } catch (error: any) {
    console.error('Error fetching user details:', error);

    if (error.message === 'User not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

// Register  member
export async function handleCreateMember(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const email_valid = await findExistingUser(req.body.email);

    if (email_valid) {
      return BadRequest(res, 'Email already exists');
    }

    const phone_number = await findExistingUser(req.body.phone_number);

    if (phone_number) {
      return BadRequest(res, 'Phone number already exists');
    }

    const username = await findExistingUser(req.body.username);

    if (username) {
      return BadRequest(res, 'Username already exists');
    }

    const newMember = await createMember(req.body);
    res.status(201).json(newMember);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// Read member by ID
export async function handleFindMemberById(
  req: Request,
  res: Response
): Promise<any> {
  const { id } = req.params;
  const member = await findMemberById(Number(id));

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  res.json(member);
}

// Read member by username or email
export async function handleFindMemberByUsernameOrEmail(
  req: Request,
  res: Response
): Promise<any> {
  const { usernameOrEmail } = req.params;
  const member = await findMemberByUsernameOrEmail(usernameOrEmail);

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  res.json(member);
}

// Update member
export async function handleUpdateMember(
  req: Request,
  res: Response
): Promise<any> {
  const { id } = req.params;

  try {
    const updatedMember = await updateMember(Number(id), req.body);

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(updatedMember);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// Delete member
export async function handleDeleteMember(
  req: Request,
  res: Response
): Promise<any> {
  const { id } = req.params;

  const deletedCount = await deleteMember(Number(id));

  if (deletedCount === 0) {
    return res.status(404).json({ message: 'Member not found' });
  }

  res.status(204).send(); // No content
}

export async function getMemberVehicle(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const user = req.user;

    if (!user) {
      return NotFound(res, 'Invalid token or user not found.');
    }

    const user_data = await findMemberById(user.id);

    if (!user_data) {
      return NotFound(res, 'Invalid token or user not found.');
    }

    const data_vehicle = await getMembershipVehicleByCustId(Number(user.id));

    if (!data_vehicle) {
      return NotFound(res, 'No Vehicle Found');
    }

    const responseData = data_vehicle.map((vehicle) => ({
      id: vehicle.id,
      cust_id: vehicle.cust_id,
      rfid: vehicle.rfid,
      vehicle_type: vehicle.vehicle_type,
      member_customer_no: vehicle.member_customer_no,
      plate_number: vehicle.plate_number,
      plate_number_image: vehicle.plate_number_image,
      stnk_image: vehicle.stnk_image
    }));

    return OK(res, 'Success Retreive Member Vehicle', responseData);
  } catch (error: any) {
    return ServerError(req, res, error);
  }
}

export async function getMemberVehicleDetails(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const id = req.params.id;
    const user = req.user;

    if (!user) {
      return NotFound(res, 'Invalid token or user not found.');
    }

    const user_data = await findMemberById(user.id);

    if (!user_data) {
      return NotFound(res, 'Invalid token or user not found.');
    }

    const data_vehicle = await getMembershipVehicleDetailById(Number(id));
    if (!data_vehicle) {
      return NotFound(res, 'Data Vehicle Not Found');
    }
    const list_membership = await getMembershipsByCustomerNo(
      data_vehicle.member_customer_no
    );

    if (!list_membership) {
      return NotFound(res, 'Data Vehicle Not Found');
    }

    const responseData = {
      rfid: data_vehicle.rfid,
      vehicle_type: data_vehicle.vehicle_type,
      member_customer_no: data_vehicle.member_customer_no,
      plate_number: data_vehicle.plate_number,
      plate_number_image: data_vehicle.plate_number_image,
      stnk_image: data_vehicle.stnk_image,
      membership: list_membership.map((membership) => ({
        member_customer_no: membership.member_customer_no,
        location_id: membership.location_id,
        kid: membership.kid,
        is_active: membership.is_active,
        is_used: membership.is_used,
        start_date: membership.start_date,
        end_date: membership.end_date
      }))
    };

    return OK(res, 'Success Retreive Member Vehicle', responseData);
  } catch (error: any) {
    return ServerError(req, res, error);
  }
}

export async function updateRfidMember(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const { plate_number, RFID_Number } = req.body;
    const user = req.user;

    if (!user) {
      return NotFound(res, 'Invalid token or user not found.');
    }

    const user_data = await findMemberById(user.id);

    if (!user_data) {
      return NotFound(res, 'Invalid token or user not found.');
    }

    const validate_member_vehicle = await getMembershipVehicleByCustId(
      Number(user.id)
    );

    // Check if the plate_number exists in the list of vehicles
    const vehicleExists = validate_member_vehicle?.some(
      (vehicle) => vehicle.plate_number === plate_number
    );

    if (!vehicleExists) {
      return BadRequest(res, 'Plate number not associated with the member.');
    }

    const customer_member =
      await getCustomerMembershipByPlateNumber(plate_number);

    const cust_id = customer_member?.dataValues.id;

    if (!cust_id) {
      return BadRequest(res, 'Invalid Customer Identifier');
    }

    const check_card = await getMasterCardByNoCard(RFID_Number);

    if (!check_card) {
      return BadRequest(res, 'Card Not Registered On Sky Parking');
    }

    if (check_card && check_card.is_used === true) {
      return BadRequest(res, 'Card is already Registered');
    }

    const update_master_card = await updateMasterCardIsUsed(RFID_Number);

    if (!update_master_card) {
      return BadRequest(res, 'Failed to update Master Card');
    }

    const validate_vehicle = await updateRfidByPlateNumber(
      plate_number,
      RFID_Number
    );

    return OK(res, 'RFID updated successfully.', validate_vehicle);
  } catch (error: any) {
    console.error('Error updating RFID:', error);
    return ServerError(
      error,
      error.message,
      'An error occurred while updating the RFID.',
      error
    );
  }
}

export async function GetCustomerMemberListDetails(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const user = req.user?.id; // Ensure req.user is valid and has an id
    const id = req.params.id;
    //Validate User First
    if (!user) {
      return NotFound(res, 'Invalid token or user not found.');
    }

    const user_data = await findMemberById(user.id);

    if (!user_data) {
      return NotFound(res, 'Invalid token or user not found.');
    }

    const data_membership = await getCustomerAllMembershipById(user);

    // Use res.status() and res.json() directly if helpers are problematic
    return res.status(200).json({
      message: 'Success Retrieve Data',
      data: data_membership
    });
  } catch (error: any) {
    console.error('Error in GetCustomerMemberList:', error);

    return res.status(500).json({
      message: 'An error occurred while retrieving data',
      error: error.message
    });
  }
}

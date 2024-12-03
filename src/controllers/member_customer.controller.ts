import { Request, Response } from 'express';
import {
  createMember,
  findMemberById,
  findMemberByUsernameOrEmail,
  updateMember,
  deleteMember,
  findExistingUser
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
  getMembershipVehicleByCustId,
  getMembershipVehicleDetailById,
  updateRfidByPlateNumber
} from '../services/customer_membership.service';
import {
  getAllMembershipDetailById,
  getMembershipDetailsByIds
} from '../services/customer_membership_details.service';

// Register  member
export async function handleCreateMember(req: Request, res: Response) {
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
export async function handleFindMemberById(req: Request, res: Response) {
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
) {
  const { usernameOrEmail } = req.params;
  const member = await findMemberByUsernameOrEmail(usernameOrEmail);

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  res.json(member);
}

// Update member
export async function handleUpdateMember(req: Request, res: Response) {
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
export async function handleDeleteMember(req: Request, res: Response) {
  const { id } = req.params;

  const deletedCount = await deleteMember(Number(id));

  if (deletedCount === 0) {
    return res.status(404).json({ message: 'Member not found' });
  }

  res.status(204).send(); // No content
}

export async function getMemberVehicle(req: Request, res: Response) {
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

    return OK(res, 'Success Retreive Member Vehicle', data_vehicle);
  } catch (error: any) {
    return ServerError(req, res, error);
  }
}

export async function getMemberVehicleDetails(req: Request, res: Response) {
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

    return OK(res, 'Success Retreive Member Vehicle', data_vehicle);
  } catch (error: any) {
    return ServerError(req, res, error);
  }
}

export async function updateRfidMember(req: Request, res: Response) {
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

export async function GetCustomerMemberList(req: Request, res: Response) {
  try {
    const user = req.user;

    //Validate User First
    if (!user) {
      return NotFound(res, 'Invalid token or user not found.');
    }

    const user_data = await findMemberById(user.id);

    if (!user_data) {
      return NotFound(res, 'Invalid token or user not found.');
    }

    const data_membership = await getCustomerAllMembershipById(user.id);

    if (!data_membership) {
      return NotFound(res, 'Membership not found.');
    }

    const ids = data_membership.map((item) => item.id);

    const data = await getMembershipDetailsByIds(ids);

    // Use res.status() and res.json() directly if helpers are problematic
    return res.status(200).json({
      message: 'Success Retrieve Data',
      data: data
    });
  } catch (error: any) {
    console.error('Error in GetCustomerMemberList:', error);

    return res.status(500).json({
      message: 'An error occurred while retrieving data',
      error: error.message
    });
  }
}

export async function GetCustomerMemberListDetails(
  req: Request,
  res: Response
) {
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

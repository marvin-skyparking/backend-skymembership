import express from 'express';
import {
  handleCreateMember,
  handleFindMemberById,
  handleFindMemberByUsernameOrEmail,
  handleUpdateMember,
  handleDeleteMember,
  getMemberVehicle,
  getMemberVehicleDetails,
  updateRfidMember
} from '../controllers/member_customer.controller';
import { validateUserToken } from '../middleware/auth.middleware';

const member_customer = express.Router();

member_customer.post('/members', handleCreateMember);
member_customer.get('/members/:id', handleFindMemberById);
member_customer.get(
  '/members/username-or-email/:usernameOrEmail',
  handleFindMemberByUsernameOrEmail
);
member_customer.put('/members/:id', handleUpdateMember);
member_customer.delete('/members/:id', handleDeleteMember);
member_customer.get('/members-vehicle/', validateUserToken, getMemberVehicle);
member_customer.get(
  '/members-vehicle/:id',
  validateUserToken,
  getMemberVehicleDetails
);
member_customer.post('/update-rfid/', validateUserToken, updateRfidMember);
export default member_customer;

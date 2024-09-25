import express from 'express';
import {
  handleCreateMember,
  handleFindMemberById,
  handleFindMemberByUsernameOrEmail,
  handleUpdateMember,
  handleDeleteMember
} from '../controllers/member_customer.controller';

const member_customer = express.Router();

member_customer.post('/members', handleCreateMember);
member_customer.get('/members/:id', handleFindMemberById);
member_customer.get(
  '/members/username-or-email/:usernameOrEmail',
  handleFindMemberByUsernameOrEmail
);
member_customer.put('/members/:id', handleUpdateMember);
member_customer.delete('/members/:id', handleDeleteMember);

export default member_customer;

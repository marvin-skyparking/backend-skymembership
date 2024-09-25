// routes/membershipProductRoutes.ts

import { Router } from 'express';
import {
  getMembershipProduct,
  membershipProductController
} from '../controllers/membership_product.controller';

const productRouter = Router();

productRouter.post(
  '/membership-product',
  membershipProductController.createMembershipProduct
);
productRouter.get(
  '/membership-product/:id',
  membershipProductController.getMembershipProduct
);
productRouter.put(
  '/membership-product/:id',
  membershipProductController.updateMembershipProduct
);
productRouter.delete(
  '/membership-product/:id',
  membershipProductController.deleteMembershipProduct
);
productRouter.get(
  '/membership-products',
  membershipProductController.getAllMembershipProducts
);
productRouter.get('/membership-product', getMembershipProduct);

export default productRouter;

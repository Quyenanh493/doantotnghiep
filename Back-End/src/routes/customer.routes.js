import express from "express";
import customerController from "../controllers/customerController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Các endpoint API cho Customer
router.get('/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  customerController.getAllCustomers
);

router.get('/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  customerController.getCustomerById
);

router.post(
  '/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  customerController.createCustomer
);

router.put(
  '/:id', 
  authMiddleware.verifyToken,
  customerController.updateCustomer
);

router.delete(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  customerController.deleteCustomer
);

export default router;
import express from "express";
import factBookingController from "../controllers/factBookingController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Các endpoint API cho FactBooking
router.get('/', 
    authMiddleware.verifyToken,
    factBookingController.getAllBookings
);

router.get('/:id', 
    authMiddleware.verifyToken,
    factBookingController.getBookingById
);

router.get('/customer/:customerId', 
    authMiddleware.verifyToken,
    factBookingController.getBookingsByCustomerId
);

// Các endpoint cần quyền admin/staff
router.post(
    '/', 
    authMiddleware.verifyToken,
    factBookingController.createBooking
);

router.put(
    '/:id', 
    authMiddleware.verifyToken,
    factBookingController.updateBooking
);

router.delete(
    '/:id', 
    authMiddleware.verifyToken,
    factBookingController.deleteBooking
);

export default router; 
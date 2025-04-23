import express from "express";
import roomController from "../controllers/roomController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Các endpoint API cho Room
router.get('/', roomController.getAllRooms);  // Public
router.get('/:id', roomController.getRoomById);  // Public

// Các endpoint cần quyền admin/staff
router.post(
  '/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  roomController.createRoom
);

router.put(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  roomController.updateRoom
);

router.delete(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  roomController.deleteRoom
);

export default router;
import express from "express";
import amenitiesController from "../controllers/amenitiesController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Các endpoint API cho Amenities
router.get('/', amenitiesController.getAllAmenities);  // Public
router.get('/:id', amenitiesController.getAmenityById);  // Public

// Các endpoint cần quyền admin/staff
router.post(
  '/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  amenitiesController.createAmenity
);

router.put(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  amenitiesController.updateAmenity
);

router.delete(
  '/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  amenitiesController.deleteAmenity
);

export default router;
import express from "express";
import upload from "../middleware/uploadMiddleware";
import imageController from "../controllers/imageController";
const router = express.Router();

// API tải lên hình ảnh - yêu cầu xác thực
router.post(
  '/',
  upload.single('image'),
  imageController.handleUploadImage
);

router.post(
  '/profile/:customerId',
  upload.single('image'),
  imageController.handleUploadImageProfile
);

export default router;
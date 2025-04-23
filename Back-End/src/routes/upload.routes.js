import express from "express";
import apiController from "../controllers/apiController";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

// API tải lên hình ảnh - yêu cầu xác thực
router.post(
  '/',
  upload.single('image'),
  apiController.handleUploadImage
);

export default router;
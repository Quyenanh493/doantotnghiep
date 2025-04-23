import express from "express";
import apiController from "../controllers/apiController";
import validationMiddleware from "../middleware/validationMiddleware";

const router = express.Router();

// API đăng ký và đăng nhập - không cần xác thực
router.post(
  '/register', 
  validationMiddleware.validateRegister,
  apiController.handleRegister
);

router.post(
  '/login', 
  validationMiddleware.validateLogin,
  apiController.handleLogin
);

// API refresh token và logout
router.post(
  '/refresh-token',
  apiController.handleRefreshToken
);

router.post(
  '/logout',
  apiController.handleLogout
);

export default router;
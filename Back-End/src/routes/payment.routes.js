import express from "express";
import paymentController from "../controllers/paymentController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Tạo URL thanh toán VNPay
router.post(
  '/create-payment-url',
  authMiddleware.verifyToken,
  paymentController.createPaymentUrl
);

// Xử lý kết quả thanh toán từ VNPay
router.get('/vnpay-return', paymentController.vnpayReturn);

// Truy vấn kết quả giao dịch VNPay
router.get('/query-dr/:transactionCode', 
  authMiddleware.verifyToken,
  paymentController.queryDr
);

// Hoàn tiền giao dịch
router.post('/refund',
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']), // Chỉ admin mới có thể hoàn tiền
  paymentController.refundTransaction
);

// Kiểm tra trạng thái thanh toán
router.get(
  '/status/:bookingId',
  authMiddleware.verifyToken,
  paymentController.checkPaymentStatus
);

// Lấy thông tin thanh toán theo bookingId
router.get(
  '/:bookingId',
  authMiddleware.verifyToken,
  paymentController.getPaymentByBookingId
);

export default router;
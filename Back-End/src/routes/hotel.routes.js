import express from 'express';
import hotelController from '../controllers/hotelController';
import authMiddleware from '../middleware/authMiddleware';
const router = express.Router();


// public - Routes cụ thể phải đặt trước routes có parameter
router.get('/', hotelController.getAllHotels);
router.get('/cities', hotelController.getCities);
router.get('/city/:city', hotelController.getHotelsByCity);
router.get('/:id', hotelController.getHotelById);


// Các endpoint cần quyền admin/staff
router.post('/', 
    authMiddleware.verifyToken,
    authMiddleware.checkRole(['admin']),
    hotelController.createHotel
);
router.put('/:id', 
    authMiddleware.verifyToken,
    authMiddleware.checkRole(['admin']),
    hotelController.updateHotel
);
router.delete('/:id', 
    authMiddleware.verifyToken,
    authMiddleware.checkRole(['admin']),
    hotelController.deleteHotel
);

export default router;
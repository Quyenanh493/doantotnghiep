import express from 'express';
import hotelController from '../controllers/hotelController';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Cấu hình multer để upload hình ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/images/hotels');
    },
    filename: function (req, file, cb) {
        cb(null, `hotel-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file 5MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Chỉ chấp nhận file hình ảnh: jpeg, jpg, png, gif'));
    }
});

// Routes
router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotelById);
router.post('/', upload.single('hotelImage'), hotelController.createHotel);
router.put('/:id', upload.single('hotelImage'), hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);

export default router;
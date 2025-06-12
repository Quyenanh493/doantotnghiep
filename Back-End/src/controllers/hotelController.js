import hotelService from '../services/hotelService';

const hotelController = {
    // Lấy tất cả khách sạn
    getAllHotels: async (req, res, next) => {
        try {
            let data = await hotelService.getAllHotels();
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getAllHotels:", error);
            next(error);
        }
    },

    // Lấy khách sạn theo ID
    getHotelById: async (req, res, next) => {
        try {
            const hotelId = req.params.id;
            let data = await hotelService.getHotelById(hotelId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getHotelById:", error);
            next(error);
        }
    },

    // Lấy danh sách thành phố
    getCities: async (req, res, next) => {
        try {
            let data = await hotelService.getCities();
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getCities:", error);
            next(error);
        }
    },

    // Lấy danh sách khách sạn theo thành phố
    getHotelsByCity: async (req, res, next) => {
        try {
            const city = req.params.city;
            let data = await hotelService.getHotelsByCity(city);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in getHotelsByCity:", error);
            next(error);
        }
    },

    // Tạo khách sạn mới
    createHotel: async (req, res, next) => {
        try {
            const hotelData = req.body;
            
            // Nếu có hình ảnh được tải lên, thêm đường dẫn vào hotelData
            if (req.file) {
                hotelData.hotelImage = req.file.path;
            }
            
            let data = await hotelService.createHotel(hotelData);
            
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in createHotel:", error);
            next(error);
        }
    },

    // Cập nhật khách sạn
    updateHotel: async (req, res, next) => {
        try {
            const hotelId = req.params.id;
            const hotelData = req.body;
            
            // Nếu có hình ảnh được tải lên, thêm đường dẫn vào hotelData
            if (req.file) {
                hotelData.hotelImage = req.file.path;
            }
            
            let data = await hotelService.updateHotel(hotelId, hotelData);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in updateHotel:", error);
            next(error);
        }
    },

    // Xóa khách sạn
    deleteHotel: async (req, res, next) => {
        try {
            const hotelId = req.params.id;
            let data = await hotelService.deleteHotel(hotelId);
            
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        } catch (error) {
            console.error("Error in deleteHotel:", error);
            next(error);
        }
    }
};

export default hotelController;
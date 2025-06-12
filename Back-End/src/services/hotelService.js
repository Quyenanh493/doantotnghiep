import db from '../models/index';
import { Op } from 'sequelize';

const hotelService = {
    // Lấy tất cả khách sạn
    getAllHotels: async () => {
        try {
            const hotels = await db.Hotel.findAll({
                include: [
                    {
                        model: db.Room,
                        required: false
                    },
                    {
                        model: db.User,
                        required: false
                    }
                ]
            });
            
            return {
                EM: 'Lấy danh sách khách sạn thành công',
                EC: 0,
                DT: hotels
            };
        } catch (error) {
            console.error("Error in getAllHotels service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy khách sạn theo ID
    getHotelById: async (hotelId) => {
        try {
            const hotel = await db.Hotel.findByPk(hotelId, {
                include: [
                    {
                        model: db.Room,
                        required: false
                    },
                    {
                        model: db.User,
                        required: false
                    }
                ]
            });
            
            if (!hotel) {
                return {
                    EM: 'Không tìm thấy khách sạn',
                    EC: 1,
                    DT: []
                };
            }
            
            return {
                EM: 'Lấy thông tin khách sạn thành công',
                EC: 0,
                DT: hotel
            };
        } catch (error) {
            console.error("Error in getHotelById service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy danh sách thành phố có khách sạn
    getCities: async () => {
        try {
            const hotels = await db.Hotel.findAll({
                where: {
                    hotelStatus: true
                },
                attributes: ['address'],
                raw: true
            });
            
            // Trích xuất thành phố từ địa chỉ
            const cities = new Set();
            hotels.forEach(hotel => {
                if (hotel.address) {
                    // Tách thành phố từ địa chỉ (giả sử định dạng: "địa chỉ, quận, thành phố")
                    const addressParts = hotel.address.split(',');
                    if (addressParts.length >= 2) {
                        const city = addressParts[addressParts.length - 1].trim();
                        cities.add(city);
                    }
                }
            });
            
            return {
                EM: 'Lấy danh sách thành phố thành công',
                EC: 0,
                DT: Array.from(cities).sort()
            };
        } catch (error) {
            console.error("Error in getCities service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy danh sách khách sạn theo thành phố
    getHotelsByCity: async (city) => {
        try {
            const hotels = await db.Hotel.findAll({
                where: {
                    hotelStatus: true,
                    address: {
                        [Op.like]: `%${city}%`
                    }
                },
                attributes: ['hotelId', 'hotelName', 'address', 'hotelType', 'hotelImage'],
                order: [['hotelName', 'ASC']]
            });
            
            return {
                EM: 'Lấy danh sách khách sạn theo thành phố thành công',
                EC: 0,
                DT: hotels
            };
        } catch (error) {
            console.error("Error in getHotelsByCity service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Tạo khách sạn mới
    createHotel: async (hotelData) => {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!hotelData.hotelName) {
                return {
                    EM: 'Thiếu thông tin bắt buộc: hotelName',
                    EC: 1,
                    DT: []
                };
            }
            
            // Tạo khách sạn mới
            const newHotel = await db.Hotel.create({
                hotelName: hotelData.hotelName,
                openDay: hotelData.openDay || new Date(),
                address: hotelData.address || '',
                hotelStatus: hotelData.hotelStatus !== undefined ? hotelData.hotelStatus : true,
                hotelType: hotelData.hotelType || '',
                hotelImage: hotelData.hotelImage || '',
                description: hotelData.description || '',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            return {
                EM: 'Tạo khách sạn thành công',
                EC: 0,
                DT: newHotel
            };
        } catch (error) {
            console.error("Error in createHotel service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Cập nhật thông tin khách sạn
    updateHotel: async (hotelId, hotelData) => {
        try {
            const hotel = await db.Hotel.findByPk(hotelId);
            
            if (!hotel) {
                return {
                    EM: 'Không tìm thấy khách sạn',
                    EC: 1,
                    DT: []
                };
            }
            
            // Cập nhật thông tin khách sạn
            await hotel.update({
                hotelName: hotelData.hotelName !== undefined ? hotelData.hotelName : hotel.hotelName,
                openDay: hotelData.openDay !== undefined ? hotelData.openDay : hotel.openDay,
                address: hotelData.address !== undefined ? hotelData.address : hotel.address,
                hotelStatus: hotelData.hotelStatus !== undefined ? hotelData.hotelStatus : hotel.hotelStatus,
                hotelType: hotelData.hotelType !== undefined ? hotelData.hotelType : hotel.hotelType,
                hotelImage: hotelData.hotelImage !== undefined ? hotelData.hotelImage : hotel.hotelImage,
                description: hotelData.description !== undefined ? hotelData.description : hotel.description,
                updatedAt: new Date()
            });
            
            // Lấy thông tin khách sạn đã cập nhật
            const updatedHotel = await db.Hotel.findByPk(hotelId, {
                include: [
                    {
                        model: db.Room,
                        required: false
                    },
                    {
                        model: db.User,
                        required: false
                    }
                ]
            });
            
            return {
                EM: 'Cập nhật thông tin khách sạn thành công',
                EC: 0,
                DT: updatedHotel
            };
        } catch (error) {
            console.error("Error in updateHotel service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Xóa khách sạn
    deleteHotel: async (hotelId) => {
        try {
            const hotel = await db.Hotel.findByPk(hotelId);
            
            if (!hotel) {
                return {
                    EM: 'Không tìm thấy khách sạn',
                    EC: 1,
                    DT: []
                };
            }
            
            // Kiểm tra xem khách sạn có phòng không
            const rooms = await db.Room.findAll({
                where: { hotelId: hotelId }
            });
            
            if (rooms.length > 0) {
                return {
                    EM: 'Không thể xóa khách sạn vì có phòng liên quan. Vui lòng xóa các phòng trước.',
                    EC: 2,
                    DT: []
                };
            }
            
            // Kiểm tra xem khách sạn có nhân viên không
            const users = await db.User.findAll({
                where: { hotelId: hotelId }
            });
            
            if (users.length > 0) {
                return {
                    EM: 'Không thể xóa khách sạn vì có nhân viên liên quan. Vui lòng xóa các nhân viên trước.',
                    EC: 3,
                    DT: []
                };
            }
            
            // Xóa khách sạn
            await hotel.destroy();
            
            return {
                EM: 'Xóa khách sạn thành công',
                EC: 0,
                DT: []
            };
        } catch (error) {
            console.error("Error in deleteHotel service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    }
};

export default hotelService;
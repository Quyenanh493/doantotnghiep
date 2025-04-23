import db from '../models/index';
import { Op } from 'sequelize';

const roomAvailabilityService = {
    // Lấy tất cả thông tin phòng trống
    getAllRoomAvailabilities: async () => {
        try {
            let roomAvailabilities = await db.RoomAvailability.findAll({
                include: [
                    { model: db.Room },
                    { model: db.FactBooking }
                ]
            });

            return {
                EM: roomAvailabilities.length > 0 ? 'Lấy danh sách phòng trống thành công' : 'Không có dữ liệu phòng trống',
                EC: 0,
                DT: roomAvailabilities || []
            };
        } catch (error) {
            console.error("Error in getAllRoomAvailabilities service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: 1,
                DT: []
            };
        }
    },

    // Lấy thông tin phòng trống theo ID
    getRoomAvailabilityById: async (roomAvailabilityId) => {
        try {
            let roomAvailability = await db.RoomAvailability.findOne({
                where: { roomAvailabilityId: roomAvailabilityId },
                include: [
                    { model: db.Room },
                    { model: db.FactBooking }
                ]
            });

            return {
                EM: roomAvailability ? 'Lấy thông tin phòng trống thành công' : 'Không tìm thấy thông tin phòng trống',
                EC: 0,
                DT: roomAvailability || {}
            };
        } catch (error) {
            console.error("Error in getRoomAvailabilityById service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: 1,
                DT: {}
            };
        }
    },

    // Tạo thông tin phòng trống mới
    createRoomAvailability: async (data) => {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!data.roomId || !data.dateIn || !data.dateOut) {
                return {
                    EM: 'Thiếu thông tin bắt buộc',
                    EC: 1,
                    DT: {}
                };
            }

            // Kiểm tra phòng có tồn tại không
            const room = await db.Room.findOne({ where: { roomId: data.roomId } });
            if (!room) {
                return {
                    EM: 'Phòng không tồn tại',
                    EC: 1,
                    DT: {}
                };
            }

            // Kiểm tra xung đột thời gian
            const existingAvailability = await db.RoomAvailability.findOne({
                where: {
                    roomId: data.roomId,
                    [Op.or]: [
                        {
                            dateIn: {
                                [Op.lt]: new Date(data.dateOut)
                            },
                            dateOut: {
                                [Op.gt]: new Date(data.dateIn)
                            }
                        }
                    ]
                }
            });

            if (existingAvailability) {
                return {
                    EM: 'Đã có thông tin phòng trong khoảng thời gian này',
                    EC: 1,
                    DT: {}
                };
            }

            // Tạo thông tin phòng trống mới
            let newRoomAvailability = await db.RoomAvailability.create({
                roomId: data.roomId,
                dateIn: new Date(data.dateIn),
                dateOut: new Date(data.dateOut),
                isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
                bookingId: data.bookingId || null
            });

            return {
                EM: 'Tạo thông tin phòng trống thành công',
                EC: 0,
                DT: newRoomAvailability
            };
        } catch (error) {
            console.error("Error in createRoomAvailability service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: 1,
                DT: {}
            };
        }
    },

    // Cập nhật thông tin phòng trống
    updateRoomAvailability: async (roomAvailabilityId, data) => {
        try {
            // Kiểm tra thông tin phòng trống có tồn tại không
            let roomAvailability = await db.RoomAvailability.findOne({
                where: { roomAvailabilityId: roomAvailabilityId }
            });

            if (!roomAvailability) {
                return {
                    EM: 'Không tìm thấy thông tin phòng trống',
                    EC: 1,
                    DT: {}
                };
            }

            // Cập nhật thông tin
            await roomAvailability.update({
                roomId: data.roomId || roomAvailability.roomId,
                dateIn: data.dateIn ? new Date(data.dateIn) : roomAvailability.dateIn,
                dateOut: data.dateOut ? new Date(data.dateOut) : roomAvailability.dateOut,
                isAvailable: data.isAvailable !== undefined ? data.isAvailable : roomAvailability.isAvailable,
                bookingId: data.bookingId !== undefined ? data.bookingId : roomAvailability.bookingId
            });

            // Lấy thông tin đã cập nhật
            let updatedRoomAvailability = await db.RoomAvailability.findOne({
                where: { roomAvailabilityId: roomAvailabilityId },
                include: [
                    { model: db.Room },
                    { model: db.FactBooking }
                ]
            });

            return {
                EM: 'Cập nhật thông tin phòng trống thành công',
                EC: 0,
                DT: updatedRoomAvailability
            };
        } catch (error) {
            console.error("Error in updateRoomAvailability service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: 1,
                DT: {}
            };
        }
    },

    // Xóa thông tin phòng trống
    deleteRoomAvailability: async (roomAvailabilityId) => {
        try {
            // Kiểm tra thông tin phòng trống có tồn tại không
            let roomAvailability = await db.RoomAvailability.findOne({
                where: { roomAvailabilityId: roomAvailabilityId }
            });

            if (!roomAvailability) {
                return {
                    EM: 'Không tìm thấy thông tin phòng trống',
                    EC: 1,
                    DT: {}
                };
            }

            // Xóa thông tin phòng trống
            await roomAvailability.destroy();

            return {
                EM: 'Xóa thông tin phòng trống thành công',
                EC: 0,
                DT: {}
            };
        } catch (error) {
            console.error("Error in deleteRoomAvailability service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: 1,
                DT: {}
            };
        }
    },

    // Kiểm tra phòng có sẵn trong khoảng thời gian
    checkRoomAvailability: async (roomId, dateIn, dateOut) => {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!roomId || !dateIn || !dateOut) {
                return {
                    EM: 'Thiếu thông tin bắt buộc',
                    EC: 1,
                    DT: { isAvailable: false }
                };
            }

            // Kiểm tra phòng có tồn tại không
            const room = await db.Room.findOne({ where: { roomId: roomId } });
            if (!room) {
                return {
                    EM: 'Phòng không tồn tại',
                    EC: 1,
                    DT: { isAvailable: false }
                };
            }

            // Kiểm tra xem có thông tin phòng không trống trong khoảng thời gian này không
            const existingAvailability = await db.RoomAvailability.findOne({
                where: {
                    roomId: roomId,
                    isAvailable: false,
                    [Op.or]: [
                        {
                            dateIn: {
                                [Op.lt]: new Date(dateOut)
                            },
                            dateOut: {
                                [Op.gt]: new Date(dateIn)
                            }
                        }
                    ]
                }
            });

            const isAvailable = !existingAvailability;

            return {
                EM: isAvailable ? 'Phòng có sẵn trong khoảng thời gian này' : 'Phòng không có sẵn trong khoảng thời gian này',
                EC: 0,
                DT: { 
                    isAvailable,
                    roomId,
                    dateIn,
                    dateOut
                }
            };
        } catch (error) {
            console.error("Error in checkRoomAvailability service:", error);
            return {
                EM: 'Lỗi từ server',
                EC: 1,
                DT: { isAvailable: false }
            };
        }
    },

    // Tìm kiếm phòng trống theo tiêu chí
    searchAvailableRooms: async (dateIn, dateOut, roomType, guestCount) => {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!dateIn || !dateOut) {
                return {
                    EM: 'Cần cung cấp ngày nhận và trả phòng',
                    EC: 1,
                    DT: []
                };
            }

            // Lấy tất cả phòng có trạng thái Available
            let whereClause = { roomStatus: 'Available' };
            
            // Thêm điều kiện lọc theo loại phòng nếu có
            if (roomType) {
                whereClause.roomType = roomType;
            }
            
            // Thêm điều kiện lọc theo số lượng khách nếu có
            if (guestCount) {
                whereClause.maxCustomer = { [Op.gte]: parseInt(guestCount) };
            }
            
            let availableRooms = await db.Room.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.Amenities,
                        as: 'RoomAmenities',
                        through: { attributes: [] }
                    },
                    {
                        model: db.Hotel
                    }
                ]
            });
            
            // Lấy danh sách phòng đã đặt trong khoảng thời gian
            const bookedRooms = await db.RoomAvailability.findAll({
                where: {
                    isAvailable: false,
                    [Op.or]: [
                        {
                            dateIn: {
                                [Op.lt]: new Date(dateOut)
                            },
                            dateOut: {
                                [Op.gt]: new Date(dateIn)
                            }
                        }
                    ]
                },
                attributes: ['roomId']
            });
            
            // Lấy danh sách ID phòng đã đặt
            const bookedRoomIds = bookedRooms.map(booking => booking.roomId);
            
            // Lọc ra các phòng còn trống
            availableRooms = availableRooms.filter(room => !bookedRoomIds.includes(room.roomId));
            
            return {
                EM: 'Lấy danh sách phòng trống thành công',
                EC: 0,
                DT: availableRooms
            };
        } catch (error) {
            console.error("Error in searchAvailableRooms:", error);
            return {
                EM: 'Lỗi khi tìm kiếm phòng trống',
                EC: 1,
                DT: []
            };
        }
    }
};

export default roomAvailabilityService;
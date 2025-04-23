import db from '../models/index';

const roomService = {
    // Lấy tất cả phòng với các tiện nghi liên quan
    getAllRooms: async () => {
        try {
            const rooms = await db.Room.findAll({
                include: [
                    {
                        model: db.RoomAmenities,
                        include: [db.Amenities]
                    },
                    {
                        model: db.Hotel
                    }
                ]
            });
            return {
                EM: 'Lấy danh sách phòng thành công',
                EC: 0,
                DT: rooms
            };
        } catch (error) {
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Lấy phòng theo ID với các tiện nghi liên quan
    getRoomById: async (roomId) => {
        try {
            const room = await db.Room.findByPk(roomId, {
                include: [
                    {
                        model: db.RoomAmenities,
                        include: [db.Amenities]
                    },
                    {
                        model: db.Hotel
                    }
                ]
            });
            
            if (!room) {
                return {
                    EM: 'Không tìm thấy phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            return {
                EM: 'Lấy thông tin phòng thành công',
                EC: 0,
                DT: room
            };
        } catch (error) {
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Tạo phòng mới
    createRoom: async (roomData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            // Tạo phòng
            const newRoom = await db.Room.create({
                hotelId: roomData.hotelId,
                roomName: roomData.roomName,
                roomType: roomData.roomType,
                roomStatus: roomData.roomStatus || 'Available',
                equipmentAndMinibar: roomData.equipmentAndMinibar,
                maxCustomer: roomData.maxCustomer,
                price: roomData.price,
                roomImage: roomData.roomImage,
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });

            // Nếu có tiện nghi được cung cấp, tạo liên kết phòng-tiện nghi
            if (roomData.amenities && roomData.amenities.length > 0) {
                const roomAmenitiesData = roomData.amenities.map(amenityId => ({
                    roomID: newRoom.id,
                    amenitiesId: amenityId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }));
                
                await db.RoomAmenities.bulkCreate(roomAmenitiesData, { transaction });
            }

            await transaction.commit();
            
            // Lấy phòng mới tạo với các tiện nghi của nó
            const createdRoom = await db.Room.findByPk(newRoom.id, {
                include: [
                    {
                        model: db.RoomAmenities,
                        include: [db.Amenities]
                    },
                    {
                        model: db.Hotel
                    }
                ]
            });
            
            return {
                EM: 'Tạo phòng thành công',
                EC: 0,
                DT: createdRoom
            };
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Cập nhật phòng
    updateRoom: async (roomId, roomData) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const room = await db.Room.findByPk(roomId);
            
            if (!room) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            // Cập nhật thông tin phòng
            await room.update({
                hotelId: roomData.hotelId !== undefined ? roomData.hotelId : room.hotelId,
                roomName: roomData.roomName !== undefined ? roomData.roomName : room.roomName,
                roomType: roomData.roomType !== undefined ? roomData.roomType : room.roomType,
                roomStatus: roomData.roomStatus !== undefined ? roomData.roomStatus : room.roomStatus,
                equipmentAndMinibar: roomData.equipmentAndMinibar !== undefined ? roomData.equipmentAndMinibar : room.equipmentAndMinibar,
                maxCustomer: roomData.maxCustomer !== undefined ? roomData.maxCustomer : room.maxCustomer,
                price: roomData.price !== undefined ? roomData.price : room.price,
                roomImage: roomData.roomImage !== undefined ? roomData.roomImage : room.roomImage,
                updatedAt: new Date()
            }, { transaction });
            
            // Nếu có tiện nghi được cung cấp, cập nhật liên kết phòng-tiện nghi
            if (roomData.amenities && roomData.amenities.length > 0) {
                // Xóa các liên kết hiện có
                await db.RoomAmenities.destroy({
                    where: { roomID: roomId },
                    transaction
                });
                
                // Tạo liên kết mới
                const roomAmenitiesData = roomData.amenities.map(amenityId => ({
                    roomID: roomId,
                    amenitiesId: amenityId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }));
                
                await db.RoomAmenities.bulkCreate(roomAmenitiesData, { transaction });
            }
            
            await transaction.commit();
            
            // Lấy phòng đã cập nhật với các tiện nghi của nó
            const updatedRoom = await db.Room.findByPk(roomId, {
                include: [
                    {
                        model: db.RoomAmenities,
                        include: [db.Amenities]
                    },
                    {
                        model: db.Hotel
                    }
                ]
            });
            
            return {
                EM: 'Cập nhật phòng thành công',
                EC: 0,
                DT: updatedRoom
            };
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    },

    // Xóa phòng
    deleteRoom: async (roomId) => {
        const transaction = await db.sequelize.transaction();
        
        try {
            const room = await db.Room.findByPk(roomId);
            
            if (!room) {
                await transaction.rollback();
                return {
                    EM: 'Không tìm thấy phòng',
                    EC: 1,
                    DT: []
                };
            }
            
            // Xóa liên kết phòng-tiện nghi trước
            await db.RoomAmenities.destroy({
                where: { roomID: roomId },
                transaction
            });
            
            // Xóa phòng
            await room.destroy({ transaction });
            
            await transaction.commit();
            return {
                EM: 'Xóa phòng thành công',
                EC: 0,
                DT: []
            };
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            return {
                EM: 'Lỗi từ server',
                EC: -1,
                DT: []
            };
        }
    }
};

export default roomService;
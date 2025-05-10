import request from '../utils/request';

// Lấy tất cả phòng
export const getAllRooms = async () => {
  try {
    const response = await request.get('/rooms');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phòng:', error);
    throw error;
  }
};

// Lấy phòng theo ID
export const getRoomById = async (roomId) => {
  try {
    const response = await request.get(`/rooms/${roomId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin phòng ID ${roomId}:`, error);
    throw error;
  }
};

// Tìm kiếm phòng trống theo ngày, loại phòng và số lượng khách
export const searchAvailableRooms = async (dateIn, dateOut, roomType, guestCount) => {
  try {
    // Tạo object chứa các tham số tìm kiếm
    const requestData = { dateIn, dateOut };
    
    // Thêm các tham số tùy chọn nếu có
    if (roomType) requestData.roomType = roomType;
    if (guestCount) requestData.guestCount = guestCount;
    
    console.log('Dữ liệu gửi đi:', requestData);
    
    // Gửi request với các tham số trực tiếp trong body
    const response = await request.post('/room-availabilities/search', requestData);
    return response;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm phòng trống:', error);
    throw error;
  }
};

// Kiểm tra tình trạng phòng trống theo ngày
export const checkRoomAvailability = async (roomId, dateIn, dateOut) => {
  try {
    const response = await request.post('/room-availabilities/check', {
      roomId,
      dateIn,
      dateOut
    });
    return response.DT;
  } catch (error) {
    console.error('Lỗi khi kiểm tra tình trạng phòng:', error);
    throw error;
  }
};

// Lấy danh sách tiện nghi của phòng
export const getRoomAmenities = async (roomId) => {
  try {
    const response = await request.get(`/rooms/${roomId}/amenities`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy tiện nghi của phòng ID ${roomId}:`, error);
    throw error;
  }
};

// Lấy danh sách phòng theo loại
export const getRoomsByType = async (roomType) => {
  try {
    const response = await request.get('/rooms', {
      params: { roomType }
    });
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy phòng theo loại ${roomType}:`, error);
    throw error;
  }
};

// Lấy danh sách phòng theo giá
export const getRoomsByPriceRange = async (minPrice, maxPrice) => {
  try {
    const response = await request.get('/rooms', {
      params: { 
        minPrice,
        maxPrice
      }
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy phòng theo khoảng giá:', error);
    throw error;
  }
};
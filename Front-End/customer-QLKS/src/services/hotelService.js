import request from '../utils/request';

export const getAllHotels = async (params = {}) => {
  try {
    const response = await request.get('/hotel', { params });
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách sạn:', error);
    throw error;
  }
};


export const getHotelById = async (hotelId) => {
  try {
    const response = await request.get(`/hotel/${hotelId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin khách sạn ID ${hotelId}:`, error);
    throw error;
  }
};

export const getDefaultHotel = async () => {
  try {
    // Lấy khách sạn đầu tiên từ danh sách
    const response = await getAllHotels();
    if (response && response.EC === 0 && response.DT && response.DT.length > 0) {
      // Trả về khách sạn đầu tiên trong danh sách
      return {
        EC: 0,
        DT: response.DT[0],
        EM: 'Lấy thông tin khách sạn thành công'
      };
    } else {
      return {
        EC: 1,
        DT: null,
        EM: 'Không tìm thấy thông tin khách sạn'
      };
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khách sạn mặc định:', error);
    return {
      EC: -1,
      DT: null,
      EM: 'Lỗi từ server khi lấy thông tin khách sạn'
    };
  }
};

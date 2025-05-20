import request from '../utils/request';

// Lấy tổng doanh thu
export const getTotalRevenue = async () => {
  try {
    const response = await request.get('dashboard/revenue');
    return response.DT;
  } catch (error) {
    console.error('Lỗi khi lấy tổng doanh thu:', error);
    throw error;
  }
};

// Lấy số phòng được đặt
export const getBookedRoomCount = async () => {
  try {
    const response = await request.get('dashboard/rooms/booked');
    return response.DT;
  } catch (error) {
    console.error('Lỗi khi lấy số lượng khách hàng:', error);
    throw error;
  }
};

// Lấy số lượng phòng
export const getRoomCount = async () => {
  try {
    const response = await request.get('dashboard/rooms');
    return response.DT;
  } catch (error) {
    console.error('Lỗi khi lấy số lượng phòng:', error);
    throw error;
  }
};

// Lấy số liệu đăng ký theo tháng
export const getCustomerRegisterByMonth = async (year) => {
  try {
    const response = await request.get(`dashboard/customers/monthly?year=${year}`);
    return response.DT;
  } catch (error) {
    console.error('Lỗi khi lấy số liệu đăng ký theo tháng:', error);
    throw error;
  }
};

// Lấy doanh thu theo khách sạn
export const getRevenueByHotel = async (year) => {
  try {
    const response = await request.get(`dashboard/revenue/hotels?year=${year}`);
    return response.DT;
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu theo khách sạn:', error);
    throw error;
  }
};

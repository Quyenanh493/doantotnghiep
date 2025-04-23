import request from '../utils/request';

// Dịch vụ đăng nhập khách hàng
export const loginCustomer = async (credentials) => {
  try {
    // Đảm bảo gửi dữ liệu dạng raw JSON
    const response = await request.post('auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    throw error;
  }
};

// Dịch vụ đăng ký khách hàng
export const registerCustomer = async (userData, isFormData = false) => {
  try {
    if (isFormData) {
      // Nếu là FormData, sử dụng header khác
      console.log('Sending FormData to server');
      return await request.post('auth/register', userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Yêu cầu JSON thông thường
      return await request.post('auth/register', userData);
    }
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    throw error;
  }
};



// Đăng xuất khách hàng
export const logoutCustomer = () => {
  // Không xử lý ở đây nữa, việc này sẽ được xử lý ở component Logout
};

// Lấy hồ sơ khách hàng hiện tại
export const getCustomerProfile = async () => {
  try {
    return await request.get('customers/profile');
  } catch (error) {
    console.error('Lỗi lấy hồ sơ:', error);
    throw error;
  }
};
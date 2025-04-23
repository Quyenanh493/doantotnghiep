import axios from 'axios';
import { getCookie } from '../helper/cookie';

// Tạo một instance Axios với cấu hình tùy chỉnh
const request = axios.create({
  baseURL: 'http://localhost:8080/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Bộ chặn request
request.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage hoặc cookies nếu bạn có xác thực
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Bộ chặn response
request.interceptors.response.use(
  (response) => {
    // Bạn có thể xử lý các phản hồi thành công ở đây
    return response.data;
  },
  (error) => {
    // Xử lý lỗi ở đây
    if (error.response) {
      // Yêu cầu đã được thực hiện và máy chủ đã phản hồi với mã trạng thái
      // nằm ngoài phạm vi 2xx
      console.error('Lỗi phản hồi:', error.response.data);
      
      // Xử lý các mã trạng thái cụ thể
      if (error.response.status === 401) {
        // Không được phép - bạn có thể muốn chuyển hướng đến trang đăng nhập
        // hoặc xóa token
        localStorage.removeItem('accessToken');
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // Yêu cầu đã được thực hiện nhưng không nhận được phản hồi
      console.error('Lỗi yêu cầu:', error.request);
    } else {
      // Đã xảy ra lỗi khi thiết lập yêu cầu
      console.error('Lỗi:', error.message);
    }
    return Promise.reject(error);
  }
);

export default request;
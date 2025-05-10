import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * Component bảo vệ route, chỉ cho phép truy cập khi đã có thông tin đặt phòng
 * @param {Object} props 
 * @param {React.ReactNode} props.children Component con
 * @returns {React.ReactNode}
 */
const ProtectedBookingRoute = ({ children }) => {
  const bookingInfo = useSelector((state) => state.booking.bookingInfo);
  
  // Kiểm tra xem có thông tin đặt phòng hợp lệ không
  const hasBookingInfo = bookingInfo && 
                        bookingInfo.roomId && 
                        bookingInfo.checkInDate && 
                        bookingInfo.checkOutDate;

  if (!hasBookingInfo) {
    // Nếu chưa có thông tin đặt phòng, chuyển hướng về trang danh sách phòng
    return <Navigate to="/room" replace />;
  }

  // Nếu đã có thông tin đặt phòng, hiển thị component con
  return children;
};

export default ProtectedBookingRoute; 
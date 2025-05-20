import cloudinary from '../config/cloudinary';
import db from '../models/index';

/**
 * Tải lên hình ảnh với thư mục tùy chỉnh
 * @param {Buffer} fileBuffer - Buffer của tệp cần tải lên
 * @param {string} fileName - Tên tệp gốc
 * @param {string} type - Loại hình ảnh (customer, room, user, general, etc.)
 * @returns {Promise<string>} - URL tải xuống của tệp đã tải lên
 */
const uploadImageHM = async (fileBuffer, fileName, type = 'general') => {
  try {
    // Xác định thư mục dựa trên loại
    let folder = 'images';
    
    // Ánh xạ loại hình ảnh với thư mục tương ứng
    const folderMap = {
      'customer': 'customers',
      'room': 'rooms',
      'user': 'users',
      'general': 'general'
    };
    
    // Sử dụng thư mục tương ứng nếu có, nếu không sử dụng 'general'
    folder = folderMap[type] || 'general';
    
    // Tải hình ảnh lên Cloudinary
    const downloadURL = await cloudinary.uploadImage(fileBuffer, fileName, folder);
    
    return downloadURL;
  } catch (error) {
    console.error(`Lỗi trong uploadImage (${type}):`, error);
    throw error;
  }
};

// Giữ lại các hàm cũ để tương thích ngược (có thể xóa sau này)
const uploadCustomerImage = async (fileBuffer, fileName, customerId) => {
  try {
    const downloadURL = await uploadImageHM(fileBuffer, fileName, 'customer');
    
    // Cập nhật bản ghi khách hàng với URL hình ảnh nếu có ID
    if (customerId) {
      await db.Customer.update(
        { customerImage: downloadURL },
        { where: { customerId: customerId } }
      );
    }
    
    return downloadURL;
  } catch (error) {
    console.error('Lỗi trong uploadCustomerImage:', error);
    throw error;
  }
};

const uploadRoomImage = async (fileBuffer, fileName, roomId) => {
  try {
    const downloadURL = await uploadImageHM(fileBuffer, fileName, 'room');
    
    // Cập nhật bản ghi phòng với URL hình ảnh nếu có ID
    if (roomId) {
      await db.Room.update(
        { roomImage: downloadURL },
        { where: { id: roomId } }
      );
    }
    
    return downloadURL;
  } catch (error) {
    console.error('Lỗi trong uploadRoomImage:', error);
    throw error;
  }
};

export default {
  uploadImageHM,
  uploadCustomerImage,
  uploadRoomImage
};
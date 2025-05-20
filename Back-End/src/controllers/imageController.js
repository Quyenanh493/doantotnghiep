import imageService from "../services/imageService";

const handleUploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        EM: 'Không có file ảnh được tải lên',
        EC: -1,
        DT: ''
      });
    }

    // Lấy thông tin về loại hình ảnh (mặc định là 'general')
    const imageType = req.body.type || 'general';
    
    // Tải hình ảnh lên Cloudinary với thư mục phù hợp
    const imageUrl = await imageService.uploadImageHM(
      req.file.buffer,
      req.file.originalname,
      imageType
    );

    return res.status(200).json({
      EM: 'Tải ảnh lên thành công',
      EC: 0,
      DT: { imageUrl }
    });
  } catch (e) {
    console.error("Error in handleUploadImage:", e);
    next(e);
  }
};

const handleUploadImageProfile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        EM: 'Không có file ảnh được tải lên',
        EC: -1,
        DT: ''
      });
    }

    const customerId = req.params.customerId;

    // Tải hình ảnh lên Cloudinary với thư mục phù hợp
    const imageUrl = await imageService.uploadCustomerImage(
      req.file.buffer,
      req.file.originalname,
      customerId
    );

    return res.status(200).json({
      EM: 'Tải ảnh lên thành công',
      EC: 0,
      DT: { imageUrl }
    });
  } catch (e) {
    console.error("Error in handleUploadImage:", e);
    next(e);
  }
};

module.exports = {
  handleUploadImage,
  handleUploadImageProfile
};

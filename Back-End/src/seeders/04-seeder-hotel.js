'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('hotel', [
      {
        hotelName: 'Grand Plaza Hotel',
        openDay: new Date('2018-01-15'),
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        hotelStatus: true,
        hotelType: 'Luxury',
        hotelImage: 'grand_plaza.jpg',
        description: 'Khách sạn 5 sao sang trọng tại trung tâm Thành phố Hồ Chí Minh',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Riverside Resort',
        openDay: new Date('2019-05-20'),
        address: '45 Trần Phú, Quận Hải Châu, Đà Nẵng',
        hotelStatus: true,
        hotelType: 'Resort',
        hotelImage: 'riverside_resort.jpg',
        description: 'Khu nghỉ dưỡng ven sông với tầm nhìn tuyệt đẹp ra biển Đà Nẵng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Capital Suites',
        openDay: new Date('2017-11-10'),
        address: '78 Lý Thường Kiệt, Quận Hoàn Kiếm, Hà Nội',
        hotelStatus: true,
        hotelType: 'Business',
        hotelImage: 'capital_suites.jpg',
        description: 'Khách sạn dành cho doanh nhân với đầy đủ tiện nghi hiện đại',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Ocean View Hotel',
        openDay: new Date('2020-02-28'),
        address: '15 Trần Phú, TP. Nha Trang, Khánh Hòa',
        hotelStatus: true,
        hotelType: 'Beach Resort',
        hotelImage: 'ocean_view.jpg',
        description: 'Khách sạn hướng biển với bãi biển riêng tại Nha Trang',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Mountain Retreat',
        openDay: new Date('2019-12-05'),
        address: '28 Nguyễn Chí Thanh, TP. Đà Lạt, Lâm Đồng',
        hotelStatus: true,
        hotelType: 'Boutique',
        hotelImage: 'mountain_retreat.jpg',
        description: 'Khách sạn boutique yên tĩnh giữa núi đồi Đà Lạt',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'City Comfort Inn',
        openDay: new Date('2021-03-15'),
        address: '56 Lê Lợi, Quận 1, TP.HCM',
        hotelStatus: true,
        hotelType: 'Budget',
        hotelImage: 'city_comfort.jpg',
        description: 'Khách sạn giá rẻ nhưng đầy đủ tiện nghi tại trung tâm thành phố',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Heritage Palace',
        openDay: new Date('2018-07-22'),
        address: '101 Phan Chu Trinh, Quận Hoàn Kiếm, Hà Nội',
        hotelStatus: true,
        hotelType: 'Historic',
        hotelImage: 'heritage_palace.jpg',
        description: 'Khách sạn mang phong cách kiến trúc cổ điển Hà Nội',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Sunset Bay Resort',
        openDay: new Date('2020-11-30'),
        address: '23 Võ Nguyên Giáp, Phú Quốc, Kiên Giang',
        hotelStatus: true,
        hotelType: 'Beach Resort',
        hotelImage: 'sunset_bay.jpg',
        description: 'Khu nghỉ dưỡng với tầm nhìn hoàng hôn tuyệt đẹp tại Phú Quốc',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Business Tower Hotel',
        openDay: new Date('2019-09-18'),
        address: '88 Nguyễn Văn Linh, Quận 7, TP.HCM',
        hotelStatus: true,
        hotelType: 'Business',
        hotelImage: 'business_tower.jpg',
        description: 'Khách sạn cao cấp dành cho doanh nhân tại khu vực Phú Mỹ Hưng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Highland Retreat',
        openDay: new Date('2022-01-10'),
        address: '15 Hùng Vương, TP. Sapa, Lào Cai',
        hotelStatus: true,
        hotelType: 'Mountain Resort',
        hotelImage: 'highland_retreat.jpg',
        description: 'Khu nghỉ dưỡng trên cao với tầm nhìn ra thung lũng Sapa',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('hotel', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Riverside Resort',
        openDay: new Date('2019-05-20'),
        address: '45 Trần Phú, Quận Hải Châu, Đà Nẵng',
        hotelStatus: true,
        hotelType: 'Resort',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Capital Suites',
        openDay: new Date('2017-11-10'),
        address: '78 Lý Thường Kiệt, Quận Hoàn Kiếm, Hà Nội',
        hotelStatus: true,
        hotelType: 'Business',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Ocean View Hotel',
        openDay: new Date('2020-02-28'),
        address: '15 Trần Phú, TP. Nha Trang, Khánh Hòa',
        hotelStatus: true,
        hotelType: 'Beach Resort',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Mountain Retreat',
        openDay: new Date('2019-12-05'),
        address: '28 Nguyễn Chí Thanh, TP. Đà Lạt, Lâm Đồng',
        hotelStatus: true,
        hotelType: 'Boutique',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'City Comfort Inn',
        openDay: new Date('2021-03-15'),
        address: '56 Lê Lợi, Quận 1, TP.HCM',
        hotelStatus: true,
        hotelType: 'Budget',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Heritage Palace',
        openDay: new Date('2018-07-22'),
        address: '101 Phan Chu Trinh, Quận Hoàn Kiếm, Hà Nội',
        hotelStatus: true,
        hotelType: 'Historic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Sunset Bay Resort',
        openDay: new Date('2020-11-30'),
        address: '23 Võ Nguyên Giáp, Phú Quốc, Kiên Giang',
        hotelStatus: true,
        hotelType: 'Beach Resort',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Business Tower Hotel',
        openDay: new Date('2019-09-18'),
        address: '88 Nguyễn Văn Linh, Quận 7, TP.HCM',
        hotelStatus: true,
        hotelType: 'Business',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelName: 'Highland Retreat',
        openDay: new Date('2022-01-10'),
        address: '15 Hùng Vương, TP. Sapa, Lào Cai',
        hotelStatus: true,
        hotelType: 'Mountain Resort',
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
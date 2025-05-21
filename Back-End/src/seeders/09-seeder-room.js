'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('room', [
      {
        hotelId: 1,
        roomName: 'Deluxe King 101',
        roomType: 'Deluxe',
        roomStatus: 'Available',
        maxCustomer: 2,
        maxRoom: 10,
        price: 1500000.00,
        roomImage: 'deluxe_king.jpg',
        averageRating: 4.0,
        totalReview: 5,
        description: 'Phòng sang trọng với giường King size, tầm nhìn ra thành phố và đầy đủ tiện nghi cao cấp',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 1,
        roomName: 'Superior Twin 102',
        roomType: 'Superior',
        roomStatus: 'Available',
        maxCustomer: 2,
        maxRoom: 10,
        price: 1200000.00,
        roomImage: 'superior_twin.jpg',
        averageRating: 3.0,
        totalReview: 3,
        description: 'Phòng tiêu chuẩn với hai giường đơn, phù hợp cho bạn bè hoặc đồng nghiệp',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 1,
        roomName: 'Executive Suite 103',
        roomType: 'Suite',
        roomStatus: 'Available',
        maxCustomer: 3,
        maxRoom: 10,
        price: 2500000.00,
        roomImage: 'executive_suite.jpg',
        averageRating: 5.0,
        totalReview: 8,
        description: 'Phòng suite rộng rãi với phòng khách riêng biệt, bồn tắm jacuzzi và dịch vụ VIP',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 2,
        roomName: 'Garden View 201',
        roomType: 'Deluxe',
        roomStatus: 'Available',
        maxCustomer: 2,
        maxRoom: 10,
        price: 1800000.00,
        roomImage: 'garden_view.jpg',
        averageRating: 4.0,
        totalReview: 4,
        description: 'Phòng với tầm nhìn ra khu vườn nhiệt đới xinh đẹp của khu nghỉ dưỡng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 2,
        roomName: 'Ocean View 202',
        roomType: 'Premium',
        roomStatus: 'Available',
        maxCustomer: 2,
        maxRoom: 10,
        price: 2200000.00,
        roomImage: 'ocean_view.jpg',
        averageRating: 5.0,
        totalReview: 6,
        description: 'Phòng cao cấp với ban công riêng và tầm nhìn ra biển tuyệt đẹp',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 3,
        roomName: 'Business Room 301',
        roomType: 'Business',
        roomStatus: 'Available',
        maxCustomer: 1,
        maxRoom: 10,
        price: 1300000.00,
        roomImage: 'business_room.jpg',
        averageRating: 3.5,
        totalReview: 2,
        description: 'Phòng thiết kế dành cho doanh nhân với bàn làm việc rộng và ghế ergonomic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 3,
        roomName: 'Family Room 302',
        roomType: 'Family',
        roomStatus: 'Available',
        maxCustomer: 4,
        maxRoom: 10,
        price: 2000000.00,
        roomImage: 'family_room.jpg',
        averageRating: 4.5,
        totalReview: 4,
        description: 'Phòng rộng rãi dành cho gia đình với giường đôi và hai giường đơn',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 4,
        roomName: 'Beach Front 401',
        roomType: 'Premium',
        roomStatus: 'Available',
        maxCustomer: 2,
        maxRoom: 10,
        price: 2800000.00,
        roomImage: 'beach_front.jpg',
        averageRating: 5.0,
        totalReview: 7,
        description: 'Phòng cao cấp với lối đi trực tiếp ra bãi biển riêng của khách sạn',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 5,
        roomName: 'Mountain View 501',
        roomType: 'Deluxe',
        roomStatus: 'Available',
        maxCustomer: 2,
        maxRoom: 10,
        price: 1900000.00,
        roomImage: 'mountain_view.jpg',
        averageRating: 4.0,
        totalReview: 3,
        description: 'Phòng với tầm nhìn ra núi đồi Đà Lạt, có lò sưởi và ban công riêng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 6,
        roomName: 'Standard Room 601',
        roomType: 'Standard',
        roomStatus: 'Available',
        maxCustomer: 2,
        maxRoom: 10,
        price: 900000.00,
        roomImage: 'standard_room.jpg',
        averageRating: 3.0,
        totalReview: 2,
        description: 'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản, phù hợp cho khách du lịch tiết kiệm',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('room', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};
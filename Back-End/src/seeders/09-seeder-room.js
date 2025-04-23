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
        equipmentAndMinibar: 'TV, Mini-fridge, Safe, Coffee maker',
        maxCustomer: 2,
        price: 1500000.00,
        roomImage: 'deluxe_king.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 1,
        roomName: 'Superior Twin 102',
        roomType: 'Superior',
        roomStatus: 'Available',
        equipmentAndMinibar: 'TV, Mini-fridge, Safe',
        maxCustomer: 2,
        price: 1200000.00,
        roomImage: 'superior_twin.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 1,
        roomName: 'Executive Suite 103',
        roomType: 'Suite',
        roomStatus: 'Available',
        equipmentAndMinibar: 'TV, Mini-fridge, Safe, Coffee maker, Jacuzzi',
        maxCustomer: 3,
        price: 2500000.00,
        roomImage: 'executive_suite.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 2,
        roomName: 'Garden View 201',
        roomType: 'Deluxe',
        roomStatus: 'Available',
        equipmentAndMinibar: 'TV, Mini-fridge, Safe, Coffee maker',
        maxCustomer: 2,
        price: 1800000.00,
        roomImage: 'garden_view.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 2,
        roomName: 'Ocean View 202',
        roomType: 'Premium',
        roomStatus: 'Available',
        equipmentAndMinibar: 'TV, Mini-fridge, Safe, Coffee maker, Balcony',
        maxCustomer: 2,
        price: 2200000.00,
        roomImage: 'ocean_view.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 3,
        roomName: 'Business Room 301',
        roomType: 'Business',
        roomStatus: 'Available',
        equipmentAndMinibar: 'TV, Mini-fridge, Safe, Coffee maker, Work desk',
        maxCustomer: 1,
        price: 1300000.00,
        roomImage: 'business_room.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 3,
        roomName: 'Family Room 302',
        roomType: 'Family',
        roomStatus: 'Available',
        equipmentAndMinibar: 'TV, Mini-fridge, Safe, Coffee maker, Extra beds',
        maxCustomer: 4,
        price: 2000000.00,
        roomImage: 'family_room.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 4,
        roomName: 'Beach Front 401',
        roomType: 'Premium',
        roomStatus: 'Available',
        equipmentAndMinibar: 'TV, Mini-fridge, Safe, Coffee maker, Direct beach access',
        maxCustomer: 2,
        price: 2800000.00,
        roomImage: 'beach_front.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 5,
        roomName: 'Mountain View 501',
        roomType: 'Deluxe',
        roomStatus: 'Available',
        equipmentAndMinibar: 'TV, Mini-fridge, Safe, Coffee maker, Fireplace',
        maxCustomer: 2,
        price: 1900000.00,
        roomImage: 'mountain_view.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 6,
        roomName: 'Standard Room 601',
        roomType: 'Standard',
        roomStatus: 'Available',
        equipmentAndMinibar: 'TV, Mini-fridge',
        maxCustomer: 2,
        price: 900000.00,
        roomImage: 'standard_room.jpg',
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
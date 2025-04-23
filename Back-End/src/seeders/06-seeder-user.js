'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user', [
      {
        hotelId: 1,
        accountId: 1,
        roleId: 1,
        userName: 'admin',
        fullName: 'System Administrator',
        userStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 1,
        accountId: 2,
        roleId: 2,
        userName: 'manager1',
        fullName: 'John Manager',
        userStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 1,
        accountId: 3,
        roleId: 3,
        userName: 'receptionist1',
        fullName: 'Sarah Receptionist',
        userStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 2,
        accountId: null,
        roleId: 2,
        userName: 'manager2',
        fullName: 'Robert Manager',
        userStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 2,
        accountId: null,
        roleId: 3,
        userName: 'receptionist2',
        fullName: 'Emily Receptionist',
        userStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 3,
        accountId: null,
        roleId: 2,
        userName: 'manager3',
        fullName: 'Michael Manager',
        userStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 3,
        accountId: null,
        roleId: 4,
        userName: 'housekeeping1',
        fullName: 'Lisa Housekeeping',
        userStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 4,
        accountId: null,
        roleId: 5,
        userName: 'restaurant1',
        fullName: 'David Restaurant',
        userStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 5,
        accountId: null,
        roleId: 6,
        userName: 'maintenance1',
        fullName: 'James Maintenance',
        userStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hotelId: 6,
        accountId: null,
        roleId: 7,
        userName: 'security1',
        fullName: 'Thomas Security',
        userStatus: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};
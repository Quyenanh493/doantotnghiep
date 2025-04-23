'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('rolepermission', [
      // Admin has all permissions
      {
        roleId: 1, // Admin
        permissionId: 1, // manage_users
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1, // Admin
        permissionId: 2, // manage_roles
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1, // Admin
        permissionId: 3, // manage_bookings
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1, // Admin
        permissionId: 4, // manage_rooms
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1, // Admin
        permissionId: 5, // manage_amenities
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1, // Admin
        permissionId: 6, // view_reports
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1, // Admin
        permissionId: 7, // manage_payments
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1, // Admin
        permissionId: 8, // manage_hotel
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1, // Admin
        permissionId: 9, // view_customer_data
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1, // Admin
        permissionId: 10, // manage_maintenance
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Manager permissions
      {
        roleId: 2, // Manager
        permissionId: 3, // manage_bookings
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 4, // manage_rooms
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 5, // manage_amenities
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 6, // view_reports
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 7, // manage_payments
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // Manager
        permissionId: 9, // view_customer_data
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Receptionist permissions
      {
        roleId: 3, // Receptionist
        permissionId: 3, // manage_bookings
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3, // Receptionist
        permissionId: 7, // manage_payments
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3, // Receptionist
        permissionId: 9, // view_customer_data
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Housekeeping permissions
      {
        roleId: 4, // Housekeeping
        permissionId: 10, // manage_maintenance
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('rolepermission', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};
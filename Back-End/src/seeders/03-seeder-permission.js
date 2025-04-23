'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('permission', [
      {
        permissionName: 'manage_users',
        description: 'Create, update, and delete user accounts',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'manage_roles',
        description: 'Create, update, and delete roles',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'manage_bookings',
        description: 'Create, update, and delete bookings',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'manage_rooms',
        description: 'Create, update, and delete rooms',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'manage_amenities',
        description: 'Create, update, and delete amenities',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'view_reports',
        description: 'Access to financial and operational reports',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'manage_payments',
        description: 'Process and manage payments',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'manage_hotel',
        description: 'Update hotel information and settings',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'view_customer_data',
        description: 'Access to customer information',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        permissionName: 'manage_maintenance',
        description: 'Create and manage maintenance tasks',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('permission', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};
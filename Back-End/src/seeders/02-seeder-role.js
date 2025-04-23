'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('role', [
      {
        roleName: 'Admin',
        description: 'System administrator with full access',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Manager',
        description: 'Hotel manager with access to most features',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Receptionist',
        description: 'Front desk staff handling check-ins and bookings',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Housekeeping',
        description: 'Staff responsible for room maintenance',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Restaurant Staff',
        description: 'Staff handling food and beverage services',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Maintenance',
        description: 'Technical staff for facility maintenance',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Security',
        description: 'Staff responsible for hotel security',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Concierge',
        description: 'Staff assisting guests with various services',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Sales',
        description: 'Staff handling marketing and sales',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleName: 'Accountant',
        description: 'Staff handling financial matters',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('role', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true, 
    });
  }
};
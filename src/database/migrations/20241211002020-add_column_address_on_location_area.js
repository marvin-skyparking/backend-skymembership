'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add columns 'address' and 'coordinate' to 'location_area' table
    await queryInterface.addColumn('location_area', 'address', {
      type: Sequelize.TEXT,
      allowNull: true, // Adjust as needed based on your requirements
    });

    await queryInterface.addColumn('location_area', 'coordinate', {
      type: Sequelize.STRING,
      allowNull: true, // Adjust as needed based on your requirements
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove columns 'address' and 'coordinate' from 'location_area' table
    await queryInterface.removeColumn('location_area', 'address');
    await queryInterface.removeColumn('location_area', 'coordinate');
  }
};

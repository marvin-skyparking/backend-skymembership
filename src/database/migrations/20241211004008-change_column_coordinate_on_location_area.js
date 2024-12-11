'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Change 'coordinate' column type to JSON in 'location_area' table
    await queryInterface.changeColumn('location_area', 'coordinate', {
      type: Sequelize.JSON,
      allowNull: true, // Adjust as needed based on your requirements
    });
  },

  async down (queryInterface, Sequelize) {
    // Revert 'coordinate' column type to STRING in 'location_area' table
    await queryInterface.changeColumn('location_area', 'coordinate', {
      type: Sequelize.STRING,
      allowNull: true, // Adjust as needed based on your requirements
    });
  }
};

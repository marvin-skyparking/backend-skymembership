'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add column minimum_point to the location_area table
    await queryInterface.addColumn('location_area', 'minimum_point', {
      type: Sequelize.INTEGER, // Adjust type as per requirements
      allowNull: false, // Mandatory column
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the column minimum_point from the location_area table
    await queryInterface.removeColumn('location_area', 'minimum_point');
  },
};


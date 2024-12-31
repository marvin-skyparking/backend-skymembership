'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the location_name column to the customer_membership_detail table
    await queryInterface.addColumn('customer_membership_detail', 'location_name', {
      type: Sequelize.STRING, // Set the data type as STRING
      allowNull: false,        // Adjust based on whether the column should allow null values
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the location_name column from the customer_membership_detail table
    await queryInterface.removeColumn('customer_membership_detail', 'location_name');
  }
};

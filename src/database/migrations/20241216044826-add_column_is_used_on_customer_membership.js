'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Adding `is_used` column to the `customer_membership` table with a default value of 0
    await queryInterface.addColumn('customer_membership', 'is_used', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value set to 0
    });
  },

  async down (queryInterface, Sequelize) {
    // Reverting the changes by removing the `is_used` column
    await queryInterface.removeColumn('customer_membership', 'is_used');
  }
};

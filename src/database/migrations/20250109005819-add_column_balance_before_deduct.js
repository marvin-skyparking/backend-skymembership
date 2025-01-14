'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add columns balance_before and balance_after to the check_in_history table
    await queryInterface.addColumn('check_in_history', 'balance_before', {
      type: Sequelize.INTEGER, // Adjust the type based on your requirements
      allowNull: true, // Optional column
    });

    await queryInterface.addColumn('check_in_history', 'balance_after', {
      type: Sequelize.INTEGER, // Adjust the type based on your requirements
      allowNull: true, // Optional column
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the columns balance_before and balance_after from the check_in_history table
    await queryInterface.removeColumn('check_in_history', 'balance_before');
    await queryInterface.removeColumn('check_in_history', 'balance_after');
  }
};

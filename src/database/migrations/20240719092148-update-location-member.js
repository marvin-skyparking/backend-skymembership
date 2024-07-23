'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add a unique constraint to the 'Code' column
    await queryInterface.addIndex('location_member', ['Code'], {
      unique: true,
      name: 'unique_code_index'
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove the unique constraint from the 'Code' column
    await queryInterface.removeIndex('location_member', 'unique_code_index');
  }
};

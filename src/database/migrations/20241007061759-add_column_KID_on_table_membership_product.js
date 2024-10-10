'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding the 'KID' column to the 'membership_product' table
    await queryInterface.addColumn('membership_product', 'KID', {
      type: Sequelize.STRING, // VARCHAR equivalent
      allowNull: false, // Adjust this as per your requirement
    });
  },

  async down(queryInterface, Sequelize) {
    // Removing the 'KID' column in case of rollback
    await queryInterface.removeColumn('membership_product', 'KID');
  }
};

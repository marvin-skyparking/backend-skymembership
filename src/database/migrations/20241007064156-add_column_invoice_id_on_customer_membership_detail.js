'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding the 'invoice_id' column to the 'customer_membership_detail' table
    await queryInterface.addColumn('customer_membership_detail', 'invoice_id', {
      type: Sequelize.STRING, // Assuming invoice_id is a string (adjust the type as needed)
      allowNull: true, // You can change this to false if invoice_id should be required
    });
  },

  async down(queryInterface, Sequelize) {
    // Removing the 'invoice_id' column in case of rollback
    await queryInterface.removeColumn('customer_membership_detail', 'invoice_id');
  }
};

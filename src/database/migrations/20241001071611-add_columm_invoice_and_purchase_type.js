'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding new columns to an existing table
    await queryInterface.addColumn('transaction_customer_history', 'invoice_id', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true, // Make it unique
    });

    await queryInterface.addColumn('transaction_customer_history', 'purchase_type', {
      type: Sequelize.ENUM('MEMBERSHIP', 'TOPUP'),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Removing the columns in case of a rollback
    await queryInterface.removeColumn('transaction_customer_history', 'invoice_id');
    await queryInterface.removeColumn('transaction_customer_history', 'purchase_type');
  }
};

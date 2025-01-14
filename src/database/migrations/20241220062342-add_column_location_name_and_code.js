'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add `location_code` and `location_name` columns
     */
    await queryInterface.addColumn('transaction_customer_history', 'location_code', {
      type: Sequelize.STRING,
      allowNull: true, // Optional
    });

    await queryInterface.addColumn('transaction_customer_history', 'location_name', {
      type: Sequelize.STRING,
      allowNull: true, // Optional
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Remove `location_code` and `location_name` columns
     */
    await queryInterface.removeColumn('transaction_customer_history', 'location_code');
    await queryInterface.removeColumn('transaction_customer_history', 'location_name');
  },
};

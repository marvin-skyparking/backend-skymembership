'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the `periode` column to the `membership_product` table
    await queryInterface.addColumn('membership_product', 'periode', {
      type: Sequelize.ENUM(
        '1 Bulan', '2 Bulan', '3 Bulan', '4 Bulan', '5 Bulan', 
        '6 Bulan', '7 Bulan', '8 Bulan', '9 Bulan', '10 Bulan', 
        '11 Bulan', '12 Bulan'
      ),
      allowNull: false, // Set to false if this column is mandatory
      defaultValue: '1 Bulan', // Default value
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the `periode` column from the `membership_product` table
    await queryInterface.removeColumn('membership_product', 'periode');
  },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Payments', 'virtualAccountNo', {
      type: Sequelize.STRING,
      allowNull: false, // Set to false if this column should not allow null values
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Payments', 'virtualAccountNo');
  }
};


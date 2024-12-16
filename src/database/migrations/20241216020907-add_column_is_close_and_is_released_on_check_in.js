'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('check_in_history', 'is_close', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('check_in_history', 'is_released', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('check_in_history', 'is_close');
    await queryInterface.removeColumn('check_in_history', 'is_released');
  }
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('master_card', 'tennant_code', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
    await queryInterface.addColumn('master_card', 'tennant_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
    await queryInterface.addColumn('master_card', 'card_type', {
      type: Sequelize.ENUM('PERSONAL', 'TENNANT', 'COMPLIMENT', 'NOT_USED'),
      allowNull: false,
      defaultValue: 'NOT_USED',
    });

    await queryInterface.addColumn('master_card', 'start_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('master_card', 'end_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('master_card', 'tennant_code');
    await queryInterface.removeColumn('master_card', 'tennant_name');
    await queryInterface.removeColumn('master_card', 'card_type');
    await queryInterface.removeColumn('master_card', 'start_date');
    await queryInterface.removeColumn('master_card', 'end_date');
  }
};
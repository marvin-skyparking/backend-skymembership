'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('check_in_history', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      plate_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status_member: {
        type: Sequelize.ENUM('MEMBER', 'NON-MEMBER'), // Example ENUM values
        allowNull: false,
      },
      tariff: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      check_in_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      gate_in_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      checkout_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      gate_out_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('check_in_history');
  },
};

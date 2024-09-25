'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('location_area', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      location_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Add unique constraint
      },
      location_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      KID: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Add unique constraint
      },
      Create_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Update_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('location_area');
  },
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer_membership', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      vehicle_type:{
        type: Sequelize.ENUM('MOTOR','MOBIL')
      },
      cust_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Member_Customer', // Ensure this matches the table name exactly
          key: 'id', // Ensure this matches the column name exactly
        }
      },
      member_customer_no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensuring this is unique across the table
      },
      rfid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      plate_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      plate_number_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      stnk_image: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('customer_membership');
  },
};

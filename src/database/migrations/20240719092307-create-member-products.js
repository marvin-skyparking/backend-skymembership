'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('location_member', {
      Id: {
        type: Sequelize.UUID,  // Ensure UUID type is used
        allowNull: false,
        primaryKey: true
      },
      Code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      Name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.createTable('member_products', {
      Id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      ProductName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ProductDescription: {
        type: Sequelize.STRING
      },
      VehicleType: {
        type: Sequelize.STRING
      },
      Price: {
        type: Sequelize.DECIMAL(16, 2),
        allowNull: false
      },
      IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      LocationCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('member_products');
    await queryInterface.dropTable('location_member');
  }
};

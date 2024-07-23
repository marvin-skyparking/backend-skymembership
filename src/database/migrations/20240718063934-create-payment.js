'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      customerNo: {
        type: Sequelize.STRING
      },
      signToString: {
        type: Sequelize.STRING
      },
      xtimestamp: {
        type: Sequelize.DATE
      },
      xexternalid: {
        type: Sequelize.STRING
      },
      AsymetricSignature: {
        type: Sequelize.STRING
      },
      channelId: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      refernceNo: {
        type: Sequelize.STRING
      },
      status_payment: {
        type: Sequelize.STRING
      },
      tagID: {
        type: Sequelize.STRING
      },
      flagType: {
        type: Sequelize.STRING
      },
      trxDateTime: {
        type: Sequelize.DATE
      },
      flagAdvise: {
        type: Sequelize.STRING
      },
      billDetails: {
        type: Sequelize.JSON
      },
      additionalInfo: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  }
};
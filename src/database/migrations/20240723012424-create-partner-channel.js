'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PartnerChannels', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      ProviderName: {
        type: Sequelize.STRING
      },
      Description: {
        type: Sequelize.STRING
      },
      ChannelId: {
        type: Sequelize.STRING
      },
      BankId: {
        type: Sequelize.STRING
      },
      PartnerServiceId: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('PartnerChannels');
  }
};
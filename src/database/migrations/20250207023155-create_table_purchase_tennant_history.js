'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tennant_purchase_history', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      invoice_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      virtual_account_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      virtual_account_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      trx_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      price: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      periode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status_payment: {
        type: Sequelize.ENUM('PENDING', 'COMPLETED', 'FAILED'),
        allowNull: false
      },
      status_progress: {
        type: Sequelize.ENUM('INITIATED', 'PROCESSING', 'COMPLETED'),
        allowNull: false
      },
      admin_fee: {
        type: Sequelize.STRING,
        allowNull: false
      },
      total_admin_fee: {
        type: Sequelize.STRING,
        allowNull: false
      },
      total_price: {
        type: Sequelize.STRING,
        allowNull: false
      },
      additonal_fee: {
        type: Sequelize.STRING,
        allowNull: true
      },
      expired_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      type_payment: {
        type: Sequelize.STRING,
        allowNull: false
      },
      purchase_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tennant_purchase_history');
  }
};

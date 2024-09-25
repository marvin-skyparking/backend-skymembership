'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaction_customer_history', {
      Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Member_Customer', // Ensure this matches the actual table name
          key: 'id', // The primary key of Member_Customer
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Adjust as needed
      },
      virtual_account: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      trxId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      periode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      statusPayment: {
        type: Sequelize.ENUM('PAID', 'PENDING', 'FAILED'),
        allowNull: false,
      },
      transactionType: {
        type: Sequelize.ENUM('E_WALLET', 'VIRTUAL_ACCOUNT', 'QRIS', 'PAYLATER', 'CREDIT_CARD', 'DEBIT_CARD'),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaction_customer_history');
  }
};

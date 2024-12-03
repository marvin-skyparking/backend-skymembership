'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the `member_customer_no` column after the `Cust_Member` column
    await queryInterface.addColumn('customer_membership_detail', 'member_customer_no', {
      type: Sequelize.STRING, // Adjust the type as necessary
      allowNull: false, // Optional column
      comment: 'Member Customer Number', // Optional description
    }, {
      after: 'Cust_Member', // Ensures the column is added after `Cust_Member`
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the `member_customer_no` column
    await queryInterface.removeColumn('customer_membership_detail', 'member_customer_no');
  },
};

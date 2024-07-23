'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('member_products', {
      fields: ['LocationCode'],
      type: 'foreign key',
      name: 'fk_member_products_location_code',
      references: {
        table: 'location_member',
        field: 'Code'
      },
      onDelete: 'CASCADE', // or 'SET NULL', 'RESTRICT' depending on your needs
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('member_products', 'fk_member_products_location_code');
  }
};

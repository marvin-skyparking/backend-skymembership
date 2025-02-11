'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding columns to location_area table
    await queryInterface.addColumn('location_area', 'region_coordinator', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('location_area', 'category', {
      type: Sequelize.ENUM(
        'Apartment', 
        'Retails & Malls', 
        'Ruko & Office', 
        'Office', 
        'Hospital', 
        'External', 
        'Others', 
        'School / University',
        'NOT SET'
      ),
      allowNull: true,
      defaultValue: 'NOT SET'
    });

    await queryInterface.addColumn('location_area', 'vendor', {
      type: Sequelize.ENUM('UNO', 'SKYNET', 'LIQUID', 'EZITAMA'),
      allowNull: true
    });

    await queryInterface.addColumn('location_area', 'region', {
      type: Sequelize.ENUM(
        'REGION 1', 
        'REGION 2', 
        'REGION 3', 
        'REGION 4', 
        'REGION 5', 
        'REGION 6', 
        'REGION 7', 
        'REGION 8'
      ),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Removing columns from location_area table
    await queryInterface.removeColumn('location_area', 'region_coordinator');
    await queryInterface.removeColumn('location_area', 'category');
    await queryInterface.removeColumn('location_area', 'vendor');
    await queryInterface.removeColumn('location_area', 'region');
  }
};

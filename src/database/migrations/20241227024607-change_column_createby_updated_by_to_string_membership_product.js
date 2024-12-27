'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Alter the 'Create_by' and 'Update_by' columns from INTEGER to STRING
    await queryInterface.changeColumn('membership_product', 'Create_by', {
      type: Sequelize.STRING,
      allowNull: false, // Adjust if needed (use false if you want to disallow NULLs)
    });

    await queryInterface.changeColumn('membership_product', 'Update_by', {
      type: Sequelize.STRING,
      allowNull: false, // Adjust if needed
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes made in the up function
    await queryInterface.changeColumn('membership_product', 'Create_by', {
      type: Sequelize.INTEGER,
      allowNull: false, // Adjust if needed
    });

    await queryInterface.changeColumn('membership_product', 'Update_by', {
      type: Sequelize.INTEGER,
      allowNull: false, // Adjust if needed
    });
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Histories", "additionalFeeDescription", {
      type: Sequelize.STRING,
      allowNull: true, // Cho phép null nếu không có mô tả
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Histories", "additionalFeeDescription");
  }
};

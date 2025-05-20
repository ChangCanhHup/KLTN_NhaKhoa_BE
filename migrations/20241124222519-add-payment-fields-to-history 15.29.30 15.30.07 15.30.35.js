"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Histories", "paymentMethod", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null, // Phương thức thanh toán mặc định
    });
    await queryInterface.addColumn("Histories", "paymentStatus", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Mặc định là chưa thanh toán
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Histories", "paymentMethod");
    await queryInterface.removeColumn("Histories", "paymentStatus");
  },
};

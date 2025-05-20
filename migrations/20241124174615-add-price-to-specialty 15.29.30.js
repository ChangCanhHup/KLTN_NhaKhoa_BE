"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Specialties", "price", {
      type: Sequelize.FLOAT, // Hoặc Sequelize.DECIMAL(10, 2) nếu cần độ chính xác cao
      allowNull: false, // Bắt buộc phải có giá trị
      defaultValue: 0, // Giá trị mặc định ban đầu
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Specialties", "price");
  },
};

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "medicalHistoryHTML", {
      type: Sequelize.TEXT,
      allowNull: true, // Cho phép giá trị null
    });
    await queryInterface.addColumn("Users", "medicalHistoryMarkdown", {
      type: Sequelize.TEXT,
      allowNull: true, // Cho phép giá trị null
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "medicalHistoryHTML");
    await queryInterface.removeColumn("Users", "medicalHistoryMarkdown");
  },
};

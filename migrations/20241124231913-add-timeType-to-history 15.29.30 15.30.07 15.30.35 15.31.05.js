module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Histories", "timeType", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Histories", "timeType");
  },
};

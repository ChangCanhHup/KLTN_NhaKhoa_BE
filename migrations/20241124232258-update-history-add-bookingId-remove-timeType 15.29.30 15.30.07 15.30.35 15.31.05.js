module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thêm trường bookingId
    await queryInterface.addColumn("Histories", "bookingId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    // Loại bỏ trường timeType
    await queryInterface.removeColumn("Histories", "timeType");
  },
  down: async (queryInterface, Sequelize) => {
    // Khôi phục trường timeType
    await queryInterface.addColumn("Histories", "timeType", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    // Xóa trường bookingId
    await queryInterface.removeColumn("Histories", "bookingId");
  },
};

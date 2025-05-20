"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thêm cột specialtyId vào bảng Booking
    await queryInterface.addColumn("Bookings", "specialtyId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Specialties", // Tên bảng Specialty
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // Thay đổi hoặc xóa phụ thuộc vào logic
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa cột price từ bảng Drug
    await queryInterface.removeColumn("Drugs", "price");

    // Xóa cột specialtyId từ bảng Booking
    await queryInterface.removeColumn("Bookings", "specialtyId");
  },
};

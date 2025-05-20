"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    static associate(models) {
      // Liên kết với bác sĩ
      History.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
        as: "doctorDataHistory",
      });
      // Liên kết với bệnh nhân
      History.belongsTo(models.User, {
        foreignKey: "patientId",
        targetKey: "id",
        as: "patientData",
      });
      // Liên kết với dịch vụ khám (Specialty)
      History.belongsTo(models.Specialty, {
        foreignKey: "specialtyId",
        targetKey: "id",
        as: "specialtyDataHistory",
      });
      History.belongsTo(models.Booking, {
        foreignKey: "bookingId",
        targetKey: "id",
        as: "bookingData",
      });
    }
  }
  History.init(
    {
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Bắt buộc phải có
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Bắt buộc phải có
      },
      bookingId: {
        type: DataTypes.INTEGER, // Liên kết với booking
        allowNull: false,
      },
      specialtyId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Có thể null nếu không liên quan đến dịch vụ khám
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      files: {
        type: DataTypes.TEXT, // Lưu ảnh hóa đơn hoặc file đính kèm
        allowNull: true,
      },
      drugs: {
        type: DataTypes.TEXT, // JSON lưu danh sách thuốc
        allowNull: true,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bills: {
        type: DataTypes.TEXT, // Lưu JSON hoặc file hóa đơn
        allowNull: true,
      },
      teethExamined: {
        type: DataTypes.TEXT, // JSON lưu danh sách răng đã khám
        allowNull: true,
      },
      examinationFee: {
        type: DataTypes.FLOAT, // Phí khám
        allowNull: false,
        defaultValue: 0.0,
      },
      additionalFee: {
        type: DataTypes.FLOAT, // Phí phát sinh
        allowNull: false,
        defaultValue: 0.0,
      },
      additionalFeeDescription: {
        type: DataTypes.STRING, // Mô tả phí phát sinh
        allowNull: true,
      },
      totalFee: {
        type: DataTypes.FLOAT, // Tổng phí
        allowNull: false,
        defaultValue: 0.0,
      },
      totalDiscount: {
        type: DataTypes.FLOAT, // Tổng giảm giá
        allowNull: false,
        defaultValue: 0.0,
      },
      paymentMethod: {
        type: DataTypes.STRING, // Phương thức thanh toán (tiền mặt, chuyển khoản, v.v.)
        allowNull: true,
      },
      paymentStatus: {
        type: DataTypes.BOOLEAN, // Trạng thái thanh toán (true: đã thanh toán, false: chưa thanh toán)
        allowNull: false,
        defaultValue: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "History",
    }
  );
  return History;
};

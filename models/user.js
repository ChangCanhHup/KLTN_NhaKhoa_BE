"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Allcode, {
        foreignKey: "positionId",
        targetKey: "keyMap",
        as: "positionData",
      });
      User.belongsTo(models.Allcode, {
        foreignKey: "gender",
        targetKey: "keyMap",
        as: "genderData",
      });
      User.hasOne(models.Markdown, { foreignKey: "doctorId" });
      User.hasOne(models.Doctor_Infor, { foreignKey: "doctorId" });
      User.hasMany(models.Schedule, {
        foreignKey: "doctorId",
        as: "doctorData",
      });
      User.hasMany(models.History, {
        foreignKey: "doctorId",
        as: "doctorDataHistory",
      });
      User.hasMany(models.Booking, {
        foreignKey: "patientId",
        as: "patientData",
      });
      User.hasMany(models.Invoice, {
        foreignKey: "doctorId",
        as: "doctorDataInvoice",
      });
      User.hasMany(models.Invoice, {
        foreignKey: "patientId",
        as: "patientDataInvoice",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      phonenumber: DataTypes.STRING,
      gender: DataTypes.STRING,
      image: DataTypes.TEXT,
      roleId: DataTypes.STRING,
      positionId: DataTypes.STRING,
      tokenUser: DataTypes.STRING,
      totalCost: DataTypes.INTEGER,
      totalRevenue: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      medicalHistoryHTML: DataTypes.TEXT, // Trường mới cho HTML
      medicalHistoryMarkdown: DataTypes.TEXT, // Trường mới cho Markdown
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};

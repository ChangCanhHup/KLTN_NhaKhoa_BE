import { Op } from "sequelize";
import db from "../models/index";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

// Lấy lịch sử đặt lịch theo patientId
let getBookingByPatientId = (patientId, startDate, endDate) => {
  return new Promise(async (resolve, reject) => {
    try {
      let whereClause = { patientId };
      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.lt]: new Date(
            new Date(endDate).getTime() + 60 * 60 * 24 * 1000 - 1
          ),
          [Op.gt]: new Date(startDate),
        };
      }

      let bookings = await db.Booking.findAll({
        where: whereClause,
        include: [
          {
            model: db.User,
            as: "patientData",
            attributes: ["id", "email", "firstName", "lastName"],
          },
          {
            model: db.Allcode,
            as: "timeTypeDataPatient",
            attributes: ["keyMap", "value"],
          },
        ],
        attributes: [
          "id",
          "statusId",
          "doctorId",
          "patientId",
          "date",
          "timeType",
          "token",
          "patientName",
          "patientPhoneNumber",
          "patientAddress",
          "patientReason",
          "patientGender",
          "patientBirthday",
        ],
        order: [["date", "DESC"]],
        raw: true,
        nest: true,
      });

      resolve({ errCode: 0, data: bookings });
    } catch (e) {
      reject(e);
    }
  });
};

// Hủy lịch hẹn
let cancelBooking = (bookingId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!bookingId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter: bookingId",
        });
      } else {
        let booking = await db.Booking.findOne({
          where: { id: bookingId },
          raw: false,
        });

        if (booking) {
          await booking.destroy();
          resolve({ errCode: 0, message: "Hủy đặt lịch thành công" });
        } else {
          resolve({ errCode: 2, message: "Không tìm thấy đặt lịch" });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getBookingByPatientId,
  cancelBooking,
};

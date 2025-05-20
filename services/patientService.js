import { Op } from "sequelize";
import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;

  return result;
};
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.patientName ||
        !data.specialtyId // Kiểm tra bổ sung specialtyId
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        // Kiểm tra xem bác sĩ có lịch bận vào thời điểm này không
        let busySchedule = await db.Schedule.findOne({
          where: {
            date: data.date,
            timeType: data.timeType,
            doctorId: data.doctorId,
          },
          raw: true,
        });

        if (busySchedule) {
          // Nếu bác sĩ có lịch bận vào thời điểm này, trả về lỗi
          return resolve({
            errCode: 4,
            errMessage: "Bác sĩ đã có lịch làm việc khác vào thời gian này, vui lòng chọn thời gian khác",
          });
        }

        // Kiểm tra xem đã có lịch hẹn nào vào thời điểm này chưa
        let existingBooking = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            date: data.date,
            timeType: data.timeType,
            statusId: {
              [Op.in]: ['S2', 'S3'] // Chỉ kiểm tra các lịch hẹn đã xác nhận (S2) hoặc đã hoàn thành (S3)
            }
          },
          raw: true
        });

        if (existingBooking) {
          // Nếu đã có lịch hẹn, trả về lỗi
          return resolve({
            errCode: 3,
            errMessage: "Thời gian này đã có lịch hẹn, vui lòng chọn thời gian khác",
          });
        }

        let token = uuidv4();
        if (!data.statusId) {
          try {
            // Gửi email nhưng không chờ đợi kết quả
            emailService.sendSimpleEmail({
              receiverEmail: data.email,
              patientName: data.patientName,
              time: data.timeString,
              doctorName: data.doctorName,
              language: data.language,
              redirectLink: buildUrlEmail(data.doctorId, token),
            }).catch(error => {
              console.error("Error sending confirmation email:", error);
              // Không làm gì cả, để quá trình đặt lịch tiếp tục
            });
          } catch (emailError) {
            console.error("Error in email sending process:", emailError);
            // Không làm gì cả, để quá trình đặt lịch tiếp tục
          }
        }

        // upsert patient
        let user = await db.User.findOne({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
            gender: data.selectedGender,
            address: data.address,
            firstName: data.patientName,
          },
        });

        if (user) {
          // Create a booking record with specialtyId
          await db.Booking.create({
            statusId: data.statusId ? data.statusId : "S1",
            doctorId: data.doctorId,
            specialtyId: data.specialtyId, // Bổ sung specialtyId
            patientId: user.id,
            date: data.date,
            timeType: data.timeType,
            token: token,
            patientName: data.patientName,
            patientPhoneNumber: data.phoneNumber,
            patientAddress: data.address,
            patientReason: data.reason,
            patientGender: data.selectedGender,
            patientBirthday: data.date,
          });
        } else {
          // Hash password
          let hashPasswordFromBcrypt = await hashUserPassword(
            data.password || "123456aA@"
          );

          // Create new user
          const newUser = await db.User.create({
            email: data.email,
            password: hashPasswordFromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phonenumber: data.phoneNumber,
            gender: data.selectedGender,
            roleId: data.roleId || "R3",
            positionId: data.positionId || null,
            image: null,
            status: data.status ? data.status : 0,
            medicalHistoryHTML: data.medicalHistoryHTML || "**Chưa cập nhật**",
            medicalHistoryMarkdown:
              data.medicalHistoryMarkdown || "**Chưa cập nhật**",
          });

          // Use new user's id as patientId and create a booking record
          await db.Booking.create({
            statusId: data.statusId ? data.statusId : "S1",
            doctorId: data.doctorId,
            specialtyId: data.specialtyId, // Bổ sung specialtyId
            patientId: newUser.id,
            date: data.date,
            timeType: data.timeType,
            token: token,
            patientName: data.patientName,
            patientPhoneNumber: data.phoneNumber,
            patientAddress: data.address,
            patientReason: data.reason,
            patientGender: data.selectedGender,
            patientBirthday: data.date,
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save infor patient succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let editBooking = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.specialtyId || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let booking = await db.Booking.findOne({
          where: { id: data.id },
          raw: false, // Cần raw: false để sử dụng instance.update()
        });

        if (booking) {
          // Cập nhật các thông tin
          booking.statusId = data.statusId || booking.statusId;
          booking.specialtyId = data.specialtyId || booking.specialtyId;
          booking.doctorId = data.doctorId || booking.doctorId;
          booking.patientName = data.patientName || booking.patientName;
          booking.patientPhoneNumber =
            data.patientPhoneNumber || booking.patientPhoneNumber;
          booking.patientAddress =
            data.patientAddress || booking.patientAddress;
          booking.patientReason = data.patientReason || booking.patientReason;
          booking.patientGender = data.patientGender || booking.patientGender;
          booking.patientBirthday =
            data.patientBirthday || booking.patientBirthday;
          booking.date = data.date || booking.date;
          booking.timeType = data.timeType || booking.timeType;

          await booking.save();

          resolve({
            errCode: 0,
            errMessage: "Booking updated successfully!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Booking not found",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let postVerifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: { doctorId: data.doctorId, token: data.token, statusId: "S1" },
          raw: false,
        });

        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Update the appointment succeed!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exist!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let filterHistory = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.patientId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let startDate = data.startDate ? data.startDate : null;
        let endDate = data.endDate ? data.endDate : null;

        let dataHistories = [];
        if (startDate && endDate) {
          dataHistories = await db.History.findAll({
            where: {
              patientId: data.patientId,
              createdAt: {
                [Op.lt]: new Date(
                  new Date(endDate).getTime() + 60 * 60 * 24 * 1000 - 1
                ),
                [Op.gt]: new Date(startDate),
              },
            },
            order: [["createdAt", "DESC"]],
            include: [
              {
                model: db.User,
                as: "doctorDataHistory",
                attributes: ["id", "email", "firstName", "lastName", "image"],
                include: [
                  {
                    model: db.Doctor_Infor,
                    attributes: ["id", "doctorId", "specialtyId", "clinicId"],
                    include: [
                      {
                        model: db.Specialty,
                        as: "specialtyData",
                        attributes: ["name"],
                      },
                      {
                        model: db.Clinic,
                        as: "clinicData",
                        attributes: ["name"],
                      },
                    ],
                  },
                ],
              },
            ],
            raw: true,
            nest: true,
          });
        } else {
          dataHistories = await db.History.findAll({
            where: {
              patientId: data.patientId,
            },
            order: [["createdAt", "DESC"]],
            include: [
              {
                model: db.User,
                as: "doctorDataHistory",
                attributes: ["id", "email", "firstName", "lastName", "image"],
                include: [
                  {
                    model: db.Doctor_Infor,
                    attributes: ["id", "doctorId", "specialtyId", "clinicId"],
                    include: [
                      {
                        model: db.Specialty,
                        as: "specialtyData",
                        attributes: ["name"],
                      },
                      {
                        model: db.Clinic,
                        as: "clinicData",
                        attributes: ["name"],
                      },
                    ],
                  },
                ],
              },
            ],
            raw: true,
            nest: true,
          });
        }
        // Process image and drugs
        dataHistories = dataHistories.map((history) => {
          // Convert doctor images from base64 to binary
          if (history.doctorDataHistory && history.doctorDataHistory.image) {
            history.doctorDataHistory.image = new Buffer(
              history.doctorDataHistory.image,
              "base64"
            ).toString("binary");
          }
          if (history.files && history.files) {
            history.files = new Buffer(history.files, "base64").toString(
              "binary"
            );
          }
          // Parse drugs field if it's a JSON string

          // Process files buffer if needed (assuming it's binary data)
          if (history.files && history.files.type === "Buffer") {
            history.files = Buffer.from(history.files.data).toString("binary");
          }

          return history;
        });

        resolve({
          errCode: 0,
          data: dataHistories,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let filterZeroFeeHistory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy tất cả các lịch sử với trạng thái chưa thanh toán
      let dataHistories = await db.History.findAll({
        where: {
          paymentStatus: false, // Lọc các lịch sử chưa thanh toán
        },
        order: [["createdAt", "DESC"]],
        include: [
          // Lấy thông tin bác sĩ
          {
            model: db.User,
            as: "doctorDataHistory",
            attributes: ["id", "email", "firstName", "lastName", "image"],
            include: [
              {
                model: db.Doctor_Infor,
                attributes: ["id", "doctorId", "specialtyId", "clinicId"],
                include: [
                  {
                    model: db.Specialty,
                    as: "specialtyData",
                    attributes: ["name"],
                  },
                  {
                    model: db.Clinic,
                    as: "clinicData",
                    attributes: ["name"],
                  },
                ],
              },
            ],
          },
          // Lấy thông tin bệnh nhân
          {
            model: db.User,
            as: "patientData",
            attributes: [
              "id",
              "email",
              "firstName",
              "lastName",
              "address",
              "phonenumber",
              "gender",
            ],
          },
          // Lấy thông tin dịch vụ khám
          {
            model: db.Specialty,
            as: "specialtyDataHistory",
            attributes: ["id", "name", "price"],
          },
          // Lấy thông tin booking
          {
            model: db.Booking,
            as: "bookingData",
            attributes: [
              "id",
              "patientName",
              "patientPhoneNumber",
              "patientAddress",
            ], // Các thuộc tính bạn cần
          },
        ],
        raw: true,
        nest: true,
      });

      // Xử lý hình ảnh và dữ liệu bổ sung
      dataHistories = dataHistories.map((history) => {
        // Xử lý hình ảnh bác sĩ
        if (history.doctorDataHistory && history.doctorDataHistory.image) {
          history.doctorDataHistory.image = new Buffer(
            history.doctorDataHistory.image,
            "base64"
          ).toString("binary");
        }

        // Xử lý hình ảnh hóa đơn (nếu có)
        if (history.files && history.files.type === "Buffer") {
          history.files = Buffer.from(history.files.data).toString("binary");
        }

        // Xử lý danh sách thuốc
        if (history.drugs) {
          try {
            history.drugs = JSON.parse(history.drugs);
          } catch (error) {
            console.error("Error parsing drugs JSON:", error);
            history.drugs = [];
          }
        }

        return history;
      });

      resolve({
        errCode: 0,
        data: dataHistories,
      });
    } catch (e) {
      console.error("Error in filterZeroFeeHistory:", e);
      reject({
        errCode: -1,
        errMessage: "Internal server error",
      });
    }
  });
};

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
  filterHistory: filterHistory,
  editBooking: editBooking,
  filterZeroFeeHistory: filterZeroFeeHistory,
};

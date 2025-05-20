import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  try {
    let response = await doctorService.getTopDoctorHome(req.body); //dau cộng để convert từ string sang kiểu số nguyên
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status.json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let postInforDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInforDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status.json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getDetailDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let bulkCreateSchedule = async (req, res) => {
  try {
    let infor = await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getScheduleByDate = async (req, res) => {
  try {
    let infor = await doctorService.getScheduleByDate(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getExtraInforDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getProfileDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getProfileDoctorById(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getListPatientForDoctor = async (req, res) => {
  try {
    let infor = await doctorService.getListPatientForDoctor(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getAllPatient = async (req, res) => {
  try {
    let { searchKeyword } = req.query; // Nhận searchKeyword từ query
    let patients = await doctorService.getAllPatient(searchKeyword);
    return res.status(200).json(patients);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};


let getAllBooking = async (req, res) => {
  try {
    let infor = await doctorService.getAllBooking();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getCompletedAppointments = async (req, res) => {
  try {
    // Lấy startDate và endDate từ query parameters
    const { startDate, endDate } = req.query;

    console.log(`Controller received startDate: ${startDate}, endDate: ${endDate}`);
    console.log("Query parameters:", req.query);

    // Kiểm tra định dạng ngày tháng
    if (startDate && endDate) {
      try {
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
        console.log(`Parsed dates: ${parsedStartDate} to ${parsedEndDate}`);
      } catch (error) {
        console.error("Error parsing dates in controller:", error);
      }
    }

    // Gọi service để lấy danh sách các ca khám đã hoàn thành
    let infor = await doctorService.getCompletedAppointments(startDate, endDate);

    // Log kết quả để debug
    if (infor && infor.data) {
      console.log(`Returning ${infor.data.length} completed appointments`);
    }

    return res.status(200).json(infor);
  } catch (e) {
    console.log("Error in getCompletedAppointments controller:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getAllPatientForUser = async (req, res) => {
  try {
    let infor = await doctorService.getAllPatientForUser(req.query.date);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let changeStatusBookingById = async (req, res) => {
  try {
    // Gọi service với dữ liệu từ req.body
    const { id, statusId } = req.body;
    console.log(id, statusId);
    if (!id || !statusId) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameters",
      });
    }

    let infor = await doctorService.changeStatusBookingById(id, statusId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getBookingById = async (req, res) => {
  try {
    let infor = await doctorService.getBookingById(req.query.bookingId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let sendRemedy = async (req, res) => {
  try {
    let infor = await doctorService.sendRemedy(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let createRemedy = async (req, res) => {
  try {
    let infor = await doctorService.createRemedy(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let cancelBooking = async (req, res) => {
  try {
    let infor = await doctorService.cancelBooking(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let filterDoctors = async (req, res) => {
  try {
    let infor = await doctorService.filterDoctors(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  postInforDoctor: postInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy: sendRemedy,
  cancelBooking: cancelBooking,
  createRemedy: createRemedy,
  getBookingById: getBookingById,
  filterDoctors: filterDoctors,
  getAllBooking: getAllBooking,
  changeStatusBookingById: changeStatusBookingById,
  getAllPatientForUser: getAllPatientForUser,
  getAllPatient: getAllPatient,
  getCompletedAppointments: getCompletedAppointments,
};

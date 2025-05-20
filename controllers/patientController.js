import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
  try {
    let infor = await patientService.postBookAppointment(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let postVerifyBookAppointment = async (req, res) => {
  try {
    let infor = await patientService.postVerifyBookAppointment(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let filterHistory = async (req, res) => {
  try {
    let infor = await patientService.filterHistory(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let filterZeroFeeHistory = async (req, res) => {
  try {
    // Gọi service filterZeroFeeHistory với dữ liệu từ req.body
    let infor = await patientService.filterZeroFeeHistory();
    return res.status(200).json(infor);
  } catch (e) {
    console.error("Error in filterZeroFeeHistory controller:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Thêm hàm editBooking
let editBooking = async (req, res) => {
  try {
    let infor = await patientService.editBooking(req.body);
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
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
  filterHistory: filterHistory,
  editBooking: editBooking, // Xuất hàm editBooking
  filterZeroFeeHistory: filterZeroFeeHistory,
};

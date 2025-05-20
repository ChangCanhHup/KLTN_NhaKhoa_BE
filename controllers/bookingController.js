import bookingService from "../services/bookingService";

// Lấy lịch sử đặt lịch theo patientId
let getBookingHistoryByPatientId = async (req, res) => {
  try {
    let { patientId, startDate, endDate } = req.body;
    let history = await bookingService.getBookingByPatientId(
      patientId,
      startDate,
      endDate
    );
    return res.status(200).json(history);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Hủy lịch hẹn
let cancelBooking = async (req, res) => {
  try {
    let bookingId = req.body.bookingId;
    let result = await bookingService.cancelBooking(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  getBookingHistoryByPatientId,
  cancelBooking,
};

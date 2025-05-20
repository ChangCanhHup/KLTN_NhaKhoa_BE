require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
  try {
    // Kiểm tra email hợp lệ
    if (!dataSend.receiverEmail || !isValidEmail(dataSend.receiverEmail)) {
      console.log(`Invalid email address: ${dataSend.receiverEmail}`);
      return false; // Trả về false nếu email không hợp lệ
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_APP, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"HBT " <bookingtlmedic@gmail.com>', // sender address
      to: dataSend.receiverEmail, // list of receivers
      subject: "Thông tin đặt lịch khám răng", // Subject line
      html: getBodyHTMLEmail(dataSend),
    });

    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // Trả về false nếu có lỗi xảy ra
  }
};

// Hàm kiểm tra email hợp lệ
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

let getBodyHTMLEmail = (dataSend) => {
  console.log(dataSend);
  let result = "";
  if (dataSend.language === "vi") {
    result = `
<h3><b>Xin chào ${dataSend.patientName}!</b></h3>
<p>Bạn nhận được email này vì đã đặt lịch khám răng online trên HBT</p>
<p>Thông tin đặt lịch khám răng:</p>
<div><b>Thời gian: ${dataSend.time}</b></div>
<div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

<p>Nếu các thông tin trên là đúng sự thật, vui lòng tới khám đúng giờ.</p>

<div>Xin chân thành cảm ơn!</div>
`;
  }
  if (dataSend.language === "en") {
    result = `
    <h3><b>Dear ${dataSend.patientName}!</b></h3>
    <p>You received this email because you booked an online medical appointment on TL Medic</p>
    <p>Information to schedule an appointment:</p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor: ${dataSend.doctorName}</b></div>

    <p>If the above information is true, please click on the link below to complete the procedure to book an appointment.</p>
    <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>

    <div>Sincerely thank!</div>
    `;
  }
  return result;
};

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
<h3><b>Xin chào ${dataSend.patientName}!</b></h3>
<p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên TL Medic</p>
<p>Thông tin đơn thuốc được gửi trong file đính kèm.</p>
<div>Xin chân thành cảm ơn!</div>
`;
  }
  if (dataSend.language === "en") {
    result = `
    <h3><b>Dear ${dataSend.patientName}!</b></h3>
    <p>You received this email because you booked an online medical appointment on TL Medic</p>
    <p>bla bla</p>
    <div>Sincerely thank!</div>
    `;
  }
  return result;
};
let sendAttachment = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra email hợp lệ
      if (!dataSend.email || !isValidEmail(dataSend.email)) {
        console.log(`Invalid email address for attachment: ${dataSend.email}`);
        resolve(false); // Trả về false nếu email không hợp lệ, nhưng không reject
        return;
      }

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"HBT " <phongkhamnhakhoahbt@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Thông tin hóa đơn khám răng", // Subject line
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
          {
            // encoded string as an attachment
            filename: `remedy-${
              dataSend.patientId
            }-${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: "base64",
          },
        ],
      });

      console.log("Attachment email sent successfully:", info.messageId);
      resolve(true);
    } catch (e) {
      console.error("Error sending attachment email:", e);
      resolve(false); // Trả về false nếu có lỗi xảy ra, nhưng không reject
    }
  });
};

let sendForgotPasswordEmail = async (dataSend) => {
  try {
    // Kiểm tra email hợp lệ
    if (!dataSend.receiverEmail || !isValidEmail(dataSend.receiverEmail)) {
      console.log(`Invalid email address for password reset: ${dataSend.receiverEmail}`);
      return false; // Trả về false nếu email không hợp lệ
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_APP, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"TL Medic " <bookingtlmedic@gmail.com>', // sender address
      to: dataSend.receiverEmail, // list of receivers
      subject: "Thông tin lấy lại mật khẩu", // Subject line
      html: getBodyHTMLEmailForgotPassword(dataSend),
    });

    console.log("Password reset email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false; // Trả về false nếu có lỗi xảy ra
  }
};

let getBodyHTMLEmailForgotPassword = (dataSend) => {
  let result = "";
  result = `
<h3><b>Xin chào!</b></h3>
<p>Bạn nhận được email này vì đã yêu cầu lấy lại mật khẩu do quên mật khẩu</p>

<p>Nếu yêu cầu lấy lại mật khẩu là đúng sự thật, vui lòng click vào đường link bên dưới để hoàn tất thủ tục lấy lại mật khẩu.</p>
<div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>

<div>Nếu bạn không yêu cầu lấy lại mật khẩu, hãy bỏ qua email này!</div>
<div>Xin chân thành cảm ơn!</div>
`;
  return result;
};

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment,
  sendForgotPasswordEmail: sendForgotPasswordEmail,
};

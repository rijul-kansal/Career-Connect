var nodemailer = require('nodemailer');
// defining service from which we want to use gmail service
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FOR_SENDING_MAIL,
    pass: process.env.PASSWORD_FOR_SENDING_MAIL,
  },
});
// defining message
var mailOptions = (to, subject, html) => {
  return {
    from: process.env.EMAIL_FOR_SENDING_MAIL,
    to,
    subject,
    html,
  };
};
// sending mail
const mail = (to, subject, html) =>
  transporter.sendMail(mailOptions(to, subject, html), function (error, info) {
    if (error) {
      console.log(error);
    } else {
      // console.log('Email sent: ' + info.response);
    }
  });

module.exports = mail;

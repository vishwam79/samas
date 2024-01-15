const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'premium275.web-hosting.com',
  port: 465,
  service: 'cPanel Webmail',
  auth: {
    user: process.env.user,
    pass: process.env.pass
  }
});

const sendMail = (mailArray, subject, text) => {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: process.env.user,
      to: mailArray,
      subject: subject,
      text: text
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        // console.log(err);
        // console.log('failed.....');
        reject(err); // Reject the promise with the error
      } else {
        // console.log('Email Sent : ' + info.response);
        // console.log('mail sent successful.....');
        resolve(info); // Resolve the promise with the info
      }
      transporter.close();
    });
  });
};

module.exports = sendMail;

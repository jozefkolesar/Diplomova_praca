const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Vytvorenie transporteru
  const transporter = nodemailer.createTransport({
    host: `${process.env.EMAIL_HOST}`,
    port: `${process.env.EMAIL_PORT}`,
    auth: {
      user: `${process.env.EMAIL_USERNAME}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });
  // 2) Definovanie email options
  const mailOptions = {
    from: 'Jozef Kolesár <jozef.kolesar98@gmail.com>', //tu asi adresa školy/prípadne pracovná
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };
  // 3) Zaslanie mailu
  await transporter.sendMail(mailOptions); //vracia promise
};

module.exports = sendEmail;

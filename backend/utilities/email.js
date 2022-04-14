const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(`${process.env.API_KEY}`);

//posielanie emailov pomocou SendGrid
const sendEmail = async (options) => {
  const mailOptions = {
    from: {
      name: 'Technická univerzita',
      email: `${process.env.EMAIL_FROM}`,
    },
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };
  // 3) Zaslanie mailu
  await sgMail
    .send(mailOptions)
    .then((response) => console.log('Email odoslaný!'))
    .catch((error) => console.log(error.message)); //vracia promise
};

module.exports = sendEmail;

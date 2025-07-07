const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, code) => {
  const msg = {
    to: email,
    from: "noreply.rentzy@gmail.com", // must be verified in SendGrid
    subject: "Rentzy Email Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<p>Your Rentzy verification code is: <strong>${code}</strong></p>`,
  };

  await sgMail.send(msg);
};

module.exports = sendVerificationEmail;

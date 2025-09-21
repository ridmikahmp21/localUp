const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (toEmail, buyerName) => {
  const mailOptions = {
    from: `"LocalUP" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Welcome to LocalUP!",
    html: `
      <h2>Hi ${buyerName},</h2>
      <p>Thanks for signing up with LocalUP! We're thrilled to have you onboard.</p>
      <p>Start exploring local businesses and enjoy the marketplace experience.</p>
      <br/>
      <p>Cheers,<br/>The LocalUP Team</p>
    `,
  };

  try {
    console.log(`Attempting to send welcome email to ${toEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.response}`);
  } catch (error) {
    console.error(`Failed to send email to ${toEmail}:`, error.message);
  }
};

module.exports = { sendWelcomeEmail };

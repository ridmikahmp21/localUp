const { sendWelcomeEmail } = require("../utils/emailService");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email, and message are required",
      });
    }

    const adminMailOptions = {
      from: `"LocalUP Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>Sent from LocalUP Contact Form</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    // Send confirmation email to user
    const userMailOptions = {
      from: `"LocalUP Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting LocalUP!",
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for reaching out to LocalUP! We've received your message and our team will get back to you within 24-48 hours.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Your Message:</h3>
          <p>${message}</p>
        </div>

        <p><strong>Our contact information:</strong></p>
        <ul>
          <li>Email: support@localup.com</li>
          <li>Phone: +94703452278</li>
          <li>Address: 123 Business Avenue, Kotikawaththa, Colombo 07</li>
        </ul>

        <br/>
        <p>Best regards,<br/>The LocalUP Team</p>
      `,
    };

    // Send both emails
    console.log(`Sending contact form email from ${email}...`);

    // Send to admin
    await transporter.sendMail(adminMailOptions);
    console.log("Admin notification email sent successfully");

    // Send confirmation to user
    await transporter.sendMail(userMailOptions);
    console.log("User confirmation email sent successfully");

    res.status(200).json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};

module.exports = { sendContactEmail };

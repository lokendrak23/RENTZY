const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send email verification code
const sendVerificationEmail = async (email, code) => {
  try {
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM || "noreply.rentzy@gmail.com",
      subject: "Rentzy Email Verification Code",
      text: `Your verification code is: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #007bff; margin: 0;">Rentzy</h1>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
            <p style="color: #666; margin-bottom: 30px;">Please use the following verification code to verify your email address:</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${code}</span>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">This code will expire in 10 minutes.</p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">If you didn't request this verification, please ignore this email.</p>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);
    console.log('Verification email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM || "noreply.rentzy@gmail.com",
      subject: "Password Reset Request - Rentzy",
      text: `Hello ${userName}, you requested a password reset. Visit this link to reset your password: ${resetUrl}. This link will expire in 1 hour.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #007bff; margin: 0;">Rentzy</h1>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #666;">Hello <strong>${userName}</strong>,</p>
            <p style="color: #666; margin: 20px 0;">You requested a password reset for your Rentzy account. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Reset Password</a>
            </div>
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;"><strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.</p>
            </div>
            <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">This is an automated message from Rentzy. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);
    console.log('Password reset email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

// Generic send email function (for compatibility with your auth routes)
const sendEmail = async (options) => {
  try {
    const msg = {
      to: options.to,
      from: process.env.EMAIL_FROM || "noreply.rentzy@gmail.com",
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    await sgMail.send(msg);
    console.log('Email sent successfully to:', options.to);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendEmail
};

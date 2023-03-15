const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const ForgotPasswordModel = require('../models/forgot_password');
const User = require('../models/user');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dumanaga1261@gmail.com',
    pass: 'rrhpvtjcsdjvkpjp'
  }
});

const generateCode = () => {
  const code = Math.floor(1000 + Math.random() * 9000);
  return code.toString();
};

const sendCodeEmail = async (email, code) => {
  const mailOptions = {
    from: 'dumanaga1261@gmail.com',
    to: email,
    subject: 'Password Recovery',
    text: `Your password recovery code is ${code}.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Code sent to ${email}`);
  } catch (error) {
    console.error(`Error sending code email: ${error.message}`);
  }
};

const sendNewPasswordEmail = async (email, newPassword) => {
  const mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: 'New Password',
    text: `Your new password is ${newPassword}. Please login and change your password immediately.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`New password sent to ${email}`);
  } catch (error) {
    console.error(`Error sending new password email: ${error.message}`);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate and save recovery code
    const code = generateCode();
    await user.update({ recoveryCode: code });

    // Send email with recovery code
    await sendCodeEmail(email, code);

    // Return success response
    return res.status(200).json({ message: 'Recovery code sent successfully' });
  } catch (error) {
    console.error(`Error sending recovery code: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    // Check if user exists and code matches
    const user = await ForgotPasswordModel.findOne({ where: { email, recoveryCode: code } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid recovery code' });
    }

    // Update user password with new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword, recoveryCode: null });

    // Send email with new password
    await sendNewPasswordEmail(email, newPassword);

    // Return success response
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(`Error resetting password: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { forgotPassword, resetPassword };

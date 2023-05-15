const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const ForgotPasswordModel = require('../models/forgot_password');
const User = require('../models/user');
const { where } = require('sequelize');
const ForgotPassword = require('../models/forgot_password');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dumanaga1261@gmail.com',
    pass: 'rrhpvtjcsdjvkpjp'
  }
});

const generateCode = () => {
  const code = Math.floor(1000 + Math.random() * 9000);
  return code;
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

const codeSender = async(req, res) => {
  userEmail = req.body.email;

  const user = await User.findOne( {where:{email:userEmail}});

  if(!user){
    return res.status(400).json({ message: 'User not found' });
  }

  const code = generateCode();

  await sendCodeEmail(userEmail, code.toString());
  
  var now = new Date();
  now.setMinutes(now.getMinutes() + 3); // timestamp
  var expiredDate = new Date(now);

  ForgotPassword.create({
    user_id: user.id,
    recovery_code: code,
    expired_date: expiredDate,
  }).then((result) => {
    res.status(200).json({
        message:"Forgot password has been added succesfully",
        result
    })
  }).catch((err) => {
      res.status(400).json({
          message:"Forgot password has not been added",
          err
      })
  });
}

const verifyCode = async (req, res) => {
  const userId = req.body.user_id;
  const sentCode = req.body.code;

  const forgotPasswordLists = await ForgotPassword.findAll({where: {user_id: userId, recovery_code: sentCode}});

  let forgotPasswordInfo;
  forgotPasswordLists.forEach(element => {
    // element.expired_date.setMinutes(now.getMinutes() + 180);
    if(element.expired_date > Date.now()){
      forgotPasswordInfo = element;
    }
  });

  if (forgotPasswordInfo){
    if(forgotPasswordInfo.recovery_code == sentCode){
      res.status(200).json({
        message:"Verification is correct.",
      })
    }
    else {
      res.status(400).json({
        message:"Verification is wrong.",
      })
    }
  }
  else {
    res.status(400).json({
      message:"Forgot password error.",
    })
  }
}

const resetPassword = async (req, res) => {
  const { user_id, new_password } = req.body;

  try {
    // Check if user exists and code matches
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(400).json({ message: 'User not found'});
    }

    // Update user password with new password
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await user.update({ _password: hashedPassword });

    // Send email with new password
    // await sendNewPasswordEmail(email, newPassword);

    // Return success response
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(`Error resetting password: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { forgotPassword, resetPassword, codeSender, verifyCode };

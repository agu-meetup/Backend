
const bcrypt = require('bcryptjs');
const nodemailer =require('nodemailer');
const crypto = require('crypto');

const User = require('../models/user');

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ where: { email: email } }).then(user => {
    if (!user) {
      return res.status(400).json({ message: 'Email does not exist' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    User.update(
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000
      },
      { where: { email: email } }
    )
      .then(() => {
        // send an email with the password reset link
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: "dumanaga1261@gmail.com",
            pass: "rrhpvtjcsdjvkpjp"
          }
        });
        

        const mailOptions = {
          from: 'dumanaga1261@gmail.com',
          to: email,
          subject: 'Password reset link',
          text:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' +
            req.headers.host +
            '/api/password/user/reset/' +
            token +
            '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).json({ message: 'Error sending email' });
          }

          return res
            .status(200)
            .json({ message: 'An email has been sent to ' + email + ' with further instructions' });
        });
      })
      .catch(error => {
        return res.status(500).json({ error });
      });
  });
};

exports.resetPassword = (req, res) => {
  const { password, token } = req.body;

  User.findOne({ where: { resetPasswordToken: token } }).then(user => {
    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Token has expired' });
    }

    const hash = bcrypt.hashSync(password, 10);

    User.update(
      {
        password: hash,
        resetPasswordToken: null,
        resetPasswordExpires: null
      },
      { where: { resetPasswordToken:token } }
      )
      .then(() => {
      return res.status(200).json({ message: 'Password reset successful' });
      })
      .catch(error => {
      return res.status(500).json({ error });
      });
      });
      };

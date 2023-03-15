const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('../models/user');

const ForgotPassword = sequelize.define("forgot_password", {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    expires: 3600 
  },
  recoveryCode: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});



module.exports = ForgotPassword;

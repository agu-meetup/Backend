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

  expiredDate: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    expires: 3600 
  },
  recoveryCode: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

User.hasMany(ForgotPassword, {foreignKey: 'user_id'});
ForgotPassword.belongsTo(User, {foreignKey: 'user_id'});

module.exports = ForgotPassword;

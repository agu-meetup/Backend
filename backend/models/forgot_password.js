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

  expired_date: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  recovery_code: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

User.hasMany(ForgotPassword, {foreignKey: 'user_id'});
// ForgotPassword.belongsTo(User, {foreignKey: 'user_id'});

module.exports = ForgotPassword;

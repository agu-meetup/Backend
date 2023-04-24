const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const ForgotPassword = require('./forgot_password');

const User = sequelize.define("users", {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  surname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone_number: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  _password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  created_date: {
    type: Sequelize.DATE,
  },
  updated_date: {
    type: Sequelize.DATE,
  },
  deleted_date: {
    type: Sequelize.DATE,
  },
}, { timestamps: false, createdAt: true, updatedAt: false, deletedAt: false });


User.hasMany(ForgotPassword,{foreignKey: 'forgot_password_id'});
ForgotPassword.belongsTo(User);
module.exports = User;

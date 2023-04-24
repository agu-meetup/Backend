// This is the model for the event table in the database
// Table name: event
// import Sequelize from 'Sequelize';
const Sequelize=require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');
const Event = require('./event');

const User_Event = sequelize.define("user_events", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    }

});

User_Event.hasMany(User, {foreignKey: 'id'});
User_Event.hasMany(Event, {foreignKey: 'id'});


module.exports = User_Event;


// This is the model for the event table in the database
// Table name: event
// import Sequelize from 'Sequelize';
const Sequelize=require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');
const Event = require('./event');

const Saved_Events = sequelize.define("savedEvents", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    }
});

Saved_Events.hasMany(User, {foreignKey: 'id'});
Saved_Events.hasMany(Event, {foreignKey: 'id'});


module.exports = Saved_Events;


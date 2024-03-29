// This is the model for the event table in the database
// Table name: event
// import Sequelize from 'Sequelize';
const Sequelize=require('sequelize');
const sequelize = require('../util/database');
const Detail = require('./detail');
const Group = require('./group');
const User = require('./user');
const Location = require('./location');
const Address = require('./address');

const Event = sequelize.define("events", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    },
    creating_time: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    start_time: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    end_time: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    current_participants: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    max_participants: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    hosts:{
        type: Sequelize.STRING,
        allowNull: false,

    },
    gender:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    imageUrl : {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price : {
        type: Sequelize.INTEGER,
        allowNull: true,
    }

});

Detail.hasMany(Event, {foreignKey: 'detail_id'});
Event.belongsTo(Detail, {foreignKey: 'detail_id'});
User.hasMany(Event, {foreignKey: 'user_id'});
Event.belongsTo(User, {foreignKey: 'user_id'});
Group.hasMany(Event, {foreignKey: 'group_id'});
Event.belongsTo(Group, {foreignKey: 'group_id'});
Location.hasMany(Event, {foreignKey: 'location_id'});
Event.belongsTo(Location, {foreignKey: 'location_id'});
Address.belongsTo(Event, {foreignKey: 'event_id'});
Event.hasOne(Address, {foreignKey: 'event_id'});
module.exports = Event;



    
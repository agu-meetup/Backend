
const Sequelize=require('sequelize');
const sequelize = require('../util/database');
const Event = require('./event');
const Address = sequelize.define("address", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    forDirection : {
        type: Sequelize.STRING,
        allowNull: true,
    },
    locationName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    province: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    district  : {
        type: Sequelize.STRING,
        allowNull: true,
    }, 
       subLocality: {
        type: Sequelize.STRING,
        allowNull: true,
    },


    
});

module.exports = Address;

Address.hasOne(Event, {foreignKey: 'event_id'});
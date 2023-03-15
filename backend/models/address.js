
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
    city: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    street: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    postcode: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: Event,
            key: 'id'
        }
    }
    
});

module.exports = Address;

Address.hasOne(Event, {foreignKey: 'event_id'});
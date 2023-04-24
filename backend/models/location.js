// This is the model for the location table in the database
// Table name: location

const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Location = sequelize.define("locations", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    },
    lattiude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    longitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    }
});

module.exports = Location;

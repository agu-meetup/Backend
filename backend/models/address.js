
const Sequelize=require('sequelize');
const sequelize = require('../util/database');
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
    
});

module.exports = Address;

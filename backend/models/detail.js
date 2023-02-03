// This file is used to define the schema of the database table
// Table name: detail
const Sequelize=require('sequelize');
const sequelize = require('../util/database');

const Detail = sequelize.define("details", {
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
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    
});


module.exports = Detail;

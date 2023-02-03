// This is the model for the group table in the database
// Table name: group

const Sequelize=require('sequelize');
const sequelize = require('../util/database');
const Group = sequelize.define("groups", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    },
    users: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});


module.exports = Group;
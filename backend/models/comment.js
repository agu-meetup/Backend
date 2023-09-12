// This file is used to define the schema of the database table
// Table name: Comment
const Sequelize=require('sequelize');
const sequelize = require('../util/database');

const User = require('./user');
const Event = require('./event');
const Comment = sequelize.define("comments", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    },
    comment_text: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    
});

User.hasMany(Comment, {foreignKey: 'user_id'});
Comment.belongsTo(User, {foreignKey: 'user_id'});
Event.hasMany(Comment, {foreignKey: 'event_id'});
Comment.belongsTo(Event, {foreignKey: 'event_id'});
module.exports = Comment;

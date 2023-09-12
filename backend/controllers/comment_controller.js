const { where } = require('sequelize');
const Comment = require('../models/comment');
const Event = require('../models/event');
const User = require("../models/user");


exports.createComment = (req, res, next) => {
    const comment_text= req.body.comment_text
    const event_id = req.body.event_id;
    const user_id = req.body.user_id;
    
    if(event_id == null){
        const error = new Error('Event id is required');
        error.statusCode = 404;
        throw error;
    }
    if(user_id == null){
        const error = new Error('User id is required');
        error.statusCode = 404;
        throw error;
    }
    Event.findByPk(event_id).then(event => {
        if (!event) {
            const error = new Error('Could not find event.');
            error.statusCode = 404;
            throw error;
        }
        
    });
    User.findByPk(user_id).then(user => {
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }
        
    });
    
    Comment.create({
        comment_text: comment_text,
        event_id: event_id,
        user_id:user_id,


    })
        .then(result => {
            res.status(201).json({
                message: 'comment created successfully!',
                address: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getComment = async (req, res, next) => {
    const event_id = req.body.event_id;

    try {
        const comments = await Comment.findAll({
            where: { event_id: event_id },
            attributes: ['user_id', 'comment_text'],
        });

        const commentData = await Promise.all(comments.map(async (comment) => {
            const user = await User.findByPk(comment.user_id, {
                attributes: ['name']
            });

            return {
                name: user ? user.name : null,
                comment_text: comment.comment_text
            };
        }));

        res.status(200).json({
            message: 'Fetched names and comment_text for the event successfully.',
            comments: commentData
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

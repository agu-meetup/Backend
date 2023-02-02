const Group = require('../models/group');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getGroups = (req, res, next) => {
    Group.findAll()
        .then(groups => {
            res.status(200).json({
                message: 'Fetched groups successfully.',
                groups: groups
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getGroup = (req, res, next) => {
    const groupId = req.params.groupId;
    Group.findByPk(groupId)
        .then(group => {
            if (!group) {
                const error = new Error('Could not find group.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Group fetched.', group: group });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.createGroup = (req, res, next) => {
    const users = req.body.users;
    Group.create({
        users: users
    })
        .then(result => {
            res.status(201).json({
                message: 'Group created successfully!',
                group: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.updateGroup = (req, res, next) => {
    const groupId = req.params.groupId;
    const users = req.body.users;
    Group.findByPk(groupId)
        .then(group => {
            if (!group) {
                const error = new Error('Could not find group.');
                error.statusCode = 404;
                throw error;
            }
            group.users = users;
            return group.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Group updated!', group: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.deleteGroup = (req, res, next) => {
    const groupId = req.params.groupId;
    Group.findByPk(groupId)
        .then(group => {
            if (!group) {
                const error = new Error('Could not find group.');
                error.statusCode = 404;
                throw error;
            }
            return group.destroy();
        })
        .then(result => {
            res.status(200).json({ message: 'Deleted group.' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


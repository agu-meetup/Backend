// This is the controller for the events

const Event = require('../models/event');
const Detail = require('../models/detail');
const User = require('../models/user');
const Group = require('../models/group');
const Location = require('../models/location');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getEvents = (req, res, next) => {
    Event.findAll()
        .then(events => {
            res.status(200).json({
                message: 'Fetched events successfully.',
                events: events
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Event fetched.', event: event });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.createEvent = (req, res, next) => {
    const detail_id = req.body.detail_id;
    const creating_time = req.body.creating_time;
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;
    const user_id = req.body.user_id;
    const group_id = req.body.group_id;
    const location_id = req.body.location_id;
    Event.create({
        detail_id: detail_id,
        creating_time: creating_time,
        start_time: start_time,
        end_time: end_time,
        user_id: user_id,
        group_id: group_id,
        location_id: location_id
    })
        .then(result => {
            res.status(201).json({
                message: 'Event created successfully!',
                event: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.updateEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    const detail_id = req.body.detail_id;
    const creating_time = req.body.creating_time;
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;
    const user_id = req.body.user_id;
    const group_id = req.body.group_id;
    const location_id = req.body.location_id;
    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            event.detail_id = detail_id;
            event.creating_time = creating_time;
            event.start_time = start_time;
            event.end_time = end_time;
            event.user_id = user_id;
            event.group_id = group_id;
            event.location_id = location_id;
            return event.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Event updated!', event: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.deleteEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            // Check logged in user
            return event.destroy();
        })
        .then(result => {
            res.status(200).json({ message: 'Deleted event.' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getEventsByUser = (req, res, next) => {
    const userId = req.params.userId;
    Event.findAll({ where: { user_id: userId } })
        .then(events => {
            res.status(200).json({
                message: 'Fetched events by user successfully.',
                events: events
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getEventsByGroup = (req, res, next) => {
    const groupId = req.params.groupId;
    Event.findAll({ where: { group_id: groupId } })
        .then(events => {
            res.status(200).json({
                message: 'Fetched events by group successfully.',
                events: events
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getEventsByLocation = (req, res, next) => {
    const locationId = req.params.locationId;
    Event.findAll({ where: { location_id: locationId } })
        .then(events => {
            res.status(200).json({
                message: 'Fetched events by location successfully.',
                events: events
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getEventsByParameter = (req, res, next) => {
    const parameter = req.params.parameter;
    Event.findAll({
        include: [
            {
                model: Detail,
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: '%' + parameter + '%' } },
                        { name: { [Op.like]: '%' + parameter + '%' } }
                    ]
                }
            }
        ]
    }).then(events => {
        res.status(200).json({
            message: 'Fetched events by detail successfully.',
            events: events
        });
    }
    ).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
    );

}

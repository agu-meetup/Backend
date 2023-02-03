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
    let eventLocation;
    let eventDetail;
    let eventGroup;
    let eventUser;

    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            eventLocation = Location.findByPk(event.location_id);
            eventDetail = Detail.findByPk(event.detail_id);
            eventGroup = Group.findByPk(event.group_id);
            eventUser = User.findByPk(event.user_id);
            return Promise.all([eventLocation, eventDetail, eventGroup, eventUser]);

        })
        .then(result => {
            res.status(200).json({
                message: 'Event fetched.',
                event: {
                    id: eventId,
                    creating_time: result[0].creating_time,
                    start_time: result[0].start_time,
                    end_time: result[0].end_time,
                    location: {
                        lattiude: result[0].lattiude,
                        longitude: result[0].longitude,
                        user: result[3]
                    },
                    detail: {
                        name: result[1].name,
                        description: result[1].description,
                        title: result[1].title,
                        category: result[1].category
                    },
                    group: {
                        users: result[2].users
                    },
                    user: result[3]
                }
            });
        })

        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.createEvent = (req, res, next) => {
    const date = new Date();
    const creating_time = date.getDate();
    const start_time = req.body.start_time ?? creating_time;
    const end_time = req.body.end_time ?? creating_time;
    const users = req.body.users ?? ""
    const lattiude = req.body.lattiude ?? 0;
    const longitude = req.body.longitude ?? 0;
    const user_id = req.body.user_id;
    const name = req.body.name ?? "";
    const description = req.body.description ?? "";
    const title = req.body.title ?? "";
    const category = req.body.category ?? "";

    let createdLocation;
    let createdDetail;
    let createdGroup;

    Location.create({
        lattiude: lattiude,
        longitude: longitude,
        user_id: user_id
    })
        .then(location => {
            createdLocation = location;
            return Detail.create({
                name: name,
                description: description,
                title: title,
                category: category
            })
        }
        )
        .then(detail => {
            createdDetail = detail;
            return Group.create({
                users: users
            })
        }
        )
        .then(group => {
            createdGroup = group;
            return Event.create({
                creating_time: creating_time,
                start_time: start_time,
                end_time: end_time,
                location_id: createdLocation.id,
                detail_id: createdDetail.id,
                group_id: createdGroup.id,
                user_id: user_id

            })
        }
        )
        .then(result => {
            res.status(201).json({
                message: 'Event created successfully!',
                event: result
            });
        }
        )
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        );


}

exports.updateEvent = (req, res, next) => {
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;
    const users = req.body.users
    const lattiude = req.body.lattiude;
    const longitude = req.body.longitude;
    const name = req.body.name;
    const description = req.body.description;
    const title = req.body.title;

    const eventId = req.params.eventId;
    let eventLocation;
    let eventDetail;
    let eventGroup;

    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            eventLocation = event.location_id;
            eventDetail = event.detail_id;
            eventGroup = event.group_id;
            event.start_time = start_time;
            event.end_time = end_time;
            return event.save();
        }
        )
        .then(result => {
            return Location.findByPk(eventLocation)
        }
        )
        .then(location => {
            location.lattiude = lattiude;
            location.longitude = longitude;
            return location.save();
        }
        )
        .then(result => {
            return Detail.findByPk(eventDetail)
        }
        )
        .then(detail => {
            detail.name = name;
            detail.description = description;
            detail.title = title;
            return detail.save();
        }
        )
        .then(result => {
            return Group.findByPk(eventGroup)
        }
        )
        .then(group => {
            group.users = users;
            return group.save();
        }
        )
        .then(result => {
            res.status(200).json({ message: 'Event updated!', event_id: eventId });
        }
        )
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        );


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
    const lattiude = req.params.lattiude;
    const longitude = req.params.longitude;
    Event.findAll({
        include: [
            {
                model: Location,
                where: {
                    lattiude: lattiude,
                    longitude: longitude

                }
            }
        ]
    }).then(events => {
        res.status(200).json({
            message: 'Fetched events by location successfully.',
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
exports.getEventsByCategory = async (req, res, next) => {
    const category = req.params.category;
    Event.findAll({
        include: {
            model: Detail,
            where: {
                category: category
            }
        }

    }).then(events => {
        res.status(200).json({
            message: 'Fetched events by category successfully.',
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



exports.getEventsByCategories = (req, res, next) => {
    const categories = req.params.categories.split(",");

    Event.findAll({
        include: [
            {
                model: Detail,
                where: {
                    category: {
                        [Op.or]: categories
                    }
                }
            }
        ]
    }).then(events => {
        res.status(200).json({
            message: 'Fetched events by categories successfully.',
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

exports.updateUsers = (req, res, next) => {
    const eventId = req.params.eventId;
    const users = req.body.users;
    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            return Group.findByPk(event.group_id);
        }
        )
        .then(group => {
            group.users = users;
            return group.save();
        }
        )
        .then(result => {
            res.status(200).json({ message: 'Users updated!', event: result });
        }
        )
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        );
}

exports.updateTime = (req, res, next) => {
    const eventId = req.params.eventId;
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;
    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            event.start_time = start_time;
            event.end_time = end_time;
            return event.save();
        }
        )
        .then(result => {
            res.status(200).json({ message: 'Time updated!', event: result });
        }
        )
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        );
}

exports.updateLocation = (req, res, next) => {
    const eventId = req.params.eventId;
    const lattiude = req.body.lattiude;
    const longitude = req.body.longitude;
    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            return Location.findByPk(event.location_id);
        }
        )
        .then(location => {
            location.lattiude = lattiude;
            location.longitude = longitude;
            return location.save();
        }
        )
        .then(result => {
            res.status(200).json({ message: 'Location updated!', event: result });
        }
        )
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        );
}

exports.updateDetails = (req, res, next) => {
    const eventId = req.params.eventId;
    const title = req.body.title;
    const name = req.body.name;
    const description = req.body.description;
    const category = req.body.category;
    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            return Detail.findByPk(event.detail_id);
        }
        )
        .then(detail => {
            detail.title = title;
            detail.name = name;
            detail.description = description;
            detail.category = category;
            return detail.save();
        }
        )
        .then(result => {
            res.status(200).json({ message: 'Details updated!', event: result });
        }
        )
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        );
}

exports.deleteEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    let detailId;
    let locationId;
    let groupId;
    Event.findByPk(eventId)
        .then(async event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            detailId = event.detail_id;
            locationId = event.location_id;
            groupId = event.group_id;
            Detail.destroy({ where: { id: detailId } });
            Location.destroy({ where: { id: locationId } });
            Group.destroy({ where: { id: groupId } })
            return event.destroy();
        }
        )
        .then(result => {
            res.status(200).json({ message: 'Deleted event.' });
        }
        )
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        );

}

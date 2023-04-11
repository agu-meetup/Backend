// This is the controller for the events

const Event = require('../models/event');
const Detail = require('../models/detail');
const User = require('../models/user');
const Group = require('../models/group');
const Location = require('../models/location');
const User_Event = require('../models/user_event');

const Sequelize = require('sequelize');
const Address = require('../models/address');
const Saved_Events = require('../models/savedEvents');
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
            return Promise.all([event, eventLocation, eventDetail, eventGroup]);

        })
        .then(result => {
            res.status(200).json({
                message: 'Event fetched.',
                event: {
                    id: eventId,
                    user_id: result[0].user_id,
                    creating_time: result[0].creating_time,
                    start_time: result[0].start_time,
                    end_time: result[0].end_time,
                    gender: result[0].gender,
                    imageUrl: result[0].imageUrl,
                    price: result[0].price,
                    hosts: result[0].hosts,
                    max_participants: result[0].max_participants,
                    current_participants: result[0].current_participants,
                    hosts: result[0].hosts,
                    lattiude: result[1].lattiude,
                    longitude: result[1].longitude,
                    title: result[2].title,
                    description: result[2].description,
                    category: result[2].category,
                    users: result[3].users,
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
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;
    const users = req.body.users;
    const lattiude = req.body.lattiude;
    const longitude = req.body.longitude;
    const user_id = req.body.user_id;
    const name = req.body.name;
    const description = req.body.description;
    const title = req.body.title;
    const category = req.body.category;
    const max_participants = req.body.max_participants;
    const hosts = req.body.hosts;
    const gender = req.body.gender;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    
    let createdLocation;
    let createdDetail;
    let createdGroup;

    // null check
    if (!start_time || !end_time || !users || !lattiude || !longitude || !user_id || !name || !description || !title || !category) {
        const error = new Error('Missing fields');
        error.statusCode = 422;
        res.status(422).json({
            message: 'Missing fields'
        });

    }

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
                user_id: user_id,
                max_participants: max_participants,
                hosts: hosts,
                gender: gender,
                imageUrl: imageUrl,
                price: price

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
    const category = req.body.category;
    const gender = req.body.gender;
    const hosts = req.body.hosts;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;

    const eventId = req.params.eventId;
    let eventLocation;
    let eventDetail;
    let eventGroup;

    // null check
    if (!start_time || !end_time || !users || !lattiude || !longitude || !name || !description || !title) {
        const error = new Error('Missing fields');
        error.statusCode = 422;
        res.status(422).json({
            message: 'Missing fields'
        });
        throw error;
    }

    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                res.status(404).json({

                    message: 'Could not find event.'
                });
                throw error;
            }
            eventLocation = event.location_id;
            eventDetail = event.detail_id;
            eventGroup = event.group_id;

            event.start_time = start_time ?? event.start_time;
            event.end_time = end_time ?? event.end_time;
            event.max_participants = max_participants ?? event.max_participants;
            event.hosts = hosts ?? event.hosts;
            event.gender = gender ?? event.gender;
            event.imageUrl = imageUrl ?? event.imageUrl;
            event.price = price ?? event.price;
            return event.save();
        }
        )
        .then(result => {
            return Location.findByPk(eventLocation)
        }
        )
        .then(location => {
            location.lattiude = lattiude ?? location.lattiude;
            location.longitude = longitude ?? location.longitude;
            return location.save();
        }
        )
        .then(result => {
            return Detail.findByPk(eventDetail)
        }
        )
        .then(detail => {
            detail.name = name ?? detail.name;
            detail.description = description ?? detail.description;
            detail.title = title ?? detail.title;
            detail.category = category ?? detail.category;
            return detail.save();
        }
        )
        .then(result => {
            return Group.findByPk(eventGroup)
        }
        )
        .then(group => {
            group.users = users ?? group.users;
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

    // null check
    if (!userId) {
        const error = new Error('User id is null');
        error.statusCode = 404;
        throw error;
    }


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

    // null check
    if (!groupId) {
        const error = new Error('Group id is null');
        error.statusCode = 404;
        throw error;
    }


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

    // null check
    if (!lattiude || !longitude) {
        const error = new Error('Lattiude or longitude are null');
        error.statusCode = 404;
        throw error;
    }


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

    //null check
    if (!parameter) {
        const error = new Error('Parameter is null');
        error.statusCode = 404;
        throw error;
    }

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

    //null check
    if (!category) {
        const error = new Error('Could not find category.');
        error.statusCode = 404;
        throw error;
    }


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
    const categories = req.params.categories.split("-");

    if (!categories) {
        const error = new Error('Could not find categories.');
        error.statusCode = 404;
        throw error;
    }


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

    // null check
    if (!eventId) {
        const error = new Error('Event id is null.');
        error.statusCode = 404;
        throw error;
    }

    if (!users) {
        const error = new Error('Users are null.');
        error.statusCode = 404;
        throw error;
    }


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
            group.users = users ?? group.users;
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

    // null check

    if (!eventId) {
        const error = new Error('Event id is null.');
        error.statusCode = 404;
        throw error;
    }

    if (!start_time && !end_time) {
        const error = new Error('Start time and end time are null.');
        error.statusCode = 404;
        throw error;
    }



    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            event.start_time = start_time ?? event.start_time;
            event.end_time = end_time ?? event.end_time;
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

    if (!eventId) {
        const error = new Error('Could not find event.');
        error.statusCode = 404;
        throw error;
    }

    if (!lattiude && !longitude) {
        const error = new Error('Could not find location.');
        error.statusCode = 404;
        throw error;
    }



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
            location.lattiude = lattiude ?? location.lattiude;
            location.longitude = longitude ?? location.longitude;
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

    //null check

    if (!title && !name && !description && !category) {
        const error = new Error('No details to update');
        error.statusCode = 404;
        return next(error);
    }

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
            detail.title = title ?? detail.title;
            detail.name = name ?? detail.name;
            detail.description = description ?? detail.description;
            detail.category = category ?? detail.category;
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

exports.updateImgUrl =  (req, res, next) => {
    const eventId = req.params.eventId;
    const imgUrl = req.body.imgUrl;
    
    //null check

    if (!imgUrl) {
        const error = new Error('No image to update');
        error.statusCode = 404;
        return next(error);
    }

    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            event.imageUrl = imgUrl ?? event.imageUrl;
            return event.save();
        }
        )
        .then(result => {
            res.status(200).json({ message: 'Image updated!', event: result });
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

    //null check

    if (!eventId) {
        const error = new Error('No event to delete');
        error.statusCode = 404;
        return next(error);

    }

    if (!detailId && !locationId && !groupId) {
        const error = new Error('No event to delete');
        error.statusCode = 404;
        return next(error);
    }


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
        .then (result => {
            Address.findAll({ where: { event_id:eventId } })
                .then(addresses => {
                    addresses.forEach(address => {
                        address.destroy();
                    })
                })
        }
        )
        .then(result => {
            res.status(200).json({ message: 'Deleted event.', result: result });
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

exports.joinEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    const userId = req.body.userId;

    if (!eventId) {
        const error = new Error('Could not find event.');
        error.statusCode = 404;
        throw error;
    }

    if (!userId) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
    }


    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            if (event.current_participants == event.max_participants){
                const error = new Error('The event is full.');
                error.statusCode = 400;
                throw error;
            }
            event.current_participants++;
            event.save();
            return Group.findByPk(event.group_id);
        }
        )
        .then(group => {
            if (group.users.length > 0) {
                group.users = group.users.concat("-" + userId);
            }
            else {
                group.users = userId;
            }
            return group.save();
        }
        )
        .then(result => {
            res.status(200).json({ message: 'User joined event!', event: result });
        }
        ).then(result => {
            User_Event.create({
                user_id: userId,
                event_id: eventId
            })
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

exports.leaveEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    const userId = req.body.userId;

    if (!eventId) {
        const error = new Error('Could not find event.');
        error.statusCode = 404;
        throw error;
    }

    if (!userId) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
    }


    Event.findByPk(eventId)
        .then(event => {
            if (!event) {
                const error = new Error('Could not find event.');
                error.statusCode = 404;
                throw error;
            }
            event.current_participants--;
            event.save();
            return Group.findByPk(event.group_id);
        }
        )
        .then(group => {
            if (group.users.length > 0) {
                group.users = group.users.replace("-" + userId, "");
            }
            else {
                group.users = "";
            }
            return group.save();
        }
        )
        .then(result => {
            res.status(200).json({ message: 'User left event!', event: result });
        }
        ).then(result => {
            User_Event.destroy({
                where: {
                    user_id: userId,
                    event_id: eventId
                }
            })
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


exports.getUserEventsByUserId = (req, res, next) => {
    const userId = req.params.userId;

    if (!userId) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
    }

    User_Event.findAll({ where: { user_id: userId } })
        .then(result => {
            res.status(200).json({ message: 'Fetched events.', events: result });
        }
        ).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        );


}

exports.saveEventByUserId = (req, res, next) => {
    const userId = req.params.userId;
    const eventId = req.body.eventId;

    if (!userId) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
    }

    if (!eventId) {
        const error = new Error('Could not find event.');
        error.statusCode = 404;
        throw error;
    }

    Saved_Events.create({
        user_id: userId,
        event_id: eventId
    })
        .then(result => {
            res.status(200).json({ message: 'Event saved!', event: result });
        }
        ).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        );

}

exports.getSavedEventsByUserId = (req, res, next) => {
    const userId = req.params.userId;

    if (!userId) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
    }

    Saved_Events.findAll({ where: { user_id: userId } })
        .then(result => {
            res.status(200).json({ message: 'Fetched events.', events: result });
        }
        ).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        );

}

exports.deleteSavedEventByUserId = (req, res, next) => {
    const userId = req.params.userId;
    const eventId = req.body.eventId;

    if (!userId) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
    }

    if (!eventId) {
        const error = new Error('Could not find event.');
        error.statusCode = 404;
        throw error;
    }

    Saved_Events.destroy({ where: { user_id: userId, event_id: eventId } })
        .then(result => {
            res.status(200).json({ message: 'Event deleted!', event: result });
        }
        ).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        );

}
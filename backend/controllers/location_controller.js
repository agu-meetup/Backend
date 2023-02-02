const Location = require('../models/location');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getLocations = (req, res, next) => {
    Location.findAll()
        .then(locations => {
            res.status(200).json({
                message: 'Fetched locations successfully.',
                locations: locations
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getLocation = (req, res, next) => {
    const locationId = req.params.locationId;
    Location.findByPk(locationId)
        .then(location => {
            if (!location) {
                const error = new Error('Could not find location.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Location fetched.', location: location });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.createLocation = (req, res, next) => {
    const lattiude = req.body.lattiude;
    const longitude = req.body.longitude;
    const user_id = req.body.user_id;
    Location.create({
        lattiude: lattiude,
        longitude: longitude,
        user_id: user_id
    })
        .then(result => {
            res.status(201).json({
                message: 'Location created successfully!',
                location: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.updateLocation = (req, res, next) => {
    const locationId = req.params.locationId;
    const lattiude = req.body.lattiude;
    const longitude = req.body.longitude;
    const user_id = req.body.user_id;
    Location.findByPk(locationId)
        .then(location => {
            if (!location) {
                const error = new Error('Could not find location.');
                error.statusCode = 404;
                throw error;
            }
            location.lattiude = lattiude;
            location.longitude = longitude;
            location.user_id = user_id;
            return location.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Location updated!', location: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.deleteLocation = (req, res, next) => {
    const locationId = req.params.locationId;
    Location.findByPk(locationId)
        .then(location => {
            if (!location) {
                const error = new Error('Could not find location.');
                error.statusCode = 404;
                throw error;
            }
            return location.destroy();
        })
        .then(result => {
            res.status(200).json({ message: 'Deleted location.' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


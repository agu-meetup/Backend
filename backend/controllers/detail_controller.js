const Detail = require('../models/detail');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getDetails = (req, res, next) => {
    Detail.findAll()
        .then(details => {
            res.status(200).json({
                message: 'Fetched details successfully.',
                details: details
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getDetail = (req, res, next) => {
    const detailId = req.params.detailId;
    Detail.findByPk(detailId)
        .then(detail => {
            if (!detail) {
                const error = new Error('Could not find detail.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Detail fetched.', detail: detail });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.createDetail = (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    const title = req.body.title;
    const category = req.body.category;
    Detail.create({
        name: name,
        description: description,
        category: category,
        title: title
    })
        .then(result => {
            res.status(201).json({
                message: 'Detail created successfully!',
                detail: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.updateDetail = (req, res, next) => {
    const detailId = req.params.detailId;
    const name = req.body.name;
    const description = req.body.description;
    const category = req.body.category;
    const title = req.body.title;
    Detail.findByPk(detailId)
        .then(detail => {
            if (!detail) {
                const error = new Error('Could not find detail.');
                error.statusCode = 404;
                throw error;
            }
            detail.name = name;
            detail.description = description;
            detail.category = category;
            detail.title = title;
            return detail.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Detail updated!', detail: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.deleteDetail = (req, res, next) => {
    const detailId = req.params.detailId;
    Detail.findByPk(detailId)
        .then(detail => {
            if (!detail) {
                const error = new Error('Could not find detail.');
                error.statusCode = 404;
                throw error;
            }
            return detail.destroy();
        })
        .then(result => {
            res.status(200).json({ message: 'Deleted detail.' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


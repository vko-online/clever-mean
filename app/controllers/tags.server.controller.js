'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Tag = mongoose.model('Tag'),
    Article = mongoose.model('Article'),
    _ = require('lodash');

/**
 * Create a Tag
 */
exports.create = function (req, res) {
    var tag = new Tag(req.body);
    tag.user = req.user;

    tag.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tag);
        }
    });
};

/**
 * Show the current Tag
 */
exports.read = function (req, res) {
    var tag = req.tag;

    Article.find({
        tags: tag.id
    }).populate('user', 'displayName').sort('-created').exec(function (err, articles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                _id: tag._id,
                name: tag.name,
                image: tag.image,
                category: tag.category,
                created: tag.created,
                hits: tag.hits,
                articles: articles
            });
        }
    });
};

/**
 * Update a Tag
 */
exports.update = function (req, res) {
    var tag = req.tag;

    tag = _.extend(tag, req.body);

    tag.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tag);
        }
    });
};

/**
 * Delete an Tag
 */
exports.delete = function (req, res) {
    var tag = req.tag;

    tag.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tag);
        }
    });
};

/**
 * List of Tags
 */
exports.list = function (req, res) {
    var text = req.query.text;
    var filter = {};
    if (text) {
        text = text.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
        filter.$or = [{name: new RegExp(text, 'i')}, {category: new RegExp(text, 'i')}];
    }
    Tag.find(filter).limit(5).sort('-hits').exec(function (err, tags) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tags);
        }
    });
};

/**
 * Tag middleware
 */
exports.tagByID = function (req, res, next, id) {
    Tag.findById(id).populate('user', 'displayName').exec(function (err, tag) {
        if (err) return next(err);
        if (!tag) return next(new Error('Failed to load Tag ' + id));
        req.tag = tag;
        next();
    });
};

/**
 * Tag authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.tag.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

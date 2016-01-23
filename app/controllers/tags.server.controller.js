'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tag = mongoose.model('Tag'),
	_ = require('lodash');

/**
 * Create a Tag
 */
exports.create = function(req, res) {
	var tag = new Tag(req.body);
	tag.user = req.user;

	tag.save(function(err) {
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
exports.read = function(req, res) {
	res.jsonp(req.tag);
};

/**
 * Update a Tag
 */
exports.update = function(req, res) {
	var tag = req.tag ;

	tag = _.extend(tag , req.body);

	tag.save(function(err) {
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
exports.delete = function(req, res) {
	var tag = req.tag ;

	tag.remove(function(err) {
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
exports.list = function(req, res) { 
	Tag.find().sort('-created').populate('user', 'displayName').exec(function(err, tags) {
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
exports.tagByID = function(req, res, next, id) { 
	Tag.findById(id).populate('user', 'displayName').exec(function(err, tag) {
		if (err) return next(err);
		if (! tag) return next(new Error('Failed to load Tag ' + id));
		req.tag = tag ;
		next();
	});
};

/**
 * Tag authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tag.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Tag = mongoose.model('Tag'),
    Article = mongoose.model('Article'),
    _ = require('lodash'),
    utils = require('./utils.server.controller');

/**
 * Add article tag
 */
exports.addTag = function (req, res) {
    var article = req.article;
    var tagId = req.query.tagId;

    Tag.update({_id: tagId}, {$inc: {hits: 1}}, function (fError) {
        if (fError) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(fError)
            });
        } else {
            article.update({$push: {tags: tagId}}, function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    Article.findById(article.id).populate('tags', 'name category image').populate('user', 'displayName').exec(function (dbErr, dbArticle) {
                        if (dbErr) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            res.json(dbArticle);
                        }
                    });
                }
            });
        }
    });
};

/**
 * Remove article tag
 */
exports.removeTag = function (req, res) {
    var article = req.article;
    var tagId = req.query.tagId;

    Tag.update({_id: tagId}, {$inc: {hits: -1}}, function (fError) {
        article.update({$pull: {tags: tagId}}, function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                Article.findById(article.id).populate('tags', 'name category image').populate('user', 'displayName').exec(function (dbErr, dbArticle) {
                    if (dbErr) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.json(dbArticle);
                    }
                });
            }
        });
    });
};


/**
 * Create a article
 */
exports.create = function (req, res) {
    var article = new Article(req.body);
    article.user = req.user;
    Article.findUniqueSlug(article.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), null, function (possibleSlug) {
        article.slug = possibleSlug;
        article.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(article);
            }
        });
    });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
    res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
    var article = req.article;

    article = _.extend(article, req.body);

    article.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
    var article = req.article;

    article.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
    Article.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(articles);
        }
    });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {
    if (utils.isObjectId(id)) {
        Article.findById(id).populate('tags', 'name category image').populate('user', 'displayName').exec(function (err, article) {
            if (err) return next(err);
            if (!article) return next(new Error('Failed to load article ' + id));
            req.article = article;
            next();
        });
    } else {
        Article.findOne({
            slug: id
        }).populate('tags', 'name category image').populate('user', 'displayName').exec(function (err, article) {
            if (err) return next(err);
            if (!article) return next(new Error('Failed to load article ' + id));
            req.article = article;
            next();
        });
    }
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.article.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    slug: {
        type: String,
        default: '',
        unique: 'error message',
        trim: true
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    tags: [{
        type: Schema.ObjectId,
        ref: 'Tag'
    }],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
}, {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
});

ArticleSchema.virtual('short').get(function () {
    return this.content.substr(0, 150).replace(/<(?:.|\n)*?>/gm, '') + '...';
});

/**
 * Find possible not used slug
 */
ArticleSchema.statics.findUniqueSlug = function(slug, suffix, callback) {
    var _this = this;
    var possibleSlug = slug + (suffix || '');

    _this.findOne({
        slug: possibleSlug
    }, function(err, article) {
        if (!err) {
            if (!article) {
                callback(possibleSlug);
            } else {
                return _this.findUniqueSlug(slug, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};


//ArticleSchema.virtual('slug').get(function () {
//    return this.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
//});

mongoose.model('Article', ArticleSchema);
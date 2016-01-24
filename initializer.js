'use strict';

var mongoose = require('mongoose'),
    async = require('async');

exports.initializeTags = function () {
    var Tag = mongoose.model('Tag');
    var tags = require('./mock/tags/tags.json');

    function getExtension(string) {
        return '.' + string.split('.').pop();
    }

    Tag.remove({}, function (removeErr) {
        if (removeErr) {
            console.error(removeErr);
        } else {
            async.each(tags, function (_tag, callback) {
                var tag = new Tag({
                    name: _tag.title,
                    image: 'images/technologies/' + _tag.title + getExtension(_tag.image),
                    category: _tag.category
                });
                tag.save(callback);
            }, function (asyncErr, asyncResult) {
                console.log('asyncErr, asyncResult', asyncErr, asyncResult);
            });
        }
    });

};
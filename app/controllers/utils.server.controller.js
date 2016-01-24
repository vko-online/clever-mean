'use strict';

var mongoose = require('mongoose');

exports.isObjectId = function (n) {
    return mongoose.Types.ObjectId.isValid(n);
};
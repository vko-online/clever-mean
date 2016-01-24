'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tag Schema
 */
var TagSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Tag name',
		trim: true
	},
	image: {
		type: String,
		default: '',
		trim: true
	},
	category: {
		type: String,
		default: '',
		trim: true
	},
	hits: {
		type: Number,
		default: 0
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Tag', TagSchema);
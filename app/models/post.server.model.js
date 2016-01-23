'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Post Schema
 */
var PostSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Post name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
}, {
	toJson: true,
	toObject: true
});

PostSchema.virtual('slug', function(){
	return this.name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
});

mongoose.model('Post', PostSchema);
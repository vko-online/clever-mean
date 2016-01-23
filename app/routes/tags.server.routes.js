'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tags = require('../../app/controllers/tags.server.controller');

	// Tags Routes
	app.route('/api/tags')
		.get(tags.list)
		.post(users.requiresLogin, tags.create);

	app.route('/api/tags/:tagId')
		.get(tags.read)
		.put(users.requiresLogin, tags.hasAuthorization, tags.update)
		.delete(users.requiresLogin, tags.hasAuthorization, tags.delete);

	// Finish by binding the Tag middleware
	app.param('tagId', tags.tagByID);
};

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('api/articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			addTag: {
				url: 'api/articles/:articleId/tag',
				method: 'POST',
				isArray: false
			},
			removeTag: {
				url: 'api/articles/:articleId/tag',
				method: 'DELETE',
				isArray: false
			}
		});
	}
]);
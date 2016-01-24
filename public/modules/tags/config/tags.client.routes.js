'use strict';

//Setting up route
angular.module('tags').config(['$stateProvider',
	function($stateProvider) {
		// Tags state routing
		$stateProvider.
		state('listTags', {
			url: '/tags',
			templateUrl: 'modules/tags/views/list-tags.client.view.html'
		}).
		state('viewTag', {
			url: '/tags/:tagId',
			templateUrl: 'modules/tags/views/view-tag.client.view.html'
		});
	}
]);
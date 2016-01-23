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
		state('createTag', {
			url: '/tags/create',
			templateUrl: 'modules/tags/views/create-tag.client.view.html'
		}).
		state('viewTag', {
			url: '/tags/:tagId',
			templateUrl: 'modules/tags/views/view-tag.client.view.html'
		}).
		state('editTag', {
			url: '/tags/:tagId/edit',
			templateUrl: 'modules/tags/views/edit-tag.client.view.html'
		});
	}
]);
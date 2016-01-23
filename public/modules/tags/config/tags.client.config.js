'use strict';

// Configuring the Articles module
angular.module('tags').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tags', 'tags', 'dropdown', '/tags(/create)?');
		Menus.addSubMenuItem('topbar', 'tags', 'List Tags', 'tags');
		Menus.addSubMenuItem('topbar', 'tags', 'New Tag', 'tags/create');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('subscriptions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Subscriptions', 'subscriptions', 'dropdown', '/subscriptions(/create)?');
		//Menus.addSubMenuItem('topbar', 'subscriptions', 'List Subscriptions', 'subscriptions');
		//Menus.addSubMenuItem('topbar', 'subscriptions', 'New Subscription', 'subscriptions/create');
	}
]);
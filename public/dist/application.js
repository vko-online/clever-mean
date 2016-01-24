'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName = 'recode-kz';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'btford.socket-io',
        'alAngularHero',
        'angularFileUpload',
        'ngTagsInput',
        'ngToast'
    ];

    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode(true);
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('posts');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('subscriptions');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('tags');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('viewArticlePermalink', {
			url: '/a/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Articles', 'Tags', 'ngToast',
    function ($scope, $stateParams, $location, $http, Authentication, Articles, Tags, ngToast) {
        $scope.authentication = Authentication;
        $scope.editor = false;
        $scope.loadTags = function (query) {
            return Tags.query({text: query}).$promise;
        };

        $scope.addTag = function (tag) {
            $scope.article.$addTag({tagId: tag._id});
        };
        $scope.removeTag = function (tag) {
            $scope.article.$removeTag({tagId: tag._id});
        };
        $scope.create = function () {
            var article = new Articles({
                title: this.title,
                content: this.content
            });
            article.$save(function (response) {
                $location.path('articles/' + response._id);

                $scope.title = '';
                $scope.content = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function (article) {
            if (article) {
                article.$remove();

                for (var i in $scope.articles) {
                    if ($scope.articles[i] === article) {
                        $scope.articles.splice(i, 1);
                    }
                }
            } else {
                $scope.article.$remove(function () {
                    $location.path('articles');
                });
            }
        };

        $scope.update = function () {
            var article = $scope.article;

            article.$update(function () {
                $location.path('articles/' + article._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function () {
            $scope.articles = Articles.query();
        };

        $scope.findOne = function () {
            $scope.article = Articles.get({
                articleId: $stateParams.articleId
            }, function () {
                $scope.editor = new MediumEditor('.lead', {
                    toolbar: {
                        allowMultiParagraphSelection: true,
                        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
                        diffLeft: 0,
                        diffTop: -10,
                        firstButtonClass: 'medium-editor-button-first',
                        lastButtonClass: 'medium-editor-button-last',
                        standardizeSelectionStart: false,
                        static: false,
                        relativeContainer: null,
                        /* options which only apply when static is true */
                        align: 'center',
                        sticky: false,
                        updateOnEmptySelection: false
                    }
                });
                $scope.editor.subscribe('editableInput', function (event, editable) {
                    $scope.article.content = event.target.innerHTML;
                });
                var port = $location.port();
                $scope.host = $location.protocol() + '://' + $location.host() + ':' + (port === '80' ? '' : port);
                var client = new ZeroClipboard(document.getElementById('permalink-copier'));
                client.on('ready', function (readyEvent) {
                    client.on('aftercopy', function (event) {
                        event.target.style.display = 'none';
                        $scope.$apply(function () {
                            ngToast.create('Copied to clipboard');
                        });
                    });
                });
            });
        };
        $scope.$on('destroy', function () {
            $scope.editor.unsubscribe('editableInput');
        });
    }
]);
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
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',
    function(socketFactory) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect('http://localhost:3000')
        });
    }
]);

'use strict';

// Configuring the Articles module
angular.module('posts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Posts', 'posts', 'dropdown', '/posts(/create)?');
		//Menus.addSubMenuItem('topbar', 'posts', 'List Posts', 'posts');
		//Menus.addSubMenuItem('topbar', 'posts', 'New Post', 'posts/create');
	}
]);
'use strict';

//Setting up route
angular.module('posts').config(['$stateProvider',
	function($stateProvider) {
		// Posts state routing
		$stateProvider.
		state('listPosts', {
			url: '/posts',
			templateUrl: 'modules/posts/views/list-posts.client.view.html'
		}).
		state('createPost', {
			url: '/posts/create',
			templateUrl: 'modules/posts/views/create-post.client.view.html'
		}).
		state('viewPost', {
			url: '/posts/:postId',
			templateUrl: 'modules/posts/views/view-post.client.view.html'
		}).
		state('editPost', {
			url: '/posts/:postId/edit',
			templateUrl: 'modules/posts/views/edit-post.client.view.html'
		});
	}
]);
'use strict';

// Posts controller
angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts',
	function($scope, $stateParams, $location, Authentication, Posts) {
		$scope.authentication = Authentication;

		// Create new Post
		$scope.create = function() {
			// Create new Post object
			var post = new Posts ({
				name: this.name
			});

			// Redirect after save
			post.$save(function(response) {
				$location.path('posts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Post
		$scope.remove = function(post) {
			if ( post ) { 
				post.$remove();

				for (var i in $scope.posts) {
					if ($scope.posts [i] === post) {
						$scope.posts.splice(i, 1);
					}
				}
			} else {
				$scope.post.$remove(function() {
					$location.path('posts');
				});
			}
		};

		// Update existing Post
		$scope.update = function() {
			var post = $scope.post;

			post.$update(function() {
				$location.path('posts/' + post._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Posts
		$scope.find = function() {
			$scope.posts = Posts.query();
		};

		// Find existing Post
		$scope.findOne = function() {
			$scope.post = Posts.get({ 
				postId: $stateParams.postId
			});
		};
	}
]);
'use strict';

//Posts service used to communicate Posts REST endpoints
angular.module('posts').factory('Posts', ['$resource',
	function($resource) {
		return $resource('api/posts/:postId', { postId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
'use strict';

//Setting up route
angular.module('subscriptions').config(['$stateProvider',
	function($stateProvider) {
		// Subscriptions state routing
		$stateProvider.
		state('listSubscriptions', {
			url: '/subscriptions',
			templateUrl: 'modules/subscriptions/views/list-subscriptions.client.view.html'
		}).
		state('createSubscription', {
			url: '/subscriptions/create',
			templateUrl: 'modules/subscriptions/views/create-subscription.client.view.html'
		}).
		state('viewSubscription', {
			url: '/subscriptions/:subscriptionId',
			templateUrl: 'modules/subscriptions/views/view-subscription.client.view.html'
		}).
		state('editSubscription', {
			url: '/subscriptions/:subscriptionId/edit',
			templateUrl: 'modules/subscriptions/views/edit-subscription.client.view.html'
		});
	}
]);
'use strict';

// Subscriptions controller
angular.module('subscriptions').controller('SubscriptionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Subscriptions',
	function($scope, $stateParams, $location, Authentication, Subscriptions) {
		$scope.authentication = Authentication;

		// Create new Subscription
		$scope.create = function() {
			// Create new Subscription object
			var subscription = new Subscriptions ({
				name: this.name
			});

			// Redirect after save
			subscription.$save(function(response) {
				$location.path('subscriptions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Subscription
		$scope.remove = function(subscription) {
			if ( subscription ) { 
				subscription.$remove();

				for (var i in $scope.subscriptions) {
					if ($scope.subscriptions [i] === subscription) {
						$scope.subscriptions.splice(i, 1);
					}
				}
			} else {
				$scope.subscription.$remove(function() {
					$location.path('subscriptions');
				});
			}
		};

		// Update existing Subscription
		$scope.update = function() {
			var subscription = $scope.subscription;

			subscription.$update(function() {
				$location.path('subscriptions/' + subscription._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Subscriptions
		$scope.find = function() {
			$scope.subscriptions = Subscriptions.query();
		};

		// Find existing Subscription
		$scope.findOne = function() {
			$scope.subscription = Subscriptions.get({ 
				subscriptionId: $stateParams.subscriptionId
			});
		};
	}
]);
'use strict';

//Subscriptions service used to communicate Subscriptions REST endpoints
angular.module('subscriptions').factory('Subscriptions', ['$resource',
	function($resource) {
		return $resource('api/subscriptions/:subscriptionId', { subscriptionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('tags').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tags', 'tags', 'dropdown', '/tags(/create)?');
		Menus.addSubMenuItem('topbar', 'tags', 'List Tags', 'tags');
		//Menus.addSubMenuItem('topbar', 'tags', 'New Tag', 'tags/create');
	}
]);
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
'use strict';

// Tags controller
angular.module('tags').controller('TagsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tags',
    function ($scope, $stateParams, $location, Authentication, Tags) {
        $scope.authentication = Authentication;
        $scope.query = {
            text: '',
            search: function () {
                $scope.tags = Tags.query({
                    text: $scope.query.text
                });
            }
        };

        // Find a list of Tags
        $scope.find = function () {
            $scope.tags = Tags.query();
        };

        // Find existing Tag
        $scope.findOne = function () {
            $scope.tag = Tags.get({
                tagId: $stateParams.tagId
            });
        };
    }
]);
'use strict';

//Tags service used to communicate Tags REST endpoints
angular.module('tags').factory('Tags', ['$resource',
	function($resource) {
		return $resource('api/tags/:tagId', { tagId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/api/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/api/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/api/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('api/users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
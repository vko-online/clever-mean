'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/recode-kz',
	assets: {
		lib: {
			css: [
				'public/lib/medium-editor/dist/css/medium-editor.min.css',
				'public/lib/side-comments/release/side-comments.min.css',
				'public/lib/Angular-Hero/angular-hero.css',
				'public/lib/fullpage.js/dist/jquery.fullpage.min.css',
				'public/lib/font-awesome/css/font-awesome.css',
				'public/lib/medium-editor/dist/css/themes/bootstrap.min.css',
				'public/lib/ng-tags-input/ng-tags-input.min.css',
				'public/lib/ng-tags-input/ng-tags-input.bootstrap.min.css',
				'public/lib/ngToast/dist/ngToast.min.css',
				'public/lib/ngToast/dist/ngToast-animations.min.css',
				'public/lib/colors/css/colors.min.css'
			],
			js: [
				//'public/lib/less/dist/less.min.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/angular-file-upload/dist/angular-file-upload.min.js',
				'public/lib/medium-editor/dist/js/medium-editor.min.js',
				'public/lib/peity/jquery.peity.min.js',
				'public/lib/randomcolor/randomColor.js',
				'public/lib/side-comments/release/side-comments.min.js',
				'public/custom_lib/socket.js',
				'public/lib/angular-socket-io/socket.js',
				'public/lib/Angular-Hero/angular-hero.js',
				'public/lib/fullpage.js/dist/jquery.fullpage.min.js',
				'public/lib/ng-tags-input/ng-tags-input.min.js',
				'public/lib/jparallax/js/jquery.parallax.min.js',
				'public/lib/zeroclipboard/dist/ZeroClipboard.min.js',
				'public/lib/ngToast/dist/ngToast.min.js',
				'public/lib/colors/js/colors.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};

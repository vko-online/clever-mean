'use strict';

module.exports = {
	app: {
		title: 'recode_kz',
		description: 'Freelancing service for software developers',
		keywords: 'freelance, almaty, developer, software developer, freelance.kz, rabota, работа'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/medium-editor/dist/css/medium-editor.css',
				'public/lib/side-comments/release/side-comments.css',
				'public/lib/Angular-Hero/angular-hero.css',
				'public/lib/fullpage.js/dist/jquery.fullpage.css',
				'public/lib/font-awesome/css/font-awesome.css',
				'public/lib/medium-editor/dist/css/themes/bootstrap.css',
				'public/lib/ng-tags-input/ng-tags-input.css',
				'public/lib/ng-tags-input/ng-tags-input.bootstrap.css',
				'public/lib/ngToast/dist/ngToast.css',
				'public/lib/ngToast/dist/ngToast-animations.css'
			],
			js: [
				//'public/lib/less/dist/less.js',
				'public/lib/jquery/dist/jquery.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-file-upload/dist/angular-file-upload.js',
				'public/lib/medium-editor/dist/js/medium-editor.js',
				'public/lib/peity/jquery.peity.js',
				'public/lib/randomcolor/randomColor.js',
				'public/lib/side-comments/release/side-comments.js',
				'https://cdn.socket.io/socket.io-1.4.3.js',
				'public/lib/angular-socket-io/socket.js',
				'public/lib/Angular-Hero/angular-hero.js',
				'public/lib/fullpage.js/dist/jquery.fullpage.min.js',
				'public/lib/ng-tags-input/ng-tags-input.js',
				'public/lib/jparallax/js/jquery.parallax.js',
				'public/lib/zeroclipboard/dist/ZeroClipboard.js',
				'public/lib/ngToast/dist/ngToast.js'
			]
		},
		css: [
			'public/modules/**/css/*.css',
			'public/css/**/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
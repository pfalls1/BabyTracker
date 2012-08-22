require([
	'libs/angular',
	'services/authInterceptor'
], function(angular) {
	'use strict';

	angular.module('babyTracker', ['babyTracker.services'], function($routeProvider, $locationProvider) {
		$routeProvider.
			when('/login', {templateUrl: 'scripts/partials/login.html'}).
			when('/secure', {templateUrl: 'scripts/partials/secure.html'}).
			otherwise({redirectTo: '/', templateUrl: 'scripts/partials/home.html'});
			
			// Remove the comment as soon as deployed to production,
			// right now this is turned off so that local testing is easier
			//$locationProvider.html5Mode(true);
	});
});
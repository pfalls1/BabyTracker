require([
	'libs/angular',
	'services/services'
], function(angular) {
	'use strict';

	angular.module('babyTracker', ['babyTracker.services'], function($routeProvider, $locationProvider) {
		$routeProvider.
			// TODO: Make 'scripts/partials/' some sort of config variable. Or perhaps 
			// Extend routeProvider to know where to look.
			when('/', {
				templateUrl: 'scripts/partials/home.html'
			}).
			when('/login', {
				templateUrl: 'scripts/partials/login.html'
			}).
			when('/secure', {
				templateUrl: 'scripts/partials/secure.html'
			}).
			otherwise({
				redirectTo: '/404', templateUrl: 'scripts/partials/404.html'
			});
			
			// Remove the comment as soon as deployed to production,
			// right now this is turned off so that local testing is easier
			$locationProvider.html5Mode(true);
	});
});
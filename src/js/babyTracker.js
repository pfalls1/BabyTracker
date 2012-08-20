angular.module('babyTracker', ['babyTracker.services'], function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/login', {templateUrl: 'partials/login.html'}).
      when('/secure', {templateUrl: 'partials/secure.html'}).
      otherwise({redirectTo: '/', templateUrl: 'partials/home.html'});

    // Remove the comment as soon as deployed to production,
    // right now this is turned off so that local testing is easier
    //$locationProvider.html5Mode(true);
});
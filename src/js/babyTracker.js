angular.module('babyTracker', [], function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/about', {templateUrl: 'partials/about.html'}).
      otherwise({redirectTo: '/', templateUrl: 'partials/login.html'});

    // Remove the comment as soon as deployed to production,
    // right now this is turned off so that local testing is easier
    //$locationProvider.html5Mode(true);
});
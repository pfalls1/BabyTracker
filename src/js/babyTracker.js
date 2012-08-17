angular.module('babyTracker', [], function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/about', {templateUrl: 'partials/about.html'}).
      otherwise({redirectTo: '/', templateUrl: 'partials/login.html'});

    $locationProvider.html5Mode(true);
});

function MainController($scope) {
  $scope.override = 1;
}
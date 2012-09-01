'use strict'

function RegistrationController($scope, $http, $location) {
  $scope.username = ''
  $scope.password = ''

  // Event
  $scope.submit = function() {
    
    $http.post('http://localhost:3001/user', {username: $scope.username, password: $scope.password}, { withCredentials: true }).
      success(function(data, status, headers, config) {
        $location.path('/');
      }).
      error(function(data, status, headers, config) {
        $scope.error = data.error;
      });
  }
}

RegistrationController.$inject = ['$scope', '$http', '$location'];
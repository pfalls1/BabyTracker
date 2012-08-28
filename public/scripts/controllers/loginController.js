'use strict'

function LoginController($scope, $http, authService) {
  $scope.username = ''
  $scope.password = ''

  // Event
  $scope.submit = function() {
    
    $http.post('http://localhost:3001/login', {username: $scope.username, password: $scope.password}, { withCredentials: true }).
      success(function(data, status, headers, config) {
        authService.redirect('/');
      }).
      error(function(data, status, headers, config) {
        console.log("error");
        console.log(data);
        console.log(status);
        console.log(headers);
        console.log(config);
      });
  }
}

LoginController.$inject = ['$scope', '$http', 'authService'];
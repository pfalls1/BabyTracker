'use strict'

function UserListController($scope, $http) {
  $scope.users = [];

  // retrieve the list of users
  $http.get('http://localhost:3001/users', { withCredentials: true }).
    success(function(data, status, headers, config) {
      $scope.users = data.users;
    }).
    error(function(data, status, headers, config) {
      // TODO: what could possibly be returned here?
    });
}

UserListController.$inject = ['$scope', '$http'];
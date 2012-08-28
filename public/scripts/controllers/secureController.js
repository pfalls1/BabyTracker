'use strict'

function SecureController($scope, $http) {
  
  $http.get('http://localhost:3001/restricted', { withCredentials: true }).
    success(function(data, status, headers, config) {
      console.log(data);
    }).
    error(function(data, status, headers, config) {
      alert(status);
    });
}

SecureController.$inject = ['$scope', '$http'];
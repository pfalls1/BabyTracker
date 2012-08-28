'use strict'

function LoginController($scope, $http) {
  $scope.username = ''
  $scope.password = ''

  // Event
  $scope.submit = function() {
    
    $http.post('http://localhost:3001/login', {username: $scope.username, password: $scope.password}, { withCredentials: true }).
      success(function(data, status, headers, config) {
        console.log("success");
      }).
      error(function(data, status, headers, config) {
        console.log("error");
        console.log(data);
        console.log(status);
        console.log(headers);
        console.log(config);
      });
    /*
    var req = new XMLHttpRequest;
    req.open('POST', 'http://localhost:3001/user', false);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send('{"name":"tobi","species":"ferret"}');
    console.log(req.responseText);
    */
  }

  $scope.getRestricted = function() {
    $http.get('http://localhost:3001/restricted', { withCredentials: true }).
      success(function(data, status, headers, config) {
        console.log(data);
      }).
      error(function(data, status, headers, config) {
        alert(status);
      });
  }
}
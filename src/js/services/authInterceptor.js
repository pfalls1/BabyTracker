require([
	'lib/angular'
], function(angular) {
	'use strict'

	angular.module('babyTracker.services', []).
		config(['$httpProvider', function($httpProvider) {
			var interceptor = ['$rootScope', '$q', function($rootScope, $q) {
				// for successful responses, we don't need to intercept anything, 
				// so we'll just return the response as it.
				function success(response) {
					return response;
				}

				// On error, we need to check the response code.
				// On 401 Unauthorized, we broadcast the "requireLogin" event
				function error(response) {
					var status = response.status;

					if (status == 401) {
						var deferred = $q.defer();
						scope.$broadcast('event:loginRequired');
	        			return deferred.promise;
					} else {
						return $q.reject(response);
					}
				}

				return function(promise) {
					return promise.then(success, error);
				}
			}];

			$httpProvider.responseInterceptors.push(interceptor);
		}]);
});
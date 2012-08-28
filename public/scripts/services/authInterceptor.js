require([
	'libs/angular',
	'services/services'
], function(angular, services) {
	'use strict'

	services.provider('authService', function() {
		var previousRoute;

		this.$get = ['$location', function($location) {
			return {
				setPreviousRoute: function(route) {
					previousRoute = route;
				},
				redirect: function(defaultPath) {
					if (previousRoute) {
						$location.path(previousRoute);
					} else {
						$location.path(defaultPath);
					}
				}
			};
		}];
	}).
	
	config(['$httpProvider', function($httpProvider) {
		var interceptor = ['$rootScope', '$q', '$location', 'authService', function($rootScope, $q, $location, authService) {
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
					console.log('redirecting...');
					// save current route that we will go back to
					authService.setPreviousRoute($location.path());

					// redirect to the login page
					$location.path('/login');

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
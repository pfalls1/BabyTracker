require({
	// configuration cgoes here

	// we're configuring angularjs as a shim
	shim: {
		'libs/angular': {exports: 'angular'}
	}

}, [
	// All our requirements
	'app',
	'controllers/applicationController',
	'controllers/loginController',
	'controllers/secureController',
	'services/services',
	'services/authInterceptor'
], function(app) {

});
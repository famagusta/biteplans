var constantData = {
	'constants':{
		'API_SERVER':'http://127.0.0.1:8000/'
	};
};
angular.forEach(constantData,function(key,value) {
	app.constant(value,key);
});
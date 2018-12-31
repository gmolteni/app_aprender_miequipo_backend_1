//INFO: levantar app temporal para tests

const http= require('http');
const app= require('../../app');
const app_token= require('../../app_token'); //XXX:encapsular uso de jwt

var app_;
var url_;

function setup() {
	return app.ormInstance.sync({ force: 1 }) //A: cree las tablas de cero
		.then(() => {
			app_ = http.createServer(app);
			app_.listen(0);
			url_= "http://localhost:"+app_.address().port;
			console.log("ENV URL", url_);
	});
}

function tearDown() {
	app_.close();
};

function url() {
	return url_;
}

module.exports= {
	setup,
	tearDown,
	url,
};


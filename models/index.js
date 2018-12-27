//INFO: configure orm= connect to db, define models

'use strict';
 
var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var log       = (!process.env.LOG || process.env.LOG === 'false') ? false : true;
var config    = require(__dirname + '/../config/database.js');

var ormInstance; //U: models and ormInstance, to configure only once

function init() {
	config.logging= (env === 'development' || log) ? console.log : false;

  ormInstance= new Sequelize(config.url, config.user, config.pass, config)
	//A: ormInstance connected to db

	fs
		.readdirSync(__dirname)
		.filter(file => ( (file !== basename) && (file.slice(-3) === '.js')))
		.forEach(function (file) {
				var model = ormInstance['import'](path.join(__dirname, file));
	});
	//A: all model files in this dir loaded

	Object.keys(ormInstance.models).forEach(function (modelName) {
		var model= ormInstance.models[modelName];
		if (model.associate) { model.associate(ormInstance.models); } 
	});
	//A: associate methods called

	Object.keys(ormInstance.models).forEach(function (modelName) {
		var model= ormInstance.models[modelName];
		if (model.addScopes) { model.addScopes(ormInstance); }
		if (model.addHooks) { model.addHooks(ormInstance); }
	});
	//A: addScopes and addHooks methods called

	return ormInstance;
}

module.exports = ormInstance || init();


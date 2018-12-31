//INFO: api rest para db relacional, modulo, para poder testear
//ASK: https://pizarra.podemosaprender.org/2018/04/contacto.html
//ASK: aprender@mauriciocap.com

const Sequelize = require('sequelize');
const finale = require('finale-rest');
const http = require('http');
const express = require('express');
const	bodyParser = require('body-parser');

const app_token= require("./app_token");
const admin= require('./admin');
const authorization= require('./authorization');
//A: required libraries

const ormInstance = require('./models');
//A: a CONFIGURED ormInstance with models

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//A: parsear lo que envia el cliente

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*'); //XXX:SEC configurar, ideal el config/...
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Accept, application/json, Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-pa-token');
    next();
});
//A: devolver headers que necesita el browser para CORS

function requireValidToken(req, res, context) { //U: middleware para finale que decide permisos 
	let tk= req.get('X-pa-token');
	var credentials= app_token.credentials(tk);
	if (credentials) { //A: tiene un token valido que le dio este backend
		return authorization.usuarioPuede(credentials,req)
			.then( siPuede => { 
				if (siPuede==true) { return context.continue } //A: seguir con finale
				else if (typeof(siPuede)=="object") { //A: devolver lo que nos pasaron y cortar aca
					if(siPuede.continue) {
						context.options= siPuede.options; return context.continue;
					}
					else {
						res.status(siPuede.status || 200).json(siPuede.body); return context.stop; 
					}
				}
				else { //A: no se puede
					res.status(401).send("not allowed"); return context.stop; 
				}
			});
	} 
	//A: DFLT no tiene token valido O no tiene permisos //XXX:distinguir mensaje error?
	res.status(401).send("invalid token");
	return context.stop;
}

app.get("/login",function (req,res) { //U: ruta especial, recibe un token o usuario y clave
	if (req.query.tg) { //A: recibimos token OAuth de google
		app_token.loginWithGoogle(req.query.tg)	
			.then( udata => { res.json(udata); })
			.catch( error => {
				console.log("AUTH LOGIN ERROR", error);
				res.status(401).send("invalid token");
			})
	} //XXX: agregar caso token OAuth de Facebook, y caso usuario / clave
	else {
		throw new Error('fallo autenticacion');
	}
});

finale.initialize({
  app: app,
  sequelize: ormInstance
});
//A: conecte finale (que atiende pedidos rest) al servidor web y mi db

var restResources= {};

Object.keys(ormInstance.models).forEach(function (modelName) {
	console.log("MODEL",modelName);
	let r= restResources[modelName]= finale.resource({
		model: ormInstance.models[modelName],
		endpoints: ['/'+modelName.toLowerCase()+'s', '/'+modelName.toLowerCase()+'s/:id'],
		associations: true,
	});
	r.all.auth(requireValidToken);
});
//A: cree urls (endpoints) REST para todas las entidades definidas, de tipo (entidad)s para preguntar la lista y (entidad)/id para trabajar sobre un solo elemento

app.ormInstance= ormInstance;
module.exports= app;

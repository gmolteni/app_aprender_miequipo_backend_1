//INFO: api rest para db relacional, modulo, para poder testear
//ASK: https://pizarra.podemosaprender.org/2018/04/contacto.html
//ASK: aprender@mauriciocap.com

const Sequelize = require('sequelize');
const finale = require('finale-rest');
const http = require('http');
const express = require('express');
const	bodyParser = require('body-parser');
const jwt= require('jsonwebtoken');

const oauth= require("./oauth.js");
const admin= require('./admin.js');
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

secret= 'SecretoLasPelotas'; //U: web token key //XXX:SEC configurar, en config/... usar clave segura (RSA?)

function requireValidToken(req, res, context) { //U: middleware para finale que decide permisos 
	//XXX: desacoplar permisos de finale, //SEE: https://github.com/Aclify/aclify
	return new Promise( (resolve, reject) => {
		let tk= req.get('X-pa-token');
		console.log("AUTH TOK",tk);
		var credentials= tk && jwt.verify(tk, secret);
		if (credentials) { //A: tiene un token valido que le dio este backend
			if (req.method=="GET") { 
				//A: solo consulta, por ahora le dejo ver TODO XXX:SEC filtrar ej mails!
				resolve(context.continue); 
				return;
			}
			else if (req.path=="/users/"+credentials.user) {
				//A: puede modificar su propio usuario
				//XXX: borrado logico? consistencia?
				resolve(context.continue); 
				return;
			}
			else {
				console.log("AUTH ERR",req.method, req.path,credentials);
			}
		} 
		//A: DFLT no tiene token valido O no tiene permisos //XXX:distinguir mensaje error?
		res.status(401).send("invalid token");
		resolve(context.stop);
	});
}

app.get("/login",function (req,res) { //U: ruta especial, recibe un token o usuario y clave
	if (req.query.tg) { //A: recibimos token OAuth de google
		oauth.userForGoogle(req.query.tg)	
			.then( udata => {
				console.log("AUTH LOGIN GOOGLE", udata);
				admin.userForOAuth(udata)
				.then( user => {
					console.log("AUTH LOGIN USER", user.id); 
					let token= jwt.sign({ user: user.id, }, secret, { expiresIn: 60 * 60 }); 
					res.json({id: user.id, nick: user.nick, token: token});
				})
			})
			.catch( error => {
				console.log("AUTH LOGIN ERROR", error);
				res.send("ERR");
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
		associations: true
	});
	r.all.auth(requireValidToken);
});
//A: cree urls (endpoints) REST para todas las entidades definidas, de tipo (entidad)s para preguntar la lista y (entidad)/id para trabajar sobre un solo elemento

app.ormInstance= ormInstance;
module.exports= app;

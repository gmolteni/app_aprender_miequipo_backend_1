//INFO: api para manejar NUESTRO token

const oauth= require("./oauth.js");
const admin= require('./admin.js');
//A: required libraries

const jwt= require('jsonwebtoken');
const CfgJwt= require(__dirname+"/config/token.json");
//A: configuracion para NUESTRO token

function credentials(tk) { //U: devuelve los datos del usuario SOLO SI tiene un token valido que le dimos
	var credentials= tk && jwt.verify(tk, CfgJwt.secret); //A: lanza excepcion o devuelve null si no es valido o expiro
	return credentials; 
}

function credentialsForUser_(user) {
	console.log("AUTH LOGIN USER", user.id); 
	let token= jwt.sign({ user: user.id, }, CfgJwt.secret, { expiresIn: 60 * 60 }); 
	return {id: user.id, nick: user.nick, token: token};
}

function loginWithGoogle(googleTk) { //U: devuelve token NUESTRO y datos para usuario SI ES VALIDO token de google
		return oauth.userForGoogle(googleTk)	
			.then( udata => {
				console.log("AUTH LOGIN GOOGLE", udata);
				return admin.userForOAuth(udata);
			})
			.then( credentialsForUser_);
}

module.exports = {
	credentials,
	loginWithGoogle,
};

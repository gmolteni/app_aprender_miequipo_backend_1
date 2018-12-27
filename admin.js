//INFO: identificar usuarios y permisos

const ormInstance = require('./models');
//A: a CONFIGURED ormInstance with models
const models= ormInstance.models;

function userForOAuth(data) { //U: busca o crea el usuario para unas credenciales OAuth
	return ( 
		models.UserId3p
		.findOne({where: {provider: data.provider, id3p: data.id3p}, include: [ models.User ]})
		.then(uid => { //A: lo busque con el Id del proveedor
			if (!uid) { //A: no estaba
				var udata= {nick: data.nick, email: data.email};
				var uid_= models.UserId3p.create({provider: data.provider, nick: data.nick, id3p: data.id3p, User: udata}, {include: [models.User]});
				//A: cree el usuario Y el userId
				return uid_.then(uid => { console.log("USER CREADO "+uid.User.id); return uid.User; });
			}
			else {
				return uid.User;
			}
		}));
}

module.exports= {
	ormInstance,
	models,
	userForOAuth,
}

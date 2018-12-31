//INFO: autorizacion, para api rest PERO tambien separada, usable y testeable

function usuarioPuede(credentials,req) { //U: devuelve una promesa que resuelve FALSE si no permitimos, TRUE si hay que continuar el request, o {status: ..., body: ...} para terminarlo con esa respuesta

	//A: es una promesa asi podemos hacer queries con sequelize si hace falta (ej. si el usuario es owner de un proyecto)
	//A: recibe un kv en formato request de express, NO ABUSAR asi tambien le podemos pasar un kv hecho a mano
	if (req.path=="/users/"+credentials.user) {
		//A: puede modificar su propio usuario
		if (req.method=="DELETE") {
			return Promise.resolve({body: "eliminado"});
		}
		else {
			return Promise.resolve(true); 
		}
	}
	else if (req.path.startsWith("/users")) {
		return Promise.resolve({continue: true, options: { attributes: ["id","nick"] }});
	}
	else if (req.method=="GET") { 
		//A: solo consulta, por ahora le dejo ver TODO XXX:SEC filtrar ej mails!
		return Promise.resolve(true);
	}
	else {
		console.log("AUTH ERR",req.method, req.path,credentials);
	}
	return Promise.resolve(false);
}

module.exports= {
	usuarioPuede,
}

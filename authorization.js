//INFO: autorizacion, para api rest PERO tambien separada, usable y testeable

function usuarioPuede(credentials,req) { //U: devuelve una promesa que resuelve TRUE si permitimos
	//A: es una promesa asi podemos hacer queries con sequelize si hace falta (ej. si el usuario es owner de un proyecto)
	//A: recibe un kv en formato request de express, NO ABUSAR asi tambien le podemos pasar un kv hecho a mano
	if (req.method=="GET") { 
		//A: solo consulta, por ahora le dejo ver TODO XXX:SEC filtrar ej mails!
		return Promise.resolve(true);
	}
	else if (req.path=="/users/"+credentials.user) {
		//A: puede modificar su propio usuario
		//XXX: borrado logico? consistencia?
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

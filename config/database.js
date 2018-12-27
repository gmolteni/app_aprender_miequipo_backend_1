//INFO: generar configuracion para db/sequelize

var dbCfg= {};

if (process.env.DATABASE_URL) {
	//A: if the application is executed on Heroku ... use the postgres database
	var dbUrl= new url.URL(process.env.DATABASE_URL);

	dbCfg.url= process.env.DATABASE_URL;
	dbCfg.dialect= 'postgres';
	dbCfg.protocol= 'postgres';
	dbCfg.port= dbUrl.port,
	dbCfg.host= dbUrl.hostname,
	dbCfg.logging= true //false
} else {
	//A: the application is executed on the local machine ... use sqlite3
	dbCfg.url= 'example-app-db';
	dbCfg.user= 'root';
	dbCfg.dialect= 'sqlite';
	dbCfg.storage= 'datos.db'
}

module.exports= dbCfg;

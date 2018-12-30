//INFO: servir la API rest usando express (separado para testear app)
const http = require('http');
const app= require("./app.js");

app.set('port', process.env.PORT || 3000); //A: si me pasan PORT= tengo que usar ese (ej. heroku)
var server= http.createServer(app); //A: configure servidor web

app.ormInstance
  .sync({ force: 0 }) //A: actualice db segun modelos (force: 1 elimina y vuelve a crear tablas)
  .then(function() {
    server.listen(app.get('port'),function() {
      var host = server.address().address,
          port = server.address().port;
      console.log('listening at http://%s:%s', host, port);
    });
}); //A: lance servidor y mostre en que puerto


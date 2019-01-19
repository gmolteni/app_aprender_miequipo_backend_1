# app_aprender_miequipo_backend_1

sequelize + finale +  jason web token + query Facebook, Google

ASK: https://pizarra.podemosaprender.org/2018/04/contacto.html

ASK: aprender@mauriciocap.com

Como 

* lo quiero ejecutar en un hosting baratito 
* quería algo facil de enseñar a principiantes 

Arme este backend con node + sequelize + finale .

Me gusto porque:

* en sequelize definis entidades y relaciones (y validaciones) re facil y no escribis nada de ddl/sql
    además tengo un truco para generar los forms automáticamente desde las validaciones
* finale lo expone como API REST automaticamente
* finale tiene hooks para controlar los permisos.
* le agregue un token con jasonwebtoken
* quiero agregar permisos por rol con https://github.com/Aclify/aclify sobre sequelize

*OjO! es work recontra in progress ;)*

Para entender el código:

* https://github.com/tommybananas/finale
* http://docs.sequelizejs.com/manual/installation/usage.html
* Validacion http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations

## Para instalar o desarrollar

```
npm install
```

A: tengo los módulos necesarios

Revisar en config (debería estar lista para tomar cfg de variables de ambiente ej en heroku)

```
node server.js
```

A: lancé el servidor


## Uso

La llamaría la spa https://github.com/podemosaprender/app_aprender_miequipo_web_nuxt_1

XXX:convertir a tests en tests como el ejemplo, para ejecutar con ```npm run test```

### Elegí que host vas a usar

```
HOST=`heroku apps:info -s | grep web_url | cut -d= -f2`
HOST="http://localhost:3000/"
```
 
### Me logueo con token google

(por ahora uso uno simulado "tk1" asi me ahorro llamadas a las API de los proveedores)

```
curl ${HOST}login?tg=tk1 
```

devuelve el siguiente json para mostrar en la ui Y el token para las próximas llamadas a esta API

```
{"id":1,"nick":"mauriciocap@gmail.com","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoxLCJpYXQiOjE1NDU4ODM1ODEsImV4cCI6MTU0NTg4NzE4MX0.WxURD11oR4IAJmuLURQ5vYdtoDBLcmTnECc704fg9Jc"}
```

Me guardo el token en una variable de ambiente para llamadas futuras (porque expira)


```
TOK=`curl ${HOST}login?tg=tk1 | cut '-d"' -f10`
```

### Consultar usuarios

Usando el token del paso anterior ...

``` 
curl -H "X-pa-token: $TOK" ${HOST}users
```

(si no tengo token no deberia dejarme verlos)

XXX:SEC no devolver tooodos los datos, filtrar con ACL

### Crear elementos

Se crean con POST en la coleccion correspondiente (users, projects, etc.) pasando los datos en json

XXX:SEC permisos

```
curl -H "X-pa-token: $TOK" -X POST -H "Content-Type: application/json" -d '{"username":"Ubaldo Uno", "email":"ubaldo@uno.com", "nick":"pirulo"}'  ${HOST}users
```

### Modificar elementos

Como arriba pero con PUT y usando el id

XXX:SEC permisos

```
curl -H "X-pa-token: $TOK" -X PUT -H "Content-Type: application/json" -d '{"nick":"mauriciocap"}'  ${HOST}users/1
```

### Eliminar elementos

Como arriba pero con DELETE

XXX:SEC permisos

```
curl -X DELETE ${HOST}users/1
```

## Crear app en heroku (opcional)

Sigo <https://sequelize.readthedocs.io/en/1.7.0/articles/heroku/>

```
sudo snap install --classic heroku #A: si no tenia instalado heroku cli
heroku login  #(aparece browser, login ok)

cd app0-rest-api #A: tengo que estar en el dir de mi app
heroku create #A: cree mi app
git push heroku master #A: cree mi app (todo lo que hace en heroku)

heroku addons:create heroku-postgresql:hobby-dev
heroku config:get DATABASE_URL

heroku ps:scale web=1
heroku open
heroku logs --tail
```

## Próximos pasos

### Seguridad!

Limitar ataques de fuerza bruta: https://www.npmjs.com/package/express-rate-limit ?

Autorización basada en roles:

* Si no te logueaste, sólo te dejamos loguearte, pero no atacar tipo fuerza bruta

* Si te logueaste pero tu mail no esta confirmado, sólo te dejamos ver info pública

* En principio sólo tenés permiso para modificar y ver TU propia info (incluido que proyectos y oficios te interesan)

* Podés borrar tu usuario, la baja es lógica y borramos todos tus datos MENOS el nick.

* Recursos compartidos:
   * Siempre baja lógica, y versionados (guardamos copia de lo anterior)
   * Puede haber un NIVEL segun que hice (ej. complete X datos) o administrado a mano
   * Además hay "relaciones" con lo que modifico, ej. no puedo modificar un proyecto si no soy "editor", no puedo ver si no soy "participante"
   * Para crear/modificar autorización por PUNTOS vs. tipo/cantidad de cambios
       * ej. si recién me anoté tengo 10 puntos, crear un proyecto me lleva 5, oficio 10
       * ej. otros usuarios con más puntos me pueden dar creditos
       * ej. gano puntos si completé mi github + blog + trello
       * ej. gano puntos por review de otros de mis standup, avance, proyectos
   * Puede haber PUNTOS para un proyecto, ej. si completo una tarea ...

Para *desacoplar* los permisos del resto (en especial express), de la documentacion de finale ...

Controller | Endpoint | Description
-----------|----------|------------
userResource.create | POST /users | Create a user
userResource.list | GET /users  | Get a listing of users
userResource.read | GET /users/:id | Get details about a user
userResource.update | PUT /users/:id | Update a user
userResource.delete | DELETE /users/:id | Delete a user


XXX:convertir a tests en tests como el ejemplo, para ejecutar con ```npm run test```

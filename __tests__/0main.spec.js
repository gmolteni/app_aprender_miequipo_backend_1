//INFO: los tests para mi aplicacion, escribo npm run test y jest y supertest ejecutan todo

const request = require('supertest');
const app = require('../app');
const app_token= require('../app_token'); //XXX:encapsular uso de jwt

describe('Probar url principales (no funcionalidad)', () => {
		beforeAll( () => {
			return app.ormInstance.sync({ force: 1 }); //A: cree las tablas de cero
		});

    test('Responde 404 not found en /', () => {
      return request(app).get("/").expect(404);
    });

		test('Responde 401 unauthorized si no tengo token', () => {
      return request(app).get("/users").expect(401,"invalid token");
    });

		test('No puedo conseguir NUESTRO token con uno falso', () => {
      return request(app).get("/login?tg=ESTE_NO_EXISTE").expect(401,"invalid token");
		});

		test('Puedo conseguir NUESTRO token con uno de Google', () => {
      return request(app).get("/login?tg=tk1")
				.expect(200)
				.expect(res => {
					expect(res.body.id).toBeGreaterThanOrEqual(1);
					expect(res.body.nick).toBe("mauriciocap@gmail.com"); //A: cuando me registro, el nick es el mail
					var credentials= app_token.credentials(res.body.token); //A: si lanza excepcion, falla test como queremos
					console.log("CREDENTIALS",credentials);
					expect(credentials).not.toBeNull();
					expect(credentials.user).toBe(res.body.id);
				})
		});
});

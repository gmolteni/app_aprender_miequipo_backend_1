//INFO: los tests para mi aplicacion, escribo npm run test y jest y supertest ejecutan todo

const request = require('supertest');
const app = require('../app');

const jwt= require('jsonwebtoken');
const CfgJwt= require("../config/token.json");

describe('Probar url principales (no funcionalidad)', () => {
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
					expect(res.body.nick).toBe("mauriciocap");
					var tk= jwt.verify(res.body.token, CfgJwt.secret); //A: si lanza excepcion, falla test como queremos
					expect(tk).not.toBeNull();
				});
		});
});

//INFO: los tests para mi aplicacion, escribo npm run test y jest y supertest ejecutan todo

const request = require('supertest');
const app = require('../app');
describe('Probar url principales (no funcionalidad)', () => {
    test('Responde 404 not found en /', () => {
        return request(app).get("/").expect(404);
    });

		test('Responde 401 unauthorized si no tengo token', () => {
        return request(app).get("/users").expect(401,"invalid token");
    });


})

//INFO: test entry points generales

const axios= require('axios');
const app= require('./0env');
const app_token= require('../../app_token'); 

describe('Probar url principales (no funcionalidad)', () => {
		beforeAll(app.setup);
		afterAll(app.tearDown);

    test('Responde 404 not found en /', () => {
      return axios.get(app.url()+"/")
				.catch( err => { 
					expect(err.response.status).toBe(404); 
				})	
    });

		test('Responde 401 unauthorized si no tengo token', () => {
      return axios.get(app.url()+"/users")
				.catch( err => {
					expect(err.response.status).toBe(401);
					expect(err.response.data).toBe("invalid token");
				})
    });

		test('No puedo conseguir NUESTRO token con uno falso', () => {
      return axios.get(app.url()+"/login?tg=ESTE_NO_EXISTE")
				.catch( err => {
					expect(err.response.status).toBe(401);
					expect(err.response.data).toBe("invalid token");
				})
		});

		test('Puedo conseguir NUESTRO token con uno de Google', () => {
      return axios.get(app.url()+"/login?tg=tk1")
				.then( res => {
					expect(res.status).toBe(200);
					expect(res.data.id).toBeGreaterThanOrEqual(1);
					expect(res.data.nick).toBe("mauriciocap@gmail.com"); //A: cuando me registro, el nick es el mail
					var credentials= app_token.credentials(res.data.token); //A: si lanza excepcion, falla test como queremos
					console.log("CREDENTIALS",credentials);
					expect(credentials).not.toBeNull();
					expect(credentials.user).toBe(res.data.id);
				})
		});
});

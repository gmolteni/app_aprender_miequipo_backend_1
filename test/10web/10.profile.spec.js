//INFO: test de operaciones sobre el perfil

const axios= require('axios');
const app= require('./0env');
const client= require('../../client');

describe('Funcionalidad perfil de usuario', () => {
	beforeAll(() => {
		mi= {};
		return app.setup()
			.then( () => { 
				client.set_host(app.url());
				return client.login_google("tk1") 
			}) //A: nos logueamos
	});

	afterAll(app.tearDown);

	//XXX'NO puedo consultar los datos de otro usuario'

	test('Puedo cambiar mi nick', (done) => {
		return client.set_user_data({nick: "SuperMan"})
			.then( res => {
				console.log("USER ME U NICK",res.data);
				expect(res.data.id).toBe(client.get_user_id());
      	expect(res.data.nick).toBe('SuperMan');

				return client.get_user_me()
					.then(res => {
						console.log("USER ME U NICK QUERY",res.data);
						expect(res.data.id).toBe(client.get_user_id());
						expect(res.data.nick).toBe('SuperMan');
						expect(res.data.email).toBe('mauriciocap@gmail.com');
						done();
					});
			})
	});

/*
	test('Puedo cambiar mi email', (done) => {
		return request(app).put("/users/"+mi.user_id)
			.set('X-pa-token',mi.token)
			.send({email: "superman@x.com"})
			.expect( res => {
				console.log("USER ME U MAIL",res.body);
				expect(res.body.id).toBe(mi.user_id);
      	expect(res.body.email).toBe('superman@x.com');

				return request(app).get("/users/"+mi.user_id)
				.set('X-pa-token',mi.token)
				.expect(200)
				.expect(res => {
					console.log("USER ME U MAIL QUERY",res.body);
					expect(res.body.id).toBe(mi.user_id);
 		     	expect(res.body.email).toBe('superman@x.com');
				});
			})
			.end(done);
	});
*/
});

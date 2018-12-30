//INFO: test de operaciones sobre el perfil

const request = require('supertest');
const app = require('../app');

describe('Funcionalidad perfil de usuario', () => {

	beforeAll( () => {
		mi= {};
		return app.ormInstance.sync({ force: 1 }) //A: cree las tablas de cero
		.then( () => { 
			return request(app).get("/login?tg=tk1")
			.expect(res => { 
				mi.token= res.body.token; 
				mi.user_id= res.body.id;
				console.log("USER ME SETUP",mi);
			});
			//A: nos logueamos
		});
	});

	//XXX'NO puedo consultar los datos de otro usuario'

	test('Puedo cambiar mi nick', (done) => {
		return request(app).put("/users/"+mi.user_id)
			.set('X-pa-token',mi.token)
			.send({nick: "SuperMan"})
			.expect( res => {
				console.log("USER ME U NICK",res.body);
				expect(res.body.id).toBe(mi.user_id);
      	expect(res.body.nick).toBe('SuperMan');

				return request(app).get("/users/"+mi.user_id)
				.set('X-pa-token',mi.token)
				.expect(200)
				.expect(res => {
					console.log("USER ME U NICK QUERY",res.body);
					expect(res.body.id).toBe(mi.user_id);
 		     	expect(res.body.nick).toBe('SuperMan');
 		     	expect(res.body.email).toBe('mauriciocap@gmail.com');
				});
			})
			.end(done);
	});

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
});

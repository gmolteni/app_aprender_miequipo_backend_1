//INFO: datos simulados para validacion de token OAuth

module.exports= {
	tk1: { 
		issued_to: '189755818918-lr7ph85ibnro1it94viqkjujhps2tlob.apps.googleusercontent.com',
		audience: '189755818918-lr7ph85ibnro1it94viqkjujhps2tlob.apps.googleusercontent.com',
		user_id: '118419354939206641263',
		scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
		expires_in: 2368,
		email: 'mauriciocap@gmail.com',
		verified_email: true,
		access_type: 'online' 
	},
	tk2: { 
		issued_to: '189755818918-lr7ph85ibnro1it94viqkjujhps2tlob.apps.googleusercontent.com',
		audience: '189755818918-lr7ph85ibnro1it94viqkjujhps2tlob.apps.googleusercontent.com',
		user_id: '2222',
		scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
		expires_in: 2368,
		email: 'pepe@gmail.com',
		verified_email: true,
		access_type: 'online' 
	},
	cap1: {
		"success": true,
		"challenge_ts": "2018-12-20T18:10:42Z",
		"hostname": "miequipo.podemosaprender.org"
	},
	fb1: {
		apptk: { access_token: '1827542730690142|sr6aUEWXoGKVGD9z3lN__BusON4', token_type: 'bearer' },
  	me: { id: '10156361335463778', name: 'Mauricio Cap', email: 'mauriciocap@gmail.com' },
    v: { data: 
				 { app_id: '1827542730690142',
					 type: 'USER',
					 application: 'AprenderMiEquipo',
					 data_access_expires_at: 1553104275,
					 expires_at: 1545332400,
					 is_valid: true,
					 scopes: [ 'email', 'public_profile' ],
					 user_id: '10156361335463778' } }
	}
}

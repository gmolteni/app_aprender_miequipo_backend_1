//INFO: cliente para consumir la api

//XXX: hacer compatible con SPA nuxt
const axios= require('axios');

var host= 'MUST_CALL_SET_HOST';
var mi= {};

function set_host(url) { //U: la url del host que vamos a usar, puede ser un prefijo
	host= url;
}

function login_google(tk) {
	return axios.get(host+"/login?tg="+tk)
					.then(res => { 
						mi.token= res.data.token; 
						mi.user_id= res.data.id;
						console.log("USER ME LOGIN GOOGLE",mi);
					});
};

function set_user_data(data) {
	return axios.put(
			host+"/users/"+mi.user_id,
			data,
			{headers: {'X-pa-token': mi.token}}
	);
};

function get_user_id() {
	return mi.user_id;
}

function get_user_me() {
	return axios.get(
			host+"/users/"+mi.user_id,
			{headers: {'X-pa-token': mi.token}}
	);
}

module.exports= {
	set_host,
	login_google,
	get_user_id,
	get_user_me,
	set_user_data,
};

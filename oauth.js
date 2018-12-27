//INFO: standard user info for different OAuth provider tokens

/* 
	all functions will be named userFor(Provider) and return a structure like this:

		{
			provider: "GOOGLE", 
			nick: res.data.email, 
			id3p: res.data.user_id,
			email: res.data.email, 
		}
*/

const axios= require('axios');
const emu_oauth= require("./oauth_emu.js"); //U: emulate provider API answers for faster development/testing

function userForGoogle(token) {
	var providerData= new Promise( (resolve) => resolve({ data: emu_oauth[token] }));
	// axios.get("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token="+req.query.tg)
	return providerData
		.then( res => {
			console.log("OAUTH GOOGLE",res.data);
			return {
				provider: "GOOGLE", 
				nick: res.data.email, 
				id3p: res.data.user_id,
				email: res.data.email, 
			}
		})
		.catch( error => {
			console.log("OUATH GOOGLE ERROR", error);
		})
}

module.exports= {
	userForGoogle	
}

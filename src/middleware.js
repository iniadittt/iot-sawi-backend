const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./constant");
const { message } = require("./utilities");

const authentication = async (request, response, next) => {
	const authenticationHeader = request.headers["authorization"];
	const token = authenticationHeader && authenticationHeader.split(" ")[1];
	if (token == null || !token) return message(response, 400, false, "Token tidak valid", null);
	jwt.verify(token, JWT_SECRET, (error, decoded) => {
		if (error) return message(response, 400, false, "Token sudah expired", null);
		request.username = decoded.username;
		next();
	});
};

module.exports = { authentication };

const APPLICATION = {
	name: "SAWI",
	version: "1.0.0",
	description: "Restful API for IOT Backend",
};
const PORT = process.env.PORT || 9000;
const JWT_SECRET = process.env.JWT_SECRET || "";
const TOKEN_EXPIRED = 7 * 24 * 60 * 60 * 1000;

module.exports = { APPLICATION, PORT, JWT_SECRET, TOKEN_EXPIRED };

const ioConfig = {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
};

const corsConfig = {
	origin: "*",
	methods: ["GET", "POST", "OPTIONS"],
	allowedHeaders: ["Content-Type"],
};

const rateLimiterConfig = {
	windowMs: 1 * 60 * 1000,
	max: parseInt(process.env.RATE_LIMIT) || 120,
	handler: (req, res) => {
		return res.status(429).json({
			error: true,
			message: "Terlalu banyak permintaan, silakan coba lagi setelah beberapa saat.",
		});
	},
};

const message = (response, code, success, message, data) => {
	return response.status(code).json({ success, code, message, data });
};

module.exports = { ioConfig, corsConfig, rateLimiterConfig, message };

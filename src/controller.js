const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const schema = require("./schema");
const prisma = require("./prisma");
const { JWT_SECRET, TOKEN_EXPIRED } = require("./constant");
const { message } = require("./utilities");

const controller = {
	login: async (request, response) => {
		try {
			const validation = schema.login.safeParse(request.body);
			if (!validation.success) return message(response, 400, false, "Gagal validasi request", validation.error.format());
			const { username, password } = validation.data;
			await prisma.$connect();
			const user = await prisma.user.findUnique({
				where: { username },
				select: {
					id: true,
					username: true,
					password: true,
				},
			});
			await prisma.$disconnect();
			if (!user) return message(response, 200, false, "Username dan password salah", null);
			const isPasswordMatch = await bcrypt.compare(password, user.password);
			if (!isPasswordMatch) return message(response, 200, false, "Username dan password salah", null);
			const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRED });
			return message(response, 200, true, "Berhasil login", { token });
		} catch (error) {
			await prisma.$disconnect();
			return message(response, 500, false, error.message, null);
		}
	},

	get: async (request, response) => {
		try {
			await prisma.$connect();
			const [dataKelembapan, dataSuhu] = await Promise.all([
				prisma.sensor.findMany({
					take: 50,
					orderBy: { updatedAt: "desc" },
					where: { type: "KELEMBAPAN_TANAH" },
					select: {
						type: true,
						value: true,
						createdAt: true,
					},
				}),
				prisma.sensor.findMany({
					take: 50,
					orderBy: { updatedAt: "desc" },
					where: { type: "SUHU_UDARA" },
					select: {
						type: true,
						value: true,
						createdAt: true,
					},
				}),
			]);
			await prisma.$disconnect();
			const data = [...dataKelembapan, ...dataSuhu];
			const responseMap = !data.length ? [] : data;
			if (io) {
				io.emit("getDataSensor", responseMap);
			}
			return message(response, 200, true, "Berhasil mengambil data sensor", responseMap);
		} catch (error) {
			await prisma.$disconnect();
			return message(response, 500, false, error.message, null);
		}
	},

	add: async (request, response, io) => {
		try {
			const validation = schema.sensorTambah.safeParse(request.body);
			if (!validation.success) return message(response, 200, false, "Gagal validasi request", validation.error.format());
			const { type, value } = validation.data;
			await prisma.$connect();
			const createdSensor = await prisma.sensor.create({
				data: {
					type,
					value,
				},
			});
			if (!createdSensor) return message(response, 200, true, "Gagal menambah data sensor", null);
			if (io) {
				const [dataPh, dataKekeruhan] = await Promise.all([
					prisma.sensor.findMany({
						take: 50,
						orderBy: { updatedAt: "desc" },
						where: { type: "PH_AIR" },
						select: {
							type: true,
							value: true,
							createdAt: true,
						},
					}),
					prisma.sensor.findMany({
						take: 50,
						orderBy: { updatedAt: "desc" },
						where: { type: "KEKERUHAN" },
						select: {
							type: true,
							value: true,
							createdAt: true,
						},
					}),
				]);
				const data = [...dataPh, ...dataKekeruhan];
				const responseMap = !data.length ? [] : data;
				if (io) {
					io.emit("getDataSensor", responseMap);
				}
			}
			await prisma.$disconnect();
			return message(response, 200, true, "Berhasil menambah data sensor", null);
		} catch (error) {
			await prisma.$disconnect();
			return message(response, 500, false, error.message, null);
		}
	},
};

module.exports = controller;

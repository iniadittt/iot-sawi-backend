const websocket = (io) => {
	io.on("connection", (socket) => {
		console.log("Client connected:", socket.id);

		socket.on("sensorKelembapan", (message) => {
			console.log("Received sensor kelembapan data:", message);
			io.emit("sensor", message);
		});

		socket.on("sensorSuhu", (message) => {
			console.log("Received sensor suhu data:", message);
			io.emit("sensor", message);
		});

		socket.on("disconnect", () => {
			console.log("Client disconnected:", socket.id);
		});
	});
};

module.exports = websocket;

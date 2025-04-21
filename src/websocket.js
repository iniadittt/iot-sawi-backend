const websocket = (io) => {
	io.on("connection", (socket) => {
		console.log("Client connected:", socket.id);

		socket.on("getDataSensor", (message) => {
			console.log("Received sensor kelembapan data:", message);
			io.emit("sensor", message);
		});
		socket.on("disconnect", () => {
			console.log("Client disconnected:", socket.id);
		});
	});
};

module.exports = websocket;

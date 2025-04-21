const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const websocket = require("./websocket");
const controller = require("./controller");
const { PORT } = require("./constant");
const { authentication } = require("./middleware");
const { ioConfig, corsConfig, rateLimiterConfig } = require("./utilities");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, ioConfig);

websocket(io);

app.set("trust proxy", ["loopback", "linklocal", "uniquelocal"]);
app.use(express.static("public"));
app.use(cors(corsConfig));
app.use(rateLimit(rateLimiterConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/login", controller.login);
app.get("/sensor", async (request, response) => await controller.get(request, response, io));
app.post("/sensor", async (request, response) => await controller.add(request, response, io));

server.listen(PORT, async () => {
	console.log(`Server running on: http://localhost:${PORT}`);
});

const http = require("http");
const { authSocket, socketServer } = require("./socket-server");
require("dotenv").config({ path: __dirname + "/.env" });
const app = require("./app");
const { mongoConnect } = require("./services/mongo");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

console.log("Creating Socket.IO server...");
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000", "https://discussify.netlify.app"],
    credentials: true
  },
});

io.use((socket, next) => {
  console.log("authSocket middleware called");
  authSocket(socket, next);
});

io.on("connection", (socket) => {
  console.log("New socket client connected");
  socketServer(socket);
});

async function startServer() {
  try {
    await mongoConnect();
    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

startServer();
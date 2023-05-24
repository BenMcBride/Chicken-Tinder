require("dotenv").config();
require("./config/mongoose.config");
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: true });
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

require("./routes/users.routes")(app, io);
require("./routes/requests.routes")(app, io);

server.listen(port, () => console.log(`Listening on port: ${port}`));

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("requestAccepted", (requestId) => {
    socket.broadcast.emit("requestAccepted1", requestId);
  });

  socket.on("message", (requestId, message) => {
    io.to(requestId).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

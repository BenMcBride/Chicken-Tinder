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

module.exports = { app, server, io }; // Export the io instance

const findMatchedRestaurant = (acceptedRestaurants) => {
  const restaurantCounts = {};
  for (const restaurant of acceptedRestaurants) {
    const { place_id } = restaurant;
    if (!restaurantCounts[place_id]) {
      restaurantCounts[place_id] = 0;
    }
    restaurantCounts[place_id]++;
  }
  const matchedRestaurantId = Object.keys(restaurantCounts).find(
    (placeId) => restaurantCounts[placeId] >= 2
  );

  if (matchedRestaurantId) {
    const matchedRestaurant = acceptedRestaurants.find(
      (restaurant) => restaurant.place_id === matchedRestaurantId
    );
    return matchedRestaurant;
  }

  return null;
};

const connectedSockets = new Set();

io.on("connection", (socket) => {
  connectedSockets.add(socket);
  console.log("A user connected", socket.id);

  socket.on("requestAccepted", (requestId) => {
    socket.broadcast.emit("requestAccepted1", requestId);
  });

  socket.on("restaurantAccepted", (acceptedRestaurant) => {
    if (!socket.acceptedRestaurants) {
      socket.acceptedRestaurants = new Set();
    }
    socket.acceptedRestaurants.add(acceptedRestaurant);
    const allAcceptedRestaurants = Array.from(connectedSockets).reduce(
      (allAcceptedRestaurants, currentSocket) => {
        const currentSocketAcceptedRestaurants = Array.from(
          currentSocket.acceptedRestaurants || new Set()
        );
        return [...allAcceptedRestaurants, ...currentSocketAcceptedRestaurants];
      },
      []
    );
    if (allAcceptedRestaurants.length >= 2) {
      const matchedRestaurant = findMatchedRestaurant(allAcceptedRestaurants);
      if (matchedRestaurant) {
        io.emit("matchedRestaurant", matchedRestaurant);
      }
    }
  });

  socket.on("restaurantRejected", (rejectedRestaurant) => {
    socket.broadcast.emit("restaurantRejected", rejectedRestaurant);
  });

  socket.on("disconnect", () => {
    connectedSockets.delete(socket);

    console.log("A user disconnected");
  });
});

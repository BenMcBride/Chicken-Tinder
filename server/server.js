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

const findMatchedRestaurant = (acceptedRestaurants) => {
  const acceptedRestaurantNames = acceptedRestaurants.map(
    (restaurant) => restaurant.name
  );

  // Check if all users have accepted the same restaurant
  const matchedRestaurantName = acceptedRestaurantNames.reduce(
    (commonName, restaurantName) => {
      if (!commonName) {
        return restaurantName;
      }
      return commonName === restaurantName ? commonName : null;
    },
    null
  );

  if (matchedRestaurantName) {
    // Find the full restaurant object with the matched name
    const matchedRestaurant = acceptedRestaurants.find(
      (restaurant) => restaurant.name === matchedRestaurantName
    );
    return matchedRestaurant;
  }

  return null;
};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("requestAccepted", (requestId) => {
    socket.broadcast.emit("requestAccepted1", requestId);
  });

  socket.on("restaurantAccepted", (acceptedRestaurant) => {
    socket.broadcast.emit("restaurantAccepted", acceptedRestaurant);
  });

  socket.on("restaurantRejected", (rejectedRestaurant) => {
    socket.broadcast.emit("restaurantRejected", rejectedRestaurant);
  });

  const acceptedRestaurants = new Set(); // Set to store accepted restaurants for each user

  socket.on("restaurantAccepted", (acceptedRestaurant) => {
    acceptedRestaurants.add(acceptedRestaurant);

    // Check if both users have accepted the same restaurant
    // You can adjust this condition based on your requirements
    if (acceptedRestaurants.size === 2) {
      const acceptedRestaurantArray = Array.from(acceptedRestaurants);
      const matchedRestaurant = findMatchedRestaurant(acceptedRestaurantArray);
      if (matchedRestaurant) {
        io.emit("matchedRestaurant", matchedRestaurant);
        // You can perform additional actions or stop the process here
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

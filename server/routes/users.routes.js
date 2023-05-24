const UserController = require("../controllers/users.controller");
const authorize = require("../middleware/authorize");

module.exports = function (app, io) {
  app.get("/api/users", UserController.index);
  app.post("/api/users", UserController.createUser);
  app.get("/api/users/:id", UserController.findUser);
  app.get("/api/users/:email", UserController.findOneByEmail);
  app.patch("/api/users/:id", authorize, UserController.updateUser);
  // app.delete("/api/users/:id", authorize, UserController.deleteUser);
  app.delete("/api/users/:id", UserController.deleteUser);
  app.post("/api/users/login", UserController.loginUser);
  app.post("/api/users/request", UserController.sendRequest);
};

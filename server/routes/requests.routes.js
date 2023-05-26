const RequestsController = require("../controllers/requests.controller");

module.exports = function (app, io) {
  app.get("/api/requests", RequestsController.findRequests);
  app.get("/api/requests/received", RequestsController.findReceivedRequests);
  app.get("/api/requests/sent", RequestsController.findSentRequests);
  app.post("/api/requests/request", RequestsController.sendRequest);
  app.delete("/api/requests/:id", RequestsController.deleteRequest);
  app.patch("/api/requests/:id/decline", RequestsController.declineRequest);
  app.patch("/api/requests/:id/accept", RequestsController.acceptRequest);
  app.get("/api/requests/google", RequestsController.getGoogleRestaurants);
  app.put("/api/requests/:id", RequestsController.updateRequest);
  app.patch("/api/requests/:id/complete", RequestsController.completeRequest);
  app.get("/api/requests/:id", RequestsController.findRequest);
  app.delete("/api/requests", RequestsController.deleteAllRequests); // careful with this one
};

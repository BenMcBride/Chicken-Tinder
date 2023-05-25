const { Request } = require("../models/requests.model");
const { User } = require("../models/users.model");
const axios = require("axios");

module.exports.findRequests = (req, res) => {
  Request.find()
    .then((requests) => res.status(200).json(requests))
    .catch((err) => res.status(400).json(err));
};

module.exports.findRequest = (req, res) => {
  Request.findById(req.params.id)
    .then((request) => res.status(200).json(request))
    .catch((err) => res.status(400).json(err));
};

module.exports.deleteRequest = (req, res) => {
  Request.findByIdAndDelete(req.params.id)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).json(err));
};

module.exports.deleteAllRequests = (req, res) => {
  Request.deleteMany({})
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).json(err));
};

module.exports.findReceivedRequests = async (req, res) => {
  const recipientId = req.query.recipient;
  try {
    const requests = await Request.find({ recipient: recipientId });
    const transformedRequests = requests.map((request) => ({
      _id: request._id,
      sender: request.sender,
      recipient: request.recipient,
      searchLocation: request.message.searchLocation,
      searchDistance: request.message.searchDistance,
      status: request.status,
    }));
    res.status(200).json({ requests: transformedRequests });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.updateRequest = (req, res) => {
  Request.findByIdAndUpdate(req.params.id, req.body)
    .then((updatedRequest) => res.status(200).json(updatedRequest))
    .catch((err) => res.status(400).json(err));
};

module.exports.getGoogleRestaurants = async (req, res) => {
  try {
    const location = req.query.location;
    const radius = req.query.radius;
    const type = req.query.type;
    const key = req.query.key;
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: location,
          radius: radius,
          type: type,
          key: key,
        },
      }
    );

    const { results } = response.data;

    const restaurantsWithPhotos = results.map((restaurant) => {
      let photoUrl = "";
      if (restaurant.photos && restaurant.photos.length > 0) {
        const photoReference = restaurant.photos[0].photo_reference;
        photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${key}`;
      }
      return {
        ...restaurant,
        photoUrl: photoUrl,
      };
    });
    res.status(200).json({ status: "OK", results: restaurantsWithPhotos });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports.declineRequest = (req, res) => {
  Request.findByIdAndUpdate(req.params.id, { status: "Declined" })
    .then((updatedRequest) => res.status(200).json(updatedRequest))
    .catch((err) => res.status(400).json(err));
};

module.exports.acceptRequest = (req, res) => {
  Request.findByIdAndUpdate(req.params.id, { status: "Accepted" })
    .then((updatedRequest) => res.status(200).json(updatedRequest))
    .catch((err) => res.status(400).json(err));
};

module.exports.sendRequest = async (req, res) => {
  const { senderEmail, email, searchLocation, searchDistance } = req.body;
  try {
    const sender = await User.findOne({ email: senderEmail });
    const recipient = await User.findOne({ email: email });
    if (!sender || !recipient) {
      return res.status(404).json({ message: "User not found" });
    }
    const request = new Request({
      sender: sender._id,
      recipient: recipient._id,
      message: {
        searchLocation,
        searchDistance,
      },
    });
    await request.save();
    res.status(200).json({ requestId: request._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

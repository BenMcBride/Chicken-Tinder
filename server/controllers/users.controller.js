const { User } = require("../models/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = process.env.SECRET_KEY;

const generateAuthToken = (id) => {
  const token = jwt.sign({ _id: id }, secretKey);
  return token;
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateAuthToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.index = (req, res) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json(err));
};

module.exports.findUsersAll = (req, res) => {
  User.find()
    .then((allUsers) => res.status(200).json({ user: allUsers }))
    .catch((err) => res.status(400).json(err));
};

module.exports.createUser = (req, res) => {
  User.create(req.body)
    .then((newUser) => {
      const token = generateAuthToken(newUser._id);
      res.status(201).json({ user: newUser, token });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => res.status(400).json(err));
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.id)
    .then((oneUser) => res.status(200).json(oneUser))
    .catch((err) => res.status(400).json(err));
};

// by email for login purposes
module.exports.findOneByEmail = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((oneUser) => {
      if (!oneUser) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      res.status(200).json(oneUser);
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.deleteUser = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).json(err));
};

module.exports.sendRequest = async (req, res) => {
  const { senderEmail, email, searchLocation, searchDistance } = req.body;

  try {
    // Find the sender and recipient users based on their email
    const sender = await User.findOne({ email: senderEmail });
    const recipient = await User.findOne({ email: email });
    if (!sender || !recipient) {
      return res.status(404).json({ message: "User not found" });
    }
    // Create a request object
    const request = {
      sender: sender._id,
      recipient: recipient._id,
      message: {
        searchLocation,
        searchDistance,
      },
    };

    // Save the request
    sender.requestsSent.push(request);
    recipient.requestsReceived.push(request);

    await User.findByIdAndUpdate(sender._id, {
      requestsSent: sender.requestsSent,
    });
    await User.findByIdAndUpdate(recipient._id, {
      requestsReceived: recipient.requestsReceived,
    });

    res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

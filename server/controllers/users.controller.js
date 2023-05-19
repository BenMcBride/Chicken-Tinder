const { User } = require("../models/users.model");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;


const generateAuthToken = (id) => {
  const token = jwt.sign({ _id: id }, secretKey);
  return token;
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
    .catch((err) => res.status(400).json(err));
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => res.status(400).json(err));
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.id)
    .then((oneUser) => res.status(200).json(oneUser))
    .catch((err) => res.status(400).json(err));
};

module.exports.deleteUser = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).json(err));
};
const UserController = require("../controllers/users.controller");
const bcrypt = require('bcrypt');

module.exports = function (app) {
  app.get("/api/users", UserController.index);
  app.post("/api/users", createUser);
  app.get('/api/users/:id', UserController.findUser);
  app.patch('/api/users/:id', UserController.updateUser);
  app.delete('/api/users/:id', UserController.deleteUser);
};

async function createUser(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;
    // Check if the password and confirmPassword match before proceeding
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    const createdUser = await UserController.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
const UserController = require("../controllers/users.controller");
const authorize = require('../middleware/authorize');
module.exports = function (app) {
  app.get("/api/users", UserController.index);
  app.post("/api/users", UserController.createUser);
  app.get('/api/users/:id', UserController.findUser);
  app.patch('/api/users/:id', authorize, UserController.updateUser);
  app.delete('/api/users/:id', authorize, UserController.deleteUser);

  // User login route
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const token = user.generateAuthToken(); // Generate JWT token for the authenticated user
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};
import userService from "../services/users.service.js";

class UsersController {

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.loginUser(email, password);
      console.log("Login route hit!");
      res.status(200).json(result);

    } catch (error) {
      res.status(error.statusCode || 401).json({ error: error.message });
    }
  }
  
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const currentUser = req.user; 
      const user = await userService.getUserById(userId, currentUser);
      res.json(user);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await userService.updateUser(
        req.params.id,
        req.body,
        req.user
      );

      if (updatedUser) {
        res.json({
          message: "User updated successfully",
          user: updatedUser,
        });
      } else {
        res.status(400).json({ error: "Failed to update user" });
      }
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const deletedUser = await userService.deleteUser(req.params.id, req.user);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default new UsersController();

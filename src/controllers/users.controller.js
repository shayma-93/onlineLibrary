import userService from "../services/users.service.js";

class UsersController {
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, user } = await userService.loginUser(email, password);

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .status(200)
        .json({
          message: "Login successful",
          accessToken,
          user
        });
    } catch (error) {
      console.error("Login error:", error);
      res.status(error.statusCode || 401).json({ error: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
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
      const user = await userService.getUserById(req.params.id, req.user);
      res.json(user);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body, req.user);
      if (!updatedUser) {
        return res.status(400).json({ error: "Failed to update user" });
      }

      res.json({
        message: "User updated successfully",
        user: updatedUser
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id, req.user);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default new UsersController();

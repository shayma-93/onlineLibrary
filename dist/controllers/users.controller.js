import userService from "../services/users.service.js";
import { handleError, handleSuccess } from "../Errors/handleErrors.js";
import { validateRequiredFields } from "../helpers/authHelper.js";
import { notFoundError, badRequestError } from "../Errors/appError.js";
class UsersController {
  // Login a user
  async loginUser(req, res) {
    try {
      const {
        email,
        password
      } = req.body;
      const {
        accessToken,
        refreshToken,
        user
      } = await userService.loginUser(email, password);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      }).status(200).json({
        message: "Login successful",
        accessToken,
        user
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  // Create a new user
  async createUser(req, res) {
    const validation = validateRequiredFields(req.body, ["username", "first_name", "last_name", "age", "email", "password"]);
    if (validation?.error) {
      return handleError(res, badRequestError(validation.error));
    }
    try {
      const newUser = await userService.createUser(req.body);
      handleSuccess(res, newUser, "User created successfully", 201);
    } catch (error) {
      handleError(res, error);
    }
  }

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      handleSuccess(res, users);
    } catch (error) {
      handleError(res, error);
    }
  }

  // Get a user by ID
  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id, req.user);
      if (!user) {
        throw notFoundError("User not found");
      }
      handleSuccess(res, user);
    } catch (error) {
      handleError(res, error);
    }
  }

  // Update user information
  async updateUser(req, res) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body, req.user);
      if (!updatedUser) {
        return handleError(res, notFoundError("Failed to update user"));
      }
      handleSuccess(res, updatedUser, "User updated successfully");
    } catch (error) {
      handleError(res, error);
    }
  }

  // Delete a user
  async deleteUser(req, res) {
    try {
      const deleted = await userService.deleteUser(req.params.id, req.user);
      if (!deleted) {
        throw notFoundError("User not found or delete failed");
      }
      handleSuccess(res, null, "User deleted successfully");
    } catch (error) {
      handleError(res, error);
    }
  }
}
export default new UsersController();
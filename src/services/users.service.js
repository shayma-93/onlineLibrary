import { notFoundError, forbiddenError, unauthorizedError } from "../Errors/appError.js"; 
import usersRepository from "../repositories/users.repository.js";
import bcrypt from "bcryptjs";
import { roles } from "../../roles.js";
import { generateAccessToken, generateRefreshToken, } from "../helpers/jwtHelper.js";

class UsersService {
  async createUser(userData) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const userToSave = {
        ...userData,
        password_hash: hashedPassword,
        role: userData.role || "user",
      };
      return await usersRepository.create(userToSave);
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      return await usersRepository.findAll();
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      throw error;
    }
  }

  async getUserById(id, currentUser) {
    try {
      const user = await usersRepository.findById(id);
      if (!user) {
        throw notFoundError("User not found");
      }
      if (currentUser.id !== Number(id) && currentUser.role !== roles.ADMIN) {
        throw forbiddenError("You are not authorized to view this profile.");
      }
      const { password_hash, ...safeUser } = user;

      return safeUser;
    } catch (error) {
      console.error("Error in getUserById:", error);
      throw error;
    }
  }

  async updateUser(id, userData, currentUser) {
    try {
      const user = await usersRepository.findById(id);
      if (!user) {
        throw notFoundError("User not found");
      }

      if (currentUser?.id !== Number(id) && currentUser?.role !== roles.ADMIN) {
        throw forbiddenError("You are not allowed to update this user");
      }

      if (userData.name) {
        userData.name = this.capitalizeName(userData.name);
      }

      const updated = await usersRepository.update(id, userData);

      if (updated) {
        return await usersRepository.findById(id);
      }
      return null;
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw error;
    }
  }

  async deleteUser(id, currentUser) {
    try {
      const user = await usersRepository.findById(id);
      if (!user) {
        throw notFoundError("User not found");
      }

      if (currentUser?.id !== Number(id) && currentUser?.role !== roles.ADMIN) {
        throw forbiddenError("You are not allowed to delete this user");
      }

      return await usersRepository.delete(id);
    } catch (error) {
      console.error("Error in deleteUser:", error);
      throw error;
    }
  }

  capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  async loginUser(email, password) {
    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw unauthorizedError();
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw unauthorizedError();
    }

   
    const accessToken = generateAccessToken(user); 
    const refreshToken = generateRefreshToken(user); 


    const { password_hash, ...safeUser } = user;

    return {
      message: "Login successful",
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }
}

export default new UsersService();

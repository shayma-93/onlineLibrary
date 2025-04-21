import usersRepository from "../repositories/users.repository.js";
import { NotFoundError, ForbiddenError, UnauthorizedError } from "../appError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { roles } from "../../roles.js";

class UsersService {
    async createUser(userData) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(userData.password, salt);
          const userToSave = {
            ...userData,
            password_hash: hashedPassword,
            role: userData.role || 'user',
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

    async getUserById(id,currentUser) {
        try {
            const user = await usersRepository.findById(id);
            if (!user) {
                throw new NotFoundError("User not found");
            }
            if (currentUser.id !== Number(id) && currentUser.role !== roles.ADMIN) {
                throw new ForbiddenError("You are not authorized to view this profile.");
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
                throw new NotFoundError("User not found");
            }

            if (currentUser?.id !== Number(id) && currentUser?.role !== roles.ADMIN) {
                throw new ForbiddenError("You are not allowed to update this user");
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
                throw new NotFoundError("User not found");
            }

            if (currentUser?.id !== Number(id) && currentUser?.role !== roles.ADMIN) {
                throw new ForbiddenError("You are not allowed to delete this user");
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
      const users = await usersRepository.findAll();
      const user = users.find(u => u.email === email);
    
      if (!user) {
        throw new UnauthorizedError("Invalid email or password");
      }
    
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        throw new UnauthorizedError("Invalid email or password");
      }
    
      const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key_12345";
      const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "my_refresh_secret_key_54321";
    
      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role?.toLowerCase() || "user"
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );
    
      const refreshToken = jwt.sign(
        { id: user.id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
    
      const { password_hash, ...safeUser } = user;
    
      return {
        message: "Login successful",
        accessToken,
        refreshToken,
        user: safeUser
      };
    }
    
  
      }

export default new UsersService();

import { notFoundError, forbiddenError } from "../Errors/appError.js";
import { roles } from "../../roles.js";
import bcrypt from "bcryptjs";

// Check if user exists
export const checkUserExists = async (userRepo, id) => {
  const user = await userRepo.findById(id);
  if (!user) throw notFoundError("User not found");
  return user;
};

// Check if the current user is authorized
export const checkAuthorization = (currentUser, id) => {
  if (currentUser.id !== Number(id) && currentUser.role !== roles.ADMIN) {
    throw forbiddenError("You are not authorized for this action");
  }
};

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

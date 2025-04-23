import { checkUserExists, checkAuthorization, hashPassword, comparePassword } from "../helpers/userHelper.js";
import { notFoundError, forbiddenError, unauthorizedError } from "../Errors/appError.js";
import usersRepository from "../repositories/users.repository.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/jwtHelper.js";
class UsersService {
  async createUser(userData) {
    const hashedPassword = await hashPassword(userData.password);
    const userToSave = {
      ...userData,
      password_hash: hashedPassword,
      role: userData.role || "user"
    };
    return await usersRepository.create(userToSave);
  }
  async getAllUsers() {
    return await usersRepository.findAll();
  }
  async getUserById(id, currentUser) {
    const user = await checkUserExists(usersRepository, id);
    checkAuthorization(currentUser, id);
    const {
      password_hash,
      ...safeUser
    } = user;
    return safeUser;
  }
  async updateUser(id, userData, currentUser) {
    const user = await checkUserExists(usersRepository, id);
    checkAuthorization(currentUser, id);
    const updated = await usersRepository.update(id, userData);
    return updated ? await usersRepository.findById(id) : null;
  }
  async deleteUser(id, currentUser) {
    const user = await checkUserExists(usersRepository, id);
    checkAuthorization(currentUser, id);
    return await usersRepository.delete(id);
  }
  async loginUser(email, password) {
    const user = await usersRepository.findByEmail(email);
    if (!user) throw unauthorizedError("Invalid credentials");
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) throw unauthorizedError("Invalid credentials");
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const {
      password_hash,
      ...safeUser
    } = user;
    return {
      accessToken,
      refreshToken,
      user: safeUser
    };
  }
}
export default new UsersService();
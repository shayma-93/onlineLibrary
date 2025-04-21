import { forbiddenError, unauthorizedError } from "./src/Errors/appError.js"

export const roles = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "librarian",
};

export const authorize = (allowedRoles = [], allowOwnProfile = false) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw new unauthorizedError("No user information found.");
    }

    const userRole = user.role?.toLowerCase();

    const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());

    if (!allowedRoles.includes(user.role) && !allowOwnProfile) {
      if (req.params.id !== user.id) {
        throw new forbiddenError("You are not authorized to view this profile.");
      }
    }

    next();
  };
}

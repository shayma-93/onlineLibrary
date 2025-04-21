
import { ForbiddenError,UnauthorizedError } from "./src/appError.js";

export const roles = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "librarian",
};

export const authorize = (allowedRoles = [],allowOwnProfile = false) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("No user information found.");
    }

    const userRole = user.role?.toLowerCase();

    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

       if (!allowedRoles.includes(user.role) && !allowOwnProfile) {
      if (req.params.id !== user.id) {
        throw new ForbiddenError("You are not authorized to view this profile.");
      }
    }

    next();
  };
};


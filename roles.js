import { forbiddenError, unauthorizedError } from "./src/Errors/appError.js";

export const roles = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "librarian",
};

export const authorize = (allowedRoles = [], allowOwnProfile = false) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return next(unauthorizedError("No user information found."));
    }

    const userRole = user.role?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

    const isRoleAllowed = normalizedAllowedRoles.includes(userRole);
    const isOwner = allowOwnProfile && req.params.id == user.id;

    if (!(isRoleAllowed || isOwner)) {
      if (!isRoleAllowed) {
        return next(forbiddenError("You do not have permission to access this resource."));
      }
      if (!isOwner) {
        return next(forbiddenError("You are not authorized to access this profile."));
      }
    }

    next();
  };
};

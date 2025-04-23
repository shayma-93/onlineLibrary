import { forbiddenError } from "../Errors/appError.js";
import { roles } from "../../roles.js";

// Validate if user info exists in the request (for auth middleware)
export const validateUser = (req, res) => {
  if (!req.user) {
    console.error('User object is missing:', req.user); // Debugging
    res.status(401).json({
      error: "Unauthorized: Missing user info"
    });
    return false;
  }
  if (!req.user.id || !req.user.role) {
    res.status(401).json({
      error: "Unauthorized: Missing user id or role"
    });
    return false;
  }
  return true;
};

// Validate required fields in a request body
export const validateRequiredFields = (data, requiredFields) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      return {
        error: `${field} is required`
      }; // Return an error if field is missing
    }
  }
  return null; // No error if all fields are provided
};

// Check if the current user is authorized to access a resource (user or book)
export const checkAuthorization = (currentUser, ownerId) => {
  const isOwner = currentUser.id === ownerId;
  const isPrivileged = [roles.ADMIN, roles.MODERATOR].includes(currentUser.role);
  if (!isOwner && !isPrivileged) {
    throw forbiddenError("You are not authorized for this action");
  }
};

//librarycardAuth
// Admin or Librarian only (used for create, update, delete)
export const checkAdminOrLibrarian = currentUser => {
  const isPrivileged = [roles.ADMIN, roles.LIBRARIAN].includes(currentUser.role);
  if (!isPrivileged) {
    throw forbiddenError("Only admins or librarians are authorized for this action");
  }
};

// Admin, Librarian, or Owner (used for get or delete)
export const checkAdminLibrarianOrOwner = (currentUser, ownerId) => {
  const isOwner = currentUser.id === ownerId;
  const isPrivileged = [roles.ADMIN, roles.LIBRARIAN].includes(currentUser.role);
  if (!isOwner && !isPrivileged) {
    throw forbiddenError("You are not authorized for this action");
  }
};
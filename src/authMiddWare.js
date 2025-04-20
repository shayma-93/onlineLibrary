import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./appError.js"

const JWT_SECRET = 'your_jwt_secret';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid token");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};

export default authMiddleware;

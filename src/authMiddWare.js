import jwt from "jsonwebtoken";
import { unauthorizedError } from "./Errors/appError.js"

const JWT_SECRET = "my_secret_key_12345";


const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw unauthorizedError("Missing or invalid token");
  }

  const token = authHeader.split(" ")[1];
    try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    console.log(req.user);

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    throw  unauthorizedError("Invalid or expired token");
  }
};

export default authMiddleware;

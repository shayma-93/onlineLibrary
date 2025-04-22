import express from "express"
import jwt from "jsonwebtoken";
import { verifyRefreshToken } from "../helpers/jwtHelper.js";
import usersController from "../controllers/users.controller.js"
import authMiddleware from "../authMiddWare.js";
import { authorize,roles } from "../../roles.js";

const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key_12345";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "my_refresh_secret_key_54321";

const router = express.Router();

router.post("/", usersController.createUser);
router.get("/", authMiddleware, authorize([roles.ADMIN, roles.USER]), usersController.getAllUsers);
router.get("/:id", authMiddleware, authorize([roles.ADMIN, roles.USER]), usersController.getUserById);
router.post('/login', usersController.loginUser.bind(usersController)); 

router.put("/:id", authMiddleware, usersController.updateUser);
router.delete("/:id", authMiddleware, authorize([roles.ADMIN]), usersController.deleteUser)


router.post("/refresh-token", (req, res) => {
  console.log("Cookies:", req.cookies);

  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  try {
    const decoded = verifyRefreshToken(token); 
    const newAccessToken = generateAccessToken(decoded);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
});
export default router;

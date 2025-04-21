import express from "express"
import jwt from "jsonwebtoken";
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
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token: newAccessToken });
  });
});
export default router;

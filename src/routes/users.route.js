import express from "express"
import usersController from "../controllers/users.controller.js"
import authMiddleware from "../authMiddWare.js";
import { authorize,roles } from "../../roles.js";


const router = express.Router();

router.post("/", usersController.createUser);
router.get("/", authMiddleware, authorize([roles.ADMIN, roles.USER]), usersController.getAllUsers);
router.get("/:id", authMiddleware, authorize([roles.ADMIN, roles.USER]), usersController.getUserById);
router.post('/login', usersController.loginUser.bind(usersController)); 

router.put("/:id", authMiddleware, usersController.updateUser);
router.delete("/:id", authMiddleware, authorize([roles.ADMIN]), usersController.deleteUser
  )
export default router;

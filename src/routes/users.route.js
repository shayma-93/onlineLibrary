import express from "express"
import usersController from "../controllers/users.controller.js"
import authMiddleware from "../authMiddWare.js";


const router = express.Router();

router.post("/", usersController.createUser);
router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);
router.post('/login', usersController.loginUser.bind(usersController)); 

router.put("/:id", authMiddleware, usersController.updateUser);
router.delete("/:id", authMiddleware, usersController.deleteUser);

export default router;

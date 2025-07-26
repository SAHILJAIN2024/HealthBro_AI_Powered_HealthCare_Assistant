import express from "express";
import { registerUser,verifyToken } from "../controller/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyToken);

export default router;
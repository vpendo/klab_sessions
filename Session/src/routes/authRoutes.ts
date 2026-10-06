import { Router } from "express";

import { register, login } from "../controllers/authController";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/password.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
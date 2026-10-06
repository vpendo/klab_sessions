import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "You can access this protected route",
  });
});

export default router;

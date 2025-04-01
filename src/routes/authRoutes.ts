import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController"
import { authMiddleware } from "../middleware/auth"
const router = Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "Protected route" });
});

export default router;
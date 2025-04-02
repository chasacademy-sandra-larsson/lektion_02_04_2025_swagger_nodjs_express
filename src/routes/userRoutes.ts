import express, {Request, Response, NextFunction} from "express"
import { createUser, getUser, getUsers, updateUser, deleteUser } from "../controllers/userController";
//import { body, validationResult } from "express-validator"
import { validateUser } from "./../middleware/validator"
import { authMiddleware } from "./../middleware/auth"

const router = express.Router()

// CRUD för en resurs users
router.post("/", 
    validateUser,
    createUser); // Kolla bodys parametrar om giltig e-post och password, samt sanitera input exempelvis genom att använda trim()
router.get("/", getUsers); // Man kan också validera query-parametrar här
router.get("/:id", authMiddleware, getUser);
router.put("/:id", authMiddleware, validateUser, updateUser); // Samma sak på put
router.delete("/:id", authMiddleware, deleteUser);



export default router;

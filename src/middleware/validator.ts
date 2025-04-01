import { body, validationResult } from "express-validator"
import {Request, Response, NextFunction} from "express"


export const validateUser  = [
    body("email").trim().isEmail().escape(),
    body("password").trim().isLength({ min: 5}).escape(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.status(400).json({ message: "Not valid data", errors: errors.array()})
            return
        }
        next();
    }
]


// TODO: Middleware validering för post-inlägg och/eller query-paramater


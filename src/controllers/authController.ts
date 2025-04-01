import { Request, Response } from "express";
import { prisma } from "../config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};


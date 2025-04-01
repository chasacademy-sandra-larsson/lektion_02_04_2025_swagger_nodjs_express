import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes"
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
import { prisma } from "./config/db"

dotenv.config();
console.log(process.env.DATABASE_URL)

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes)
// TODO: app.use("/comments", commentRoutes )

const main = async () => {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


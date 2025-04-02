import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes"
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
import { prisma } from "./config/db"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();
console.log(process.env.DATABASE_URL)

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Instagram clone API',
      version: '1.0.0',
      description: 'A social media platform for sharing photos and videos',
    },
  },
  apis: ['./app.js'], // files containing annotations as above
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes)
// TODO: app.use("/comments", commentRoutes )


// Below your regular routes
/**
 * @openapi
 * /:
 *   get:
 *     description: Home page
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

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


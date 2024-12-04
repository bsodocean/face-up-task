import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const port: number = process.env.PORT ? Number(process.env.PORT) : 3000;

const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// API Routes

// Create a new alert
app.post("/api/alerts", async (req: Request, res: Response) => {
  const { name, age, fileUrl } = req.body;

  try {
    const newAlert = await prisma.alert.create({
      data: {
        name,
        age,
        fileUrl,
      },
    });
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ message: "Error creating alert", error });
  }
});

// Get all alerts
app.get("/api/alerts", async (req: Request, res: Response) => {
  try {
    const alerts = await prisma.alert.findMany();
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching alerts", error });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

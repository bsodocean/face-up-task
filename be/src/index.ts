import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const port: number = process.env.PORT ? Number(process.env.PORT) : 3000;

const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// API Routes

//* Creates new alert
app.post("/api/newAlert", async (req: Request, res: Response) => {
  const { id, name, age, description, fileUrl } = req.body;

  try {
    const newAlert = await prisma.alert.create({
      data: {
        id,
        name,
        age,
        description,
        fileUrl,
      },
    });
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ message: "Error creating alert", error });
  }
});

// * SERVER PING
app.get("/api/helloWorld", async (req: Request, res: Response) => {
  try {
    const sayHello = "Hello World";
    res.status(200).json(sayHello);
  } catch (error) {
    res.status(500).json({ message: "Error saying hi", error });
  }
});

// * Updates alert based on what was passed into the body
app.patch("/api/updateAlert/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    !id ? res.status(400).json({ error: "ID is required" }) : "Looking good";

    !updates || Object.keys(updates).length === 0
      ? res.status(400).json({ error: "No Update data provided" })
      : "Data provided";

    const updatedAlert = await prisma.alert.update({
      where: { id: Number(id).toString() },
      data: updates,
    });

    res.status(200).json(updatedAlert);
  } catch (err) {
    console.error("Error updating alert:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the alert." });
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

// * Starts the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

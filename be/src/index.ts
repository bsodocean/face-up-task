import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express, { Request, Response } from "express";

const app = express();
const port: number = process.env.PORT ? Number(process.env.PORT) : 3000;
const hostPort = 5173;
const host = `http://localhost:${hostPort}`;

const prisma = new PrismaClient();

// Middleware
app.use(
  express.json(),
  cors({
    origin: host,
  })
);

async function insertDummyData() {
  try {
    // Check if any data exists in the Alert table
    const existingAlerts = await prisma.alert.findMany();
    if (existingAlerts.length === 0) {
      const dummyData = [
        {
          id: "470c53e7-ce5b-4215-97cb-e6c13391f9c1",
          name: "John Doe",
          age: 25,
          description: "Sample alert 1",
        },
        {
          id: "470c53e7-ce5b-4215-97cb-e6c13391f1c5",
          name: "Jane Smith",
          age: 30,
          description: "Sample alert 2",
        },
      ];

      await prisma.alert.createMany({ data: dummyData });
      console.log("Dummy alerts added successfully.");
    } else {
      console.log("Alerts already exist in the database.");
    }
  } catch (error) {
    console.error("Error inserting alerts:", error);
  }
}

insertDummyData();

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

// * Deletes Alert
app.delete("/api/deleteAlert/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.alert.delete({
      where: { id },
    });

    const alerts = await prisma.alert.findMany();
    res.status(200).json(alerts);
  } catch (err) {
    console.error("Error deleting alert:", err);
    res.status(500).json({ error: "Failed to delete entry." });
  }
});

// * Deletes whole table for alerts
app.delete("/api/deleteAllAlerts", async (req: Request, res: Response) => {
  try {
    await prisma.alert.deleteMany({});
    res.status(200).json("Deleted table alerts succesfully");
  } catch (err) {
    console.error("Error deleting alerts table", err);
    res.status(500).json({ error: "Failed to delete alerts" });
  }
});

// * Updates alert based on what was passed into body
app.patch("/api/updateAlert/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No updates provided" });
    }

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

//* Get all alerts
app.get("/api/alerts", async (req: Request, res: Response) => {
  try {
    const alerts = await prisma.alert.findMany();
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching alerts", error });
  }
});

// * SERVER PING
app.get("/api/hello", async (req: Request, res: Response) => {
  try {
    const sayHello =
      "Hello, your server is running at " + `http://localhost:${port}`;
    res.status(200).json(sayHello);
  } catch (error) {
    res.status(500).json({ message: "Error saying hi", error });
  }
});

// * Starts the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

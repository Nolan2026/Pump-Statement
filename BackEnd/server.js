import "dotenv/config";
import express from "express";
import cors from "cors";
import { posting, fetchingdata, newEntry, createExpense, getAllExpenses, getExpensesByDateRange } from "./controler.js";
import prisma from "./prisma/prismaDb.js";

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Christopher Nolan");
});

app.post("/pumpData", posting);
app.get("/fetchData", fetchingdata);
app.post("/newEntry", newEntry)

app.get("/reading", async (req, res) => {
  try {
    const data = await prisma.reading.findMany();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Serverr error")
  }
});

// Expense routes
app.post("/expenses", createExpense);
app.get("/expenses", getAllExpenses);
app.get("/expenses/filter", getExpensesByDateRange);


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

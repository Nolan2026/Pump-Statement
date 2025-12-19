import "dotenv/config";
import express from "express";
import cors from "cors";
import { newEntry, getAllReadings, deleteReading, getReadingByDate, createExpense, getAllExpenses, getExpensesByDateRange } from "./controler.js";
import prisma from "./prisma/prismaDb.js";

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Christopher Nolan");
});

app.post("/newEntry", newEntry)
app.get("/reading", getAllReadings);
app.delete("/reading/:id", deleteReading);
app.get("/fetchReading", getReadingByDate);

// Expense routes
app.post("/expenses", createExpense);
app.get("/expenses", getAllExpenses);
app.get("/expenses/filter", getExpensesByDateRange);


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

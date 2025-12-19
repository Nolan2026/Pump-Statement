import data from "./db.js";
import prisma from "./prisma/prismaDb.js";

export const newEntry = async (req, res) => {
    try {
        const reqData = req.body;

        // Convert date string to Date object
        const dateObj = new Date(reqData.date);

        const entry = await prisma.reading.create({
            data: {
                date: dateObj,
                sa1: String(reqData.sa1 || 0),
                sa2: String(reqData.sa2 || 0),
                sb1: String(reqData.sb1 || 0),
                sb2: String(reqData.sb2 || 0),
                ea1: String(reqData.ea1 || 0),
                ea2: String(reqData.ea2 || 0),
                eb1: String(reqData.eb1 || 0),
                eb2: String(reqData.eb2 || 0),
                five: String(reqData.five || 0),
                two: String(reqData.two || 0),
                one: String(reqData.one || 0),
                fifthy: String(reqData.fifthy || 0),
                twenty: String(reqData.twenty || 0),
                ten: String(reqData.ten || 0),
                pay: String(reqData.pay || 0),
                petrollts: String(reqData.petrollts || 0),
                diesellts: String(reqData.diesellts || 0),
                upi1: String(reqData.upi1 || 0),
                upi2: String(reqData.upi2 || 0),
                cash: String(reqData.cash || 0),
                bills: String(reqData.bills || 0),
                oil: String(reqData.oil || 0),
                other: String(reqData.other || 0),
                extrapetrol: String(reqData.extrapetrol || 0),
                extradiesel: String(reqData.extradiesel || 0),
                amount: String(reqData.amount || 0),
                food: String(reqData.food || 0),
                change: String(reqData.change || 0),
                additionalAmount: String(reqData.additionalAmount || 0),
                isb1diesel: Boolean(reqData.isb1diesel),
                isb2diesel: Boolean(reqData.isb2diesel),
                isa2power: Boolean(reqData.isa2power)
            }
        });

        return res.status(201).json({
            message: "Record added",
            entry
        });

    } catch (error) {
        console.error("Db error:", error);

        if (error.code === "P2002") {
            return res.status(400).json({
                message: "Date already exists",
                detail: error.meta
            });
        }

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const getAllReadings = async (req, res) => {
    try {
        const data = await prisma.reading.findMany({
            orderBy: {
                date: 'desc'
            }
        });
        res.status(200).json(data);
    } catch (error) {
        console.error("Fetch readings error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteReading = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ message: "Invalid ID provided" });
    }

    try {
        const deleted = await prisma.reading.delete({
            where: {
                id: parseInt(id)
            }
        });

        console.log("Successfully deleted record:", id);
        res.status(200).json({
            message: "Record deleted successfully",
            id: deleted.id
        });
    } catch (error) {
        console.error("Delete reading error:", error);

        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Record not found in database" });
        }

        res.status(500).json({
            message: "Failed to delete record from database",
            error: error.message
        });
    }
};

// GET — fetch record by date using Prisma
export const getReadingByDate = async (req, res) => {
    const { date } = req.query;
    try {
        const entry = await prisma.reading.findUnique({
            where: {
                date: new Date(date)
            }
        });

        if (!entry) {
            return res.status(404).json({ message: "No data found for this date" });
        }

        res.status(200).json({
            message: "Data fetched successfully",
            data: [entry],
        });
    } catch (error) {
        console.error("Fetch reading by date error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Expenses Controllers
export const createExpense = async (req, res) => {
    try {
        const reqData = req.body;

        // Convert date string to Date object
        const dateObj = new Date(reqData.date);

        // Parse amounts as decimals
        const travelling = parseFloat(reqData.travelling) || 0;
        const breakfast = parseFloat(reqData.breakfast) || 0;
        const lunch = parseFloat(reqData.lunch) || 0;
        const dinner = parseFloat(reqData.dinner) || 0;
        const others = parseFloat(reqData.others) || 0;
        const loss = parseFloat(reqData.loss) || 0;
        const gain = parseFloat(reqData.gain) || 0;

        // Calculate expenses (sum of all expense items)
        const expenses = travelling + breakfast + lunch + dinner + others + loss;

        // Calculate total expenses (gain - expenses)
        const totalExpenses = gain - expenses;

        const expense = await prisma.expenses.create({
            data: {
                date: dateObj,
                travelling: travelling.toString(),
                breakfast: breakfast.toString(),
                lunch: lunch.toString(),
                dinner: dinner.toString(),
                others: others.toString(),
                loss: loss.toString(),
                gain: gain.toString(),
                expenses: expenses.toString(),
                totalExpenses: totalExpenses.toString()
            }
        });

        return res.status(201).json({
            message: "Expense added successfully",
            expense
        });
    } catch (error) {
        console.error("Expense creation error:", error);

        if (error.code === "P2002") {
            return res.status(400).json({
                message: "Expense record for this date already exists",
                detail: error.meta
            });
        }

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await prisma.expenses.findMany({
            orderBy: {
                date: 'desc'
            }
        });

        return res.status(200).json(expenses);
    } catch (error) {
        console.error("Fetch expenses error:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const getExpensesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const where = {};
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const expenses = await prisma.expenses.findMany({
            where,
            orderBy: {
                date: 'desc'
            }
        });

        return res.status(200).json(expenses);
    } catch (error) {
        console.error("Fetch expenses by date range error:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

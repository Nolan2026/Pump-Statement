import prisma from "./prisma/prismaDb.js";

export const newEntry = async (req, res) => {
    try {
        const reqData = req.body;

        // Convert date string to Date object
        const dateObj = new Date(reqData.date);

        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ message: "Invalid date provided" });
        }

        const safeDecimal = (val) => {
            if (val === null || val === undefined || val === '') return "0";
            const num = Number(val);
            return isNaN(num) ? "0" : String(val);
        };

        const entry = await prisma.reading.create({
            data: {
                date: dateObj,
                sa1: safeDecimal(reqData.sa1),
                sa2: safeDecimal(reqData.sa2),
                sb1: safeDecimal(reqData.sb1),
                sb2: safeDecimal(reqData.sb2),
                ea1: safeDecimal(reqData.ea1),
                ea2: safeDecimal(reqData.ea2),
                eb1: safeDecimal(reqData.eb1),
                eb2: safeDecimal(reqData.eb2),
                five: safeDecimal(reqData.five),
                two: safeDecimal(reqData.two),
                one: safeDecimal(reqData.one),
                fifthy: safeDecimal(reqData.fifthy),
                twenty: safeDecimal(reqData.twenty),
                ten: safeDecimal(reqData.ten),
                pay: safeDecimal(reqData.pay),
                petrollts: safeDecimal(reqData.petrollts),
                diesellts: safeDecimal(reqData.diesellts),
                upi1: safeDecimal(reqData.upi1),
                upi2: safeDecimal(reqData.upi2),
                cash: safeDecimal(reqData.cash),
                bills: safeDecimal(reqData.bills),
                oil: safeDecimal(reqData.oil),
                other: safeDecimal(reqData.other),
                extrapetrol: safeDecimal(reqData.extrapetrol),
                extradiesel: safeDecimal(reqData.extradiesel),
                amount: safeDecimal(reqData.amount),
                food: safeDecimal(reqData.food),
                change: safeDecimal(reqData.change),
                additionalAmount: safeDecimal(reqData.additionalAmount),
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

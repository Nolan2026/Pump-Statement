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
                sa1: String(reqData.sa1),
                sa2: String(reqData.sa2),
                sb1: String(reqData.sb1),
                sb2: String(reqData.sb2),
                ea1: String(reqData.ea1),
                ea2: String(reqData.ea2),
                eb1: String(reqData.eb1),
                eb2: String(reqData.eb2),
                five: String(reqData.five),
                two: String(reqData.two),
                one: String(reqData.one),
                fifthy: String(reqData.fifthy),
                twenty: String(reqData.twenty),
                ten: String(reqData.ten),
                pay: String(reqData.pay),
                petrollts: String(reqData.petrollts),
                diesellts: String(reqData.diesellts),
                upi1: String(reqData.upi1),
                upi2: String(reqData.upi2),
                cash: String(reqData.cash),
                bills: String(reqData.bills),
                oil: String(reqData.oil),
                other: String(reqData.other),
                extrapetrol: String(reqData.extrapetrol),
                extradiesel: String(reqData.extradiesel),
                amount: String(reqData.amount),
                food: String(reqData.food),
                change: String(reqData.change)
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


//  POST — insert new record
export const posting = async (req, res) => {
    const {
        date, sa1, sa2, sb1, sb2,
        ea1, ea2, eb1, eb2,
        five, two, one, fifthy, twenty, ten,
        pay, petrollts, diesellts,
        upi1, upi2, oil, other,
        extrapetrol, extradiesel, amount, food, change,
        cash, bills, isb1diesel, isb2diesel, isa2power
    } = req.body;

    try {
        const insertQuery = `
      INSERT INTO reading (
        date, sa1, sa2, sb1, sb2,
        ea1, ea2, eb1, eb2,
        five, two, one, fifthy, twenty, ten,
        pay, petrollts, diesellts,
        upi1, upi2, oil, other,
        extrapetrol, extradiesel, amount, food, change, 
        cash, bills, isb1diesel, isb2diesel, isa2power
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15,
        $16, $17, $18,
        $19, $20, $21, $22,
        $23, $24, $25, $26, $27, $28, $29, $30, $31, $32
      )
      RETURNING *;
    `;

        const result = await data.query(insertQuery, [
            date, sa1, sa2, sb1, sb2,
            ea1, ea2, eb1, eb2,
            five, two, one, fifthy, twenty, ten,
            pay, petrollts, diesellts,
            upi1, upi2, oil, other,
            extrapetrol, extradiesel, amount, food, change,
            cash, bills, isb1diesel, isb2diesel, isa2power
        ]);

        res.status(201).json({
            message: "Data posted successfully",
            inserted: result.rows[0],
        });
    } catch (error) {
        console.error("Database error (POST):", error);

        if (error.code === "23505") {
            // Duplicate key
            return res.status(400).json({
                message: "Date already exists",
                detail: error.detail
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

//  GET — fetch records by date
export const fetchingdata = async (req, res) => {
    const { date } = req.query;

    try {
        const query = `SELECT * FROM reading WHERE date = $1`;
        const result = await data.query(query, [date]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No data found for this date" });
        }

        res.status(200).json({
            message: "Data fetched successfully",
            data: result.rows,
        });
    } catch (error) {
        console.error("Database error (GET):", error);
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

import { createSlice } from "@reduxjs/toolkit";

// Load initial expenses from localStorage
const loadInitialExpenses = () => {
    try {
        const savedExpenses = localStorage.getItem('expensesData');
        return savedExpenses ? JSON.parse(savedExpenses) : [];
    } catch (error) {
        console.error('Error loading expenses from localStorage:', error);
        return [];
    }
};

const expenseSlice = createSlice({
    name: "expenses",
    initialState: loadInitialExpenses(),
    reducers: {
        setExpenses: (state, action) => {
            // Keep only last 5 records
            const newData = action.payload.slice(0, 5);
            return newData;
        },

        addExpenseToCache: (state, action) => {
            // Add new expense and keep only last 5
            state.unshift(action.payload);
            if (state.length > 5) {
                state.pop();
            }
        },

        clearExpenses: () => []
    },
});

export const {
    setExpenses,
    addExpenseToCache,
    clearExpenses
} = expenseSlice.actions;

export default expenseSlice.reducer;

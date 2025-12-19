import { createSlice } from "@reduxjs/toolkit";

// Load initial report data from localStorage
const loadInitialReports = () => {
    try {
        const savedReports = localStorage.getItem('reportData');
        return savedReports ? JSON.parse(savedReports) : [];
    } catch (error) {
        console.error('Error loading reports from localStorage:', error);
        return [];
    }
};

const reportSlice = createSlice({
    name: "reports",
    initialState: loadInitialReports(),
    reducers: {
        setReports: (state, action) => {
            // Keep only last 5 records (assuming API returns oldest first, we take the end)
            // If the array is smaller than 5, slice(-5) still works correctly (takes all)
            const newData = action.payload.slice(-5);
            return newData;
        },

        addReportToCache: (state, action) => {
            // Add new report and keep only last 5
            state.unshift(action.payload);
            if (state.length > 5) {
                state.pop();
            }
        },

        clearReports: () => []
    },
});

export const {
    setReports,
    addReportToCache,
    clearReports
} = reportSlice.actions;

export default reportSlice.reducer;

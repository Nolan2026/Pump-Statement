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
            // Keep only last 5 records
            const newData = action.payload.slice(0, 5);
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

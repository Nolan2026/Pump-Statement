import { createSlice } from "@reduxjs/toolkit";

// Load initial state
const loadInitialState = () => {
    try {
        const savedTodos = localStorage.getItem('todos');
        const parsed = savedTodos ? JSON.parse(savedTodos) : [];

        // Handle migration from array to object
        if (Array.isArray(parsed)) {
            return {
                items: parsed,
                saved: []
            };
        }
        return parsed;
    } catch (error) {
        console.error('Error loading todos from localStorage:', error);
        return { items: [], saved: [] };
    }
};

const todoSlice = createSlice({
    name: "todos",
    initialState: loadInitialState(),
    reducers: {
        setTodosFromStorage: (state, action) => {
            state.items = action.payload;
        },

        addTodo: (state, action) => {
            state.items.push(action.payload);
        },

        deleteTodo: (state, action) => {
            state.items = state.items.filter((todo) => todo.id !== action.payload);
        },

        toggleStrike: (state, action) => {
            const todo = state.items.find((t) => t.id === action.payload);
            if (todo) todo.striked = !todo.striked;
        },

        editTodo: (state, action) => {
            const { id, newText } = action.payload;
            const todo = state.items.find((t) => t.id === id);
            if (todo) todo.text = newText;
        },

        saveListToRedux: (state) => {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            // Ensure state.saved is an array (handle migration if needed)
            if (!Array.isArray(state.saved)) {
                state.saved = [];
            }

            // Check if we already have a save for today
            const existingIndex = state.saved.findIndex(s => s.date === today);

            const newSnapshot = {
                date: today,
                todos: [...state.items]
            };

            if (existingIndex >= 0) {
                // Update existing
                state.saved[existingIndex] = newSnapshot;
            } else {
                // Add new
                state.saved.push(newSnapshot);
            }

            // Sort by date descending (newest first)
            state.saved.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Keep only last 3 dates
            if (state.saved.length > 3) {
                state.saved = state.saved.slice(0, 3);
            }
        }
    },
});

export const {
    addTodo,
    deleteTodo,
    toggleStrike,
    editTodo,
    setTodosFromStorage,
    saveListToRedux
} = todoSlice.actions;

export default todoSlice.reducer;

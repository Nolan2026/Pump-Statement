import { createSlice } from "@reduxjs/toolkit";

// Load initial todos from localStorage
const loadInitialTodos = () => {
    try {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
        console.error('Error loading todos from localStorage:', error);
        return [];
    }
};

const todoSlice = createSlice({
    name: "todos",
    initialState: loadInitialTodos(),
    reducers: {
        setTodosFromStorage: (_, action) => action.payload,

        addTodo: (state, action) => {
            state.push(action.payload);
        },

        deleteTodo: (state, action) => {
            return state.filter((todo) => todo.id !== action.payload);
        },

        toggleStrike: (state, action) => {
            const todo = state.find((t) => t.id === action.payload);
            if (todo) todo.striked = !todo.striked;
        },

        editTodo: (state, action) => {
            const { id, newText } = action.payload;
            const todo = state.find((t) => t.id === id);
            if (todo) todo.text = newText;
        },
    },
});

export const {
    addTodo,
    deleteTodo,
    toggleStrike,
    editTodo,
    setTodosFromStorage,
} = todoSlice.actions;

export default todoSlice.reducer;

import { createSlice, configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoslices";
import expenseReducer from "./expenseSlice";
import reportReducer from "./reportSlice";

// -------- LOAD FROM LOCALSTORAGE ----------
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('billingState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading from localStorage:", err);
    return undefined;
  }
};

// -------- SAVE TO LOCALSTORAGE ----------
const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('billingState', serializedState);
  } catch (err) {
    console.error("Error saving to localStorage:", err);
  }
};

// -------- LOAD TODOS FROM LOCALSTORAGE ----------
const loadTodosFromLocalStorage = () => {
  try {
    const serializedTodos = localStorage.getItem('todos');
    if (serializedTodos === null) return [];
    return JSON.parse(serializedTodos);
  } catch (err) {
    console.error("Error loading todos from localStorage:", err);
    return [];
  }
};

// -------- SAVE TODOS TO LOCALSTORAGE ----------
const saveTodosToLocalStorage = (todos) => {
  try {
    const serializedTodos = JSON.stringify(todos);
    localStorage.setItem('todos', serializedTodos);
  } catch (err) {
    console.error("Error saving todos to localStorage:", err);
  }
};

// -------- PAYMENT SLICE ----------
const payment = {
  Ba1: 0,
  Ba2: 0,
  Bb1: 0,
  Bb2: 0,
  Aa1: 0,
  Aa2: 0,
  Ab1: 0,
  Ab2: 0,
  cash: 0,
  online: 0,
  paybills: 0,
  price: 109.79,
  dieselPrice: 97.6,
  powerPrice: 117.79,
  fuelDeduction: 0,
  amountDeduction: 0,
  foodDeduction: 100,
  isB1Diesel: false,
  isB2Diesel: false,
  isA2Power: false,
  upi: 0,
  bills: 0,
  pay: 0,
  petrollts: 0,
  diesellts: 0,
  oilnum: 0,
  others: 0,
  coins: 0,
  dieselDeduction: 0,
  billOilAmount: 0,
  billPetrolAmount: 0,
  billDieselAmount: 0,
  billsExcludingPay: 0,
  denominations: {
    five: 0,
    two: 0,
    one: 0,
    fifty: 0,
    twenty: 0,
    ten: 0,
  }
};

// Load persisted state or use default
const persistedBillingState = loadFromLocalStorage();
const initialBillingState = persistedBillingState || payment;

const settlement = createSlice({
  name: "Pump",
  initialState: initialBillingState,
  reducers: {
    update: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

// -------- MAIN APP STORE ----------
const store = configureStore({
  reducer: {
    billing: settlement.reducer,
    todos: todoReducer,
  },
});

// Subscribe to store changes and save both billing and todos state to localStorage
store.subscribe(() => {
  const state = store.getState();
  saveToLocalStorage(state.billing);
  saveTodosToLocalStorage(state.todos);
});

export default store;
export const { update } = settlement.actions;

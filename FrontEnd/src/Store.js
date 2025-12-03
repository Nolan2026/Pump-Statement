import { createSlice, configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoslices";

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
};

const settlement = createSlice({
  name: "Pump",
  initialState: payment,
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
    todos: todoReducer, // <-- FIXED
  },
});




export default store;
export const { update } = settlement.actions;

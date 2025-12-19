# 🔌 Offline Support Implementation

## Overview
Implemented offline data persistence for both **Expense** and **Report** pages. The application now caches the last 5 records in Redux and Local Storage, ensuring data is visible even when the database is disconnected.

## ✅ Features Added

### 1. **Redux Caching**
- Created `expenseSlice.jsx` & `reportSlice.jsx`.
- Stores last 5 records for instant access.
- Automatically saves cache to `localStorage`.

### 2. **Auto-Fallback Mechanism**
- **Online:** Fetches fresh data from DB → Updates UI → Updates Cache.
- **Offline:** 500/Connection Error → Detects failure → Loads data from Cache.
- **Visual Feedback:** Shows "Showing cached data (Offline mode)" toast message.

### 3. **Offline "Save" for Expenses**
- When saving an expense while offline (or DB error):
  1. Detects failure.
  2. Saves record to Local Storage/Redux Cache immediately.
  3. Updates UI instantly so you don't lose your work.
  4. Shows "Saved locally" message.

## 🛠️ Components Modified

### `Store.js`
- Integrated new reducers.
- Added subscription to auto-save `expenses` and `reports` to Local Storage.

### `Expense.jsx`
- Added Redux `useSelector` to load cached data on mount.
- Updated `fetchAllExpenses` to fallback to cache on error.
- Updated `handleSubmit` to save to cache if API fails.

### `Report.jsx`
- Added Redux `useSelector` to load cached data.
- Updated `fetchAllData` to fallback to cache on error.
- Caches the **last 5 rows** from the database.

## 🧪 How to Test

1. **Online Mode (Normal):**
   - App works as usual. Data loads from DB.
   
2. **Offline Simulation:**
   - Stop the backend server (`Ctrl+C` in backend terminal).
   - Refresh the page.
   - **Expectation:** You will still see the last 5 records! 
   - Try adding an expense.
   - **Expectation:** It appears in the table immediately (saved locally).

3. **Database disconnected:**
   - Even if the DB connection drops, the app remains usable for viewing recent history.

## 📝 Notes
- **Report Data:** Caches the *last 5* records (most recent if DB returns huge list).
- **Expenses:** Caches the *top 5* records (most recent).
- **Persistence:** Data survives page reloads (`F5`) thanks to Local Storage.

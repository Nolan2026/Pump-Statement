# Pump Statement - Smart Fuel Station Management System

A premium, modern web application designed for fuel station owners and managers to streamline daily operations, sales reporting, expense tracking, and task management.

## 🚀 Overview

**Pump Statement** is a comprehensive tool built with a focus on precision and aesthetics. It eliminates manual bookkeeping errors by providing a digitized platform for recording meter readings, managing expenses, and generating instant reports.

## ✨ Key Features

### 📊 Advanced Sales Reporting
- **Meter Reading Management**: Log start/end readings for multiple nozzles (Petrol, Diesel, Power).
- **Automated Calculations**: Instant computation of total liters sold, sale amounts, and professional settlement reports.
- **Smart Filtering**: Filter data by date range or specific keywords.
- **Export Data**: Download filtered reports in clean, professionally formatted **CSV files**.

### 💸 Expense Tracking
- **Categorized Expenses**: Track travelling, meals, and miscellaneous costs.
- **Profit/Loss Analysis**: Automatically calculates net balance (Gain - Expenses).
- **Data Export**: Export expense history to CSV for bookkeeping.

### 📝 Smart Todo List
- **Task Management**: Simple, intuitive interface for daily station tasks.
- **Historical Snapshots**: Stores the last **5 days of history** automatically.
- **Status Persistence**: Active and completed tasks are saved to local storage.

### 💳 UPI Payment Gateway
- **QR Generation**: Create instant UPI QR codes for any amount.
- **Recent history**: Remembers the last **5 unique UPI IDs** for one-tap reuse.
- **Downloadable QRs**: Save generated QR codes as PNG images for sharing.

### 🌗 Dynamic User Experience
- **Premium Aesthetics**: Glassmorphism design with smooth gradients and hover effects.
- **Dark Mode Support**: Seamlessly toggle between light and dark themes.
- **Fully Responsive**: Optimized for Desktop, Tablet, and Mobile devices.

## 🛠️ Technology Stack

### Frontend
- **React.js**: Modern UI component architecture.
- **Redux Toolkit**: Centralized state management for reports, expenses, and todos.
- **React Router**: Seamless navigation between pages.
- **React Icons**: Rich, intuitive iconography.
- **CSS3**: Custom vanilla CSS for high-performance visual excellence.

### Backend
- **Node.js & Express**: High-performance API server.
- **Prisma ORM**: Robust database management and query building.
- **Axios**: Efficient API communication.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Database (MySQL/PostgreSQL)

### Backend Setup
1. Navigate to the `BackEnd` directory.
2. Install dependencies: `npm install`
3. Configure your `.env` file with database credentials.
4. Run Prisma migrations: `npx prisma migrate dev`
5. Start the server: `node server.js`

### Frontend Setup
1. Navigate to the `FrontEnd` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## 🎯 Use Case
Ideal for fuel station owners who want to:
- Move from paper-based logs to a secure digital format.
- Quickly calculate daily sales and nozzle discrepancies.
- Monitor staff expenses and station maintenance costs.
- Provide easy digital payment QR codes to customers.
- Keep track of daily operational tasks.

---
Built with ❤️ for better business management.
<a href="https://dailystatements.netlify.app/" target="_blank">Visit my Website</a>


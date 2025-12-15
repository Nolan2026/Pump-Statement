import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Provider } from 'react-redux';
import store from './Store';

import { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

import Header from './Components/Header';
import Reading from './Components/Reading';
import Denomination from './Components/Denomination';
import Bills from './Components/Bills';
import Deduction from './Components/Deduction';
import Final from './Components/Final';
import Todo from './Pages/Todo';
import Report from './Pages/Report';
import Login from './Pages/Login';
import Expense from './Pages/Expense';

import ErrorBoundary from "./ErrorBoundary";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Provider store={store}>
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>

        {/* Header Section */}
        <div className="header-section">
          <p className='head'>Pump Reading Calculations</p>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun className="mode-icon" /> : <FaMoon className="mode-icon" />}
          </button>
        </div>

        {/* Routes Wrapper */}
        <BrowserRouter>
          {/* Navigation Header */}
          <Header />
          <Routes>

            {/* Main Page */}
            <Route
              path="/"
              element={
                <>
                  <Reading />

                  <div className="tables-container">
                    <Denomination />
                    <div className="right-components">
                      <Bills />
                      <Deduction />
                    </div>
                  </div>

                  <ErrorBoundary>
                    <Final />
                  </ErrorBoundary>
                </>
              }
            />

            {/* Other Pages */}
            <Route path="/todo" element={<Todo />} />
            <Route path="/report" element={<Report />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/login" element={<Login />} />

          </Routes>
        </BrowserRouter>

      </div>
    </Provider>
  );
}

export default App;

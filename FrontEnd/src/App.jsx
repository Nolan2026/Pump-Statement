
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
import { useLocation } from 'react-router-dom';
import QrCode from './Components/QrCode';

const ScrollRestoration = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Restore scroll position
    const savedPositions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
    if (savedPositions[pathname]) {
      window.scrollTo(0, savedPositions[pathname]);
    } else {
      window.scrollTo(0, 0);
    }

    // Save scroll position on scroll
    const handleScroll = () => {
      const currentPositions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
      currentPositions[pathname] = window.scrollY;
      sessionStorage.setItem('scrollPositions', JSON.stringify(currentPositions));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return null;
};

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
      <div className={`app-container  ${darkMode ? 'dark-mode' : ''}`} >

        {/* Routes Wrapper */}
        <BrowserRouter>
          <ScrollRestoration />
          {/* Navigation Header */}
          <Header darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode}/>
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
            <Route path="/payment" element={<QrCode />} />

          </Routes>
        </BrowserRouter>

      </div>
    </Provider>
  );
}

export default App;

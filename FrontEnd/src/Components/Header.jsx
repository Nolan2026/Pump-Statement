import React, { useEffect, useState } from 'react';
import '../Styles/Header.css';
import '../App.css';
import { NavLink } from 'react-router-dom';
import { FaMoon, FaSun, FaHome, FaClipboardList, FaFileAlt, FaSignInAlt, FaGasPump, FaMoneyBillWave, FaBars, FaTimes } from 'react-icons/fa';

function Header({ darkMode, setDarkMode, toggleDarkMode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="Head">
      <div className='logo'>
        <FaGasPump style={{ marginRight: '8px' }} />
        <h4>Pump Statement</h4>
      </div>

      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={`navigation ${isMenuOpen ? 'nav-active' : ''}`}>
        <div className="header-section nav-but" >
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun className="mode-icon" /> : <FaMoon className="mode-icon" />}
          </button>
        </div>

        <NavLink
          to="/"
          className={({ isActive }) => isActive ? 'nav-but active' : 'nav-but'}
          onClick={closeMenu}
        >
          <FaHome style={{ marginRight: '6px' }} />
          Home
        </NavLink>
        <NavLink
          to="/todo"
          className={({ isActive }) => isActive ? 'nav-but active' : 'nav-but'}
          onClick={closeMenu}
        >
          <FaClipboardList style={{ marginRight: '6px' }} />
          Todo
        </NavLink>
        <NavLink
          to="/report"
          className={({ isActive }) => isActive ? 'nav-but active' : 'nav-but'}
          onClick={closeMenu}
        >
          <FaFileAlt style={{ marginRight: '6px' }} />
          Report
        </NavLink>
        <NavLink
          to="/expense"
          className={({ isActive }) => isActive ? 'nav-but active' : 'nav-but'}
          onClick={closeMenu}
        >
          <FaMoneyBillWave style={{ marginRight: '6px' }} />
          Expense
        </NavLink>

        <NavLink
          to="/payment"
          className={({ isActive }) => isActive ? 'nav-but active' : 'nav-but'}
          onClick={closeMenu}
        >
          <FaSignInAlt style={{ marginRight: '6px' }} />
          Payment
        </NavLink>

        <NavLink
          to="/login"
          className={({ isActive }) => isActive ? 'nav-but active' : 'nav-but'}
          onClick={closeMenu}
        >
          <FaSignInAlt style={{ marginRight: '6px' }} />
          Login
        </NavLink>
      </div>
    </div>
  );
}

export default Header;
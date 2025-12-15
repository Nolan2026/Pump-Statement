import React from 'react';
import '../Styles/Header.css';
import { NavLink } from 'react-router-dom';
import { FaHome, FaClipboardList, FaFileAlt, FaSignInAlt, FaGasPump, FaMoneyBillWave } from 'react-icons/fa';

function Header() {
  return (
    <div className='Head'>
      <div className='logo'>
        <FaGasPump style={{ marginRight: '8px', fontSize: '24px' }} />
        <h4>Pump Statement</h4>
      </div>
      <div className='navigation'>
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? 'nav-but active' : 'nav-but'}
        >
          <FaHome style={{ marginRight: '6px' }} />
          Home
        </NavLink>
        <NavLink
          to="/todo"
          className={({ isActive }) => isActive ? 'nav-but active' : 'nav-but'}
        >
          <FaClipboardList style={{ marginRight: '6px' }} />
          Todo
        </NavLink>
        <NavLink
          to="/report"
          className={({ isActive }) => isActive ? 'nav-but active' : 'nav-but'}
        >
          <FaFileAlt style={{ marginRight: '6px' }} />
          Report
        </NavLink>
        <NavLink
          to="/expense"
          className={({ isActive }) => isActive ? 'nav-but active' : 'nav-but'}
        >
          <FaMoneyBillWave style={{ marginRight: '6px' }} />
          Expense
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) => isActive ? 'nav-but active' : 'nav-but'}
        >
          <FaSignInAlt style={{ marginRight: '6px' }} />
          Login
        </NavLink>
      </div>
    </div>
  );
}

export default Header;
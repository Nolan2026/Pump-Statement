import { useEffect, useState } from 'react';
import '../Styles/Deduction.css'
import { useDispatch, useSelector } from 'react-redux';
import { update } from '../Store';
import { PiCoinsFill } from "react-icons/pi";
import { FaMinusCircle, FaGasPump, FaMoneyBillAlt } from 'react-icons/fa';
import { MdRemove } from 'react-icons/md';

function Deduction() {
  const dispatch = useDispatch();
  const deductionData = useSelector((state) => state.billing);

  const [fuelDeduction, setFuelDeduction] = useState(() => {
    const savedFuelDeduction = localStorage.getItem('fuelDeduction');
    return savedFuelDeduction ? JSON.parse(savedFuelDeduction) : '';
  });

  const [dieselDeduction, setDieselDeduction] = useState(() => {
    const savedDieselDeduction = localStorage.getItem('dieselDeduction');
    return savedDieselDeduction ? JSON.parse(savedDieselDeduction) : '';
  });

  const [amountDeduction, setAmountDeduction] = useState(() => {
    const savedAmountDeduction = localStorage.getItem('amountDeduction');
    return savedAmountDeduction ? JSON.parse(savedAmountDeduction) : '';
  });

  const [coins, setCoins] = useState(() => {
    const savedCoins = localStorage.getItem('coins');
    return savedCoins ? JSON.parse(savedCoins) : '';
  });

  const [foodDeduction, setFoodDeduction] = useState(() => {
    const savedFoodDeduction = localStorage.getItem('foodDeduction');
    return savedFoodDeduction ? JSON.parse(savedFoodDeduction) : 100;
  });

  // Clear all handler: reset local state when global clearAllData is dispatched
  useEffect(() => {
    const handleClearAll = () => {
      setFuelDeduction('');
      setDieselDeduction('');
      setAmountDeduction('');
      setCoins('');
      setFoodDeduction(100);
    };

    window.addEventListener('clearAllData', handleClearAll);
    return () => window.removeEventListener('clearAllData', handleClearAll);
  }, []);

  useEffect(() => {
    localStorage.setItem('fuelDeduction', JSON.stringify(fuelDeduction));
  }, [fuelDeduction]);

  useEffect(() => {
    localStorage.setItem('dieselDeduction', JSON.stringify(dieselDeduction));
  }, [dieselDeduction]);

  useEffect(() => {
    localStorage.setItem('amountDeduction', JSON.stringify(amountDeduction));
  }, [amountDeduction]);

  useEffect(() => {
    localStorage.setItem('coins', JSON.stringify(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('foodDeduction', JSON.stringify(foodDeduction));
  }, [foodDeduction]);

  useEffect(() => {
    dispatch(update({
      fuelDeduction: Number(fuelDeduction) || 0,
      dieselDeduction: Number(dieselDeduction) || 0,
      amountDeduction: Number(amountDeduction) || 0,
      coins: Number(coins) || 0,
      foodDeduction: Number(foodDeduction) || 0,
    }));
  }, [fuelDeduction, dieselDeduction, amountDeduction, coins, foodDeduction, dispatch]);

  return (
    <div className="deduction-wrapper">
      <h2 className="deduction-title">
        <FaMinusCircle className="title-icon" /> Deductions
      </h2>
      <table className="deduction-table">
        <thead>
          <tr>
            <th>Deduction Type</th>
            <th><FaMoneyBillAlt className="table-icon" /> Amount/Liters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><FaGasPump className="deduction-icon" /> Extra Fuel Deduction (Petrol)</td>
            <td>
              <input 
                onChange={(e) => setFuelDeduction(e.target.value)} 
                type="number" 
                value={fuelDeduction}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </td>
          </tr>
          <tr>
            <td><FaGasPump className="deduction-icon" /> Extra Fuel Deduction (Diesel)</td>
            <td>
              <input 
                onChange={(e) => setDieselDeduction(e.target.value)} 
                type="number" 
                value={dieselDeduction}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </td>
          </tr>
          <tr>
            <td><MdRemove className="deduction-icon" /> Amount Deduction</td>
            <td>
              <input 
                onChange={(e) => setAmountDeduction(e.target.value)} 
                type="number" 
                value={amountDeduction}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </td>
          </tr>
          <tr>
            <td><MdRemove className="deduction-icon" /> Food Deduction</td>
            <td>
              <input 
                onChange={(e) => setFoodDeduction(e.target.value)} 
                type="number" 
                value={foodDeduction}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </td>
          </tr>
          <tr>
            <td><PiCoinsFill className="deduction-icon" />Change (Coins)</td>
            <td>
              <input 
                onChange={(e) => setCoins(e.target.value)} 
                type="number" 
                value={coins}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Deduction;
import React, { useState, useEffect } from 'react';
import { update } from '../Store';
import '../Styles/Denomination.css';
import { useDispatch, useSelector } from 'react-redux';
import { FaMoneyBillWave, FaCalculator } from 'react-icons/fa';
import { GiCash } from 'react-icons/gi';

function Denomination() {
  const dispatch = useDispatch();

  // Get latest values from Redux (after fetch)
  const FinalCash = useSelector((state) => state.billing);
  const denominations = [
    { id: 'five', label: 500 },
    { id: 'two', label: 200 },
    { id: 'one', label: 100 },
    { id: 'fifty', label: 50 },
    { id: 'twenty', label: 20 },
    { id: 'ten', label: 10 },
  ];

  const initialQuantities = {
    five: '',
    two: '',
    one: '',
    fifty: '',
    twenty: '',
    ten: '',
  };

  const [quantities, setQuantities] = useState(() => {
    const savedQuantities = localStorage.getItem('denominationQuantities');
    return savedQuantities ? JSON.parse(savedQuantities) : initialQuantities;
  });

  const [manualGrandTotal, setManualGrandTotal] = useState('');

  // Clear all handler: reset quantities and manual total on global clear
  useEffect(() => {
    const handleClearAll = () => {
      setQuantities(initialQuantities);
      setManualGrandTotal('');
    };

    window.addEventListener('clearAllData', handleClearAll);
    return () => window.removeEventListener('clearAllData', handleClearAll);
  }, []);

  // Calculate the grand total from denominations
  const grandTotal = denominations.reduce(
    (sum, { id, label }) => sum + ((quantities[id] ? Number(quantities[id]) : 0) * label),
    0
  );

  // Use manual grand total if set, otherwise use calculated grand total
  const effectiveGrandTotal = (manualGrandTotal !== '' ? Number(manualGrandTotal) : grandTotal) || FinalCash.cash;

  // Update redux cash state on total change
  useEffect(() => {
    dispatch(
      update({
        cash: effectiveGrandTotal,
        denominations: {
          five: Number(quantities.five) || 0,
          two: Number(quantities.two) || 0,
          one: Number(quantities.one) || 0,
          fifty: Number(quantities.fifty) || 0,
          twenty: Number(quantities.twenty) || 0,
          ten: Number(quantities.ten) || 0,
        },
      })
    );
  }, [effectiveGrandTotal, quantities, dispatch]);


  // Handle quantity change: clear manualGrandTotal immediately
  const handleChange = (id, value) => {
    if (manualGrandTotal !== '') {
      setManualGrandTotal('');
    }
    const qty = value === '' ? '' : Number(value);
    setQuantities((prev) => ({
      ...prev,
      [id]: qty,
    }));
  };

  // Handle manual grand total change: reset quantities immediately
  const handleManualGrandTotalChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      if (value !== '' && Object.values(quantities).some(q => q !== '' && q !== 0)) {
        setQuantities(initialQuantities);
      }
      setManualGrandTotal(value);
    }
  };

  // Save quantities to localStorage only if manual grand total is empty
  useEffect(() => {
    if (manualGrandTotal === '') {
      localStorage.setItem('denominationQuantities', JSON.stringify(quantities));
    }
  }, [quantities, manualGrandTotal]);

  const getTotalFor = (id, denomination) => {
    return (quantities[id] ? Number(quantities[id]) : 0) * denomination;
  };

  return (
    <div className="denomination-wrapper">
      <h2 className="denomination-title">
        <GiCash className="title-icon" /> Denomination Calculator
      </h2>
      <table className="denomination-table">
        <thead>
          <tr>
            <th><FaMoneyBillWave className="table-icon" /> Denomination</th>
            <th>Quantity</th>
            <th><FaCalculator className="table-icon" /> Total</th>
          </tr>
        </thead>
        <tbody>
          {denominations.map(({ id, label }) => (
            <tr key={id}>
              <td>{label}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={quantities[id] !== '' ? quantities[id] : (FinalCash?.denominations?.[id] || '')}
                  placeholder="0"
                  onChange={(e) => handleChange(id, e.target.value, FinalCash.denominations[id])}
                />
              </td>
              <td>{getTotalFor(id, label)}</td>
            </tr>
          ))}
          <tr className="denomination-total-row">
            <td colSpan="2"><strong>Grand Total</strong></td>
            <td>
              <input
                type="number"
                min="0"
                value={manualGrandTotal || grandTotal}
                placeholder="0"
                onChange={handleManualGrandTotalChange}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Denomination;

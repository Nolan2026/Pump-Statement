import { useEffect, useState } from 'react';
import '../Styles/Bills.css';
import { useDispatch, useSelector } from 'react-redux';
import { update } from '../Store';
import { FaReceipt, FaMoneyBillAlt, FaGasPump, FaPlus } from 'react-icons/fa';
import { IoArrowRedoSharp, IoArrowUndoSharp } from "react-icons/io5";
import { MdPayment } from 'react-icons/md';
import { RiOilFill } from "react-icons/ri";

function Bills() {
  const dispatch = useDispatch();
  const billTotal = useSelector((state) => state.billing);

  const [pay, setPay] = useState(() => {
    const savedPay = localStorage.getItem('billsPay');
    return savedPay ? JSON.parse(savedPay) : '';
  });

  const [liters, setLiters] = useState(() => {
    const savedLiters = localStorage.getItem('billsLiters');
    return savedLiters ? JSON.parse(savedLiters) : '';
  });

  const [diesel, setDiesel] = useState(() => {
    const savedDiesel = localStorage.getItem('billsDiesel');
    return savedDiesel ? JSON.parse(savedDiesel) : '';
  });

  const [online, setOnline] = useState(() => {
    const savedOnline = localStorage.getItem('billsOnline');
    return savedOnline ? JSON.parse(savedOnline) : '';
  });

  const [upi, setUpi] = useState(() => {
    const savedUpi = localStorage.getItem('billsUpi');
    return savedUpi ? JSON.parse(savedUpi) : '';
  });

  const [oil, setOil] = useState(() => {
    const savedOil = localStorage.getItem('billsOil');
    return savedOil ? JSON.parse(savedOil) : '';
  });

  const [others, setOthers] = useState(() => {
    const savedOthers = localStorage.getItem('billsOthers');
    return savedOthers ? JSON.parse(savedOthers) : '';
  });

  const [additionalAmount, setAdditionalAmount] = useState(() => {
    const savedAdditional = localStorage.getItem('billsAdditional');
    return savedAdditional ? JSON.parse(savedAdditional) : '';
  });

  // Clear all handler: reset local state when global clearAllData is dispatched
  useEffect(() => {
    const handleClearAll = () => {
      setPay('');
      setLiters('');
      setDiesel('');
      setOnline('');
      setUpi('');
      setOil('');
      setOthers('');
      setAdditionalAmount('');
    };

    window.addEventListener('clearAllData', handleClearAll);
    return () => window.removeEventListener('clearAllData', handleClearAll);
  }, []);

  // Persist to localStorage on state changes
  useEffect(() => {
    localStorage.setItem('billsPay', JSON.stringify(pay));
  }, [pay]);

  useEffect(() => {
    localStorage.setItem('billsLiters', JSON.stringify(liters));
  }, [liters]);

  useEffect(() => {
    localStorage.setItem('billsDiesel', JSON.stringify(diesel));
  }, [diesel]);

  useEffect(() => {
    localStorage.setItem('billsOnline', JSON.stringify(online));
  }, [online]);

  useEffect(() => {
    localStorage.setItem('billsUpi', JSON.stringify(upi));
  }, [upi]);

  useEffect(() => {
    localStorage.setItem('billsOil', JSON.stringify(oil));
  }, [oil]);

  useEffect(() => {
    localStorage.setItem('billsOthers', JSON.stringify(others));
  }, [others]);

  useEffect(() => {
    localStorage.setItem('billsAdditional', JSON.stringify(additionalAmount));
  }, [additionalAmount]);

  // Calculate total: pay + petrol liters * price + diesel + oil + others
  const numericPay = Number(pay) || 0;
  const numericLiters = Number(liters) || 0;
  const numericDiesel = Number(diesel) || 0;
  const numericOnline = Number(online) || 0;
  const numericUpi = Number(upi) || 0;
  const numericOil = Number(oil) || 0;
  const numericOthers = Number(others) || 0;
  const numericAdditionalAmount = Number(additionalAmount) || 0;

  // Total of all bills including pay
  const BillSum = numericPay
    + numericLiters * (billTotal.price || 0)
    + numericDiesel * (billTotal.dieselPrice || 97.6)
    + numericOthers;

  // Total excluding pay (for calculation purposes)
  const BillSumExcludingPay = numericLiters * (billTotal.price || 0)
    + numericDiesel * (billTotal.dieselPrice || 97.6)
    + numericOthers;

  // Amount to subtract (oil amount)
  const billOilAmount = numericOil * 175;

  // Petrol and Diesel bill amounts
  const billPetrolAmount = numericLiters * (billTotal.price || 0);
  const billDieselAmount = numericDiesel * (billTotal.dieselPrice || 97.6);

  // Dispatch updated billing info
  useEffect(() => {
    dispatch(
      update({
        paybills: BillSum,
        bills: BillSum,
        oilnum: numericOil,
        pay: pay,
        petrollts: numericLiters,
        diesellts: numericDiesel,
        others: others,
        billsExcludingPay: BillSumExcludingPay,
        billOilAmount: billOilAmount,
        billPetrolAmount: billPetrolAmount,
        billDieselAmount: billDieselAmount,
        online: Number(online) || 0,
        upi: Number(upi) || 0,
        additionalAmount: numericAdditionalAmount,
      })
    );
  }, [BillSum, BillSumExcludingPay, billOilAmount, billPetrolAmount, billDieselAmount, online, upi, numericAdditionalAmount, dispatch]);

  return (
    <div className="bills-wrapper">
      <h2 className="bills-title">
        <FaReceipt className="title-icon" /> Bills Amount
      </h2>
      <table className="bills-table">
        <thead>
          <tr>
            <th>Bill Type</th>
            <th>
              <FaMoneyBillAlt className="table-icon" /> Amount
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <MdPayment className="bill-icon" /> Pay
            </td>
            <td>
              <input
                onChange={(e) => setPay(e.target.value)}
                type="number"
                value={pay}
                placeholder="0"
                min="0"
              />
            </td>
          </tr>
          <tr>
            <td>
              <FaGasPump className="bill-icon" /> Petrol Liters
            </td>
            <td>
              <input
                onChange={(e) => setLiters(e.target.value)}
                type="number"
                value={liters}
                placeholder="0"
                min="0"
              />
            </td>
          </tr>
          <tr>
            <td>
              <FaGasPump className="bill-icon" /> Diesel Liters
            </td>
            <td>
              <input
                onChange={(e) => setDiesel(e.target.value)}
                type="number"
                value={diesel}
                placeholder="0"
                min="0"
              />
            </td>
          </tr>
          <tr>
            <td>
              <IoArrowUndoSharp className="bill-icon" /> Yesterday's UPI
            </td>
            <td>
              <input
                onChange={(e) => setOnline(e.target.value)}
                type="number"
                value={online}
                placeholder="0"
                min="0"
              />
            </td>
          </tr>
          <tr>
            <td>
              <IoArrowRedoSharp className="bill-icon" /> Today's UPI
            </td>
            <td>
              <input
                onChange={(e) => setUpi(e.target.value)}
                type="number"
                value={upi}
                placeholder="0"
                min="0"
              />
            </td>
          </tr>
          <tr>
            <td>
              <RiOilFill className="bill-icon" /> Oil
            </td>
            <td>
              <input
                onChange={(e) => setOil(e.target.value)}
                type="number"
                value={oil}
                placeholder="0"
                min="0"
              />
            </td>
          </tr>
          <tr>
            <td>
              <FaPlus className="bill-icon" /> Others
            </td>
            <td>
              <input
                onChange={(e) => setOthers(e.target.value)}
                type="number"
                value={others}
                placeholder="0"
                min="0"
              />
            </td>
          </tr>
          <tr>
            <td>
              <FaPlus className="bill-icon" /> Additional Amount
            </td>
            <td>
              <input
                onChange={(e) => setAdditionalAmount(e.target.value)}
                type="number"
                value={additionalAmount}
                placeholder="0"
                min="0"
              />
            </td>
          </tr>
          <tr className="bills-total-row">
            <td>
              <strong>Total</strong>
            </td>
            <td>
              <strong>{BillSum.toFixed(2)}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Bills;

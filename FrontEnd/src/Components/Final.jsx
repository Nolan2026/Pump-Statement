import { useDispatch, useSelector } from 'react-redux';
import '../Styles/Final.css';
// import '../Styles/Print.css';
import axios from "axios";
import { useEffect, useState, useRef } from 'react';
import { update } from '../Store';
import { FaPrint, FaFileInvoiceDollar, FaRegSave, FaCalendarAlt, FaUser, FaGasPump, FaMoneyBillWave, FaWifi, FaReceipt, FaCalculator, FaMinusCircle, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { MdLocalGasStation, MdOutlinePassword, MdRemove } from 'react-icons/md';
import { AiOutlineDatabase } from "react-icons/ai";
import { GiCash } from 'react-icons/gi';
import { FaPlus } from "react-icons/fa6";
import html2canvas from "html2canvas";
import { useEffectEvent } from 'react';
// import { newEntry } from '../../../BackEnd/controler';


function Final() {
  const tableRef = useRef(null);

  const [lts, setLts] = useState(() => {
    const savedPrice = localStorage.getItem('fuelPrice');
    return savedPrice ? JSON.parse(savedPrice) : 109.79;
  });

  const [deduct, setDeduct] = useState(() => {
    const savedDeduct = localStorage.getItem('Deduction');
    return savedDeduct ? JSON.parse(savedDeduct) : true;
  });

  const toggle5 = () => {
    setDeduct(prev => !prev);
  };

  const [dieselPrice, setDieselPrice] = useState(() => {
    const savedDieselPrice = localStorage.getItem('dieselPrice');
    return savedDieselPrice ? JSON.parse(savedDieselPrice) : 97.6;
  });

  const [powerPrice, setPowerPrice] = useState(() => {
    const savedPowerPrice = localStorage.getItem('powerPrice');
    return savedPowerPrice ? JSON.parse(savedPowerPrice) : 117.79;
  });

  const [currentDate, setCurrentDate] = useState(() => {
    const savedDate = localStorage.getItem('billDate');
    return savedDate || new Date().toISOString();
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('billUser');
    return savedUser || 'Admin';
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [fetchData, setFetchData] = useState(false);
  const [tempDate, setTempDate] = useState(currentDate);
  const [tempUser, setTempUser] = useState(currentUser);

  const dispatch = useDispatch();

  const Records = useSelector((state) => state.billing);

  console.log(Records);

  useEffect(() => {
    localStorage.setItem('fuelPrice', JSON.stringify(lts));
  }, [lts]);

  useEffect(() => {
    localStorage.setItem('dieselPrice', JSON.stringify(dieselPrice));
  }, [dieselPrice]);

  useEffect(() => {
    localStorage.setItem('powerPrice', JSON.stringify(powerPrice));
  }, [powerPrice]);

  useEffect(() => {
    localStorage.setItem('billDate', currentDate);
  }, [currentDate]);

  useEffect(() => {
    localStorage.setItem('billUser', currentUser);
  }, [currentUser]);

  useEffect(() => {
    dispatch(update({
      price: lts,
      dieselPrice: dieselPrice,
      powerPrice: powerPrice
    }));
  }, [lts, dieselPrice, powerPrice, dispatch]);

  // Calculate raw liters for each pump
  const A1_Raw = Records.Aa1 - Records.Ba1;
  const A2_Raw = Records.Aa2 - Records.Ba2;
  const B1_Raw = Records.Ab1 - Records.Bb1;
  const B2_Raw = Records.Ab2 - Records.Bb2;

  // Check if pump has reading
  const A1_HasReading = A1_Raw > 0;
  const A2_HasReading = A2_Raw > 0;
  const B1_HasReading = B1_Raw > 0;
  const B2_HasReading = B2_Raw > 0;

  // Calculate liters after 5L deduction per pump (only if reading exists)
  const A1_Lts = A1_HasReading ? A1_Raw : 0;
  const A2_Lts = A2_HasReading ? A2_Raw : 0;
  const B1_Lts = B1_HasReading ? B1_Raw : 0;
  const B2_Lts = B2_HasReading ? B2_Raw : 0;

  const A_Lts = A1_Lts + A2_Lts;
  const B_Lts = B1_Lts + B2_Lts;
  const Total_Lts = A_Lts + B_Lts;

  // Calculate amounts based on fuel type
  const A1_Amount = A1_Lts * Records.price;
  const A2_Amount = A2_Lts * (Records.isA2Power ? Records.powerPrice : Records.price);
  const B1_Amount = B1_Lts * (Records.isB1Diesel ? Records.dieselPrice : Records.price);
  const B2_Amount = B2_Lts * (Records.isB2Diesel ? Records.dieselPrice : Records.price);

  const A_Amount = A1_Amount + A2_Amount;
  const B_Amount = B1_Amount + B2_Amount;

  // Calculate deductions for each pump (5L per pump if reading exists)
  const A1_Deduction = A1_HasReading ? 5 * Records.price : 0;
  const A2_Deduction = A2_HasReading ? 5 * (Records.isA2Power ? Records.powerPrice : Records.price) : 0;
  const B1_Deduction = B1_HasReading ? 5 * (Records.isB1Diesel ? Records.dieselPrice : Records.price) : 0;
  const B2_Deduction = B2_HasReading ? 5 * (Records.isB2Diesel ? Records.dieselPrice : Records.price) : 0;

  // Calculate total deductions by fuel type
  const petrolDeductionLiters =
    (A1_HasReading ? 5 : 0) +
    (A2_HasReading && !Records.isA2Power ? 5 : 0) +
    (B1_HasReading && !Records.isB1Diesel ? 5 : 0) +
    (B2_HasReading && !Records.isB2Diesel ? 5 : 0);

  const powerDeductionLiters =
    (A2_HasReading && Records.isA2Power ? 5 : 0);

  const dieselDeductionLiters =
    (B1_HasReading && Records.isB1Diesel ? 5 : 0) +
    (B2_HasReading && Records.isB2Diesel ? 5 : 0);

  const petrolDeductionAmount =
    A1_Deduction +
    A2_Deduction +
    (B1_HasReading && !Records.isB1Diesel ? B1_Deduction : 0) +
    (B2_HasReading && !Records.isB2Diesel ? B2_Deduction : 0);

  const powerDeductionAmount =
    (A2_HasReading && Records.isA2Power ? 5 * Records.powerPrice : 0);

  const dieselDeductionAmount =
    (B1_HasReading && Records.isB1Diesel ? B1_Deduction : 0) +
    (B2_HasReading && Records.isB2Diesel ? B2_Deduction : 0);

  const totalDeductionAmount = petrolDeductionAmount + dieselDeductionAmount;
  const totalDeductionLiters = petrolDeductionLiters + dieselDeductionLiters;

  // Calculate total before deductions
  const totalBeforeDeductions = (A_Amount + B_Amount);

  // Calculate extra fuel deduction amounts from Deduction component
  const extraFuelDeductionAmount = Records.fuelDeduction * Records.price;
  const extraDieselDeductionAmount = (Records.dieselDeduction || 0) * Records.dieselPrice;

  // Calculate total liters after extra deductions
  const totalLitersAfterExtraDeductions = Total_Lts - Records.fuelDeduction - (Records.dieselDeduction || 0);

  // Calculate total sale amount after all deductions, then add oil amount
  const totalSaleBeforeOil = totalBeforeDeductions - extraFuelDeductionAmount - extraDieselDeductionAmount;
  const billOilAmount = Records.billOilAmount || 0;

  const [totalSale, setTotalSale] = useState(() => {
    const saved = localStorage.getItem("Totalsale");
    return saved ? Number(saved) : 0;
  });
  const [totalSaleLiters, setTotalSaleLiters] = useState(() => {
    const saved = localStorage.getItem("Totalsalelts");
    return saved ? Number(saved) : 0;
  });

  // Update totals whenever dependencies change
  useEffect(() => {
    if (deduct) {
      setTotalSale(totalSaleBeforeOil + billOilAmount - totalDeductionAmount);
      setTotalSaleLiters(totalLitersAfterExtraDeductions - totalDeductionLiters);
    } else {
      setTotalSale(totalSaleBeforeOil + billOilAmount);
      setTotalSaleLiters(totalLitersAfterExtraDeductions);
    }
  }, [deduct, totalSaleBeforeOil, billOilAmount, totalDeductionAmount, totalLitersAfterExtraDeductions, totalDeductionLiters]);

  // Save to localStorage whenever totals change
  useEffect(() => {
    localStorage.setItem("Totalsale", totalSale);
    localStorage.setItem("Totalsalelts", totalSaleLiters);
  }, [totalSale, totalSaleLiters]);


  // Calculate subtotal (Cash + Online + Bills)
  const subTotal = Records.cash + Records.online + Records.paybills + Records.upi;

  // Sub Difference: Cash Amount - Sale Amount (REVERSED LOGIC - Cash is Priority)
  // Positive (+) = Extra cash (Cash > Sale collected) - GOOD (Green)
  // Negative (-) = Short on cash (Cash < Sale collected) - BAD (Red)
  const subDifferenceRaw = subTotal - totalSale;
  const isSubDifferenceNegative = subDifferenceRaw < 0;


  // Total deductions from cash
  const totalDeductions =
    Number(Records.amountDeduction || 0) +
    Number(Records.coins || 0) +
    Number(Records.foodDeduction || 0);

  // Final Difference: Apply deductions based on sub difference
  // Logic:
  // - If SHORT on cash (negative): ADD deductions back (they explain part of the shortage)
  // - If EXTRA cash (positive): SUBTRACT deductions (they reduce the surplus)
  let difference;

  if (subDifferenceRaw < 0) {
    // Short on cash: Add deductions back to reduce the negative impact
    difference = subDifferenceRaw + totalDeductions;
  } else {
    // Extra cash: Subtract deductions to get net surplus
    difference = subDifferenceRaw + totalDeductions;
  }

  // Determine difference row class based on final difference
  const getDifferenceRowClass = () => {
    if (difference > 0) {
      return 'difference-row positive'; // Positive difference = Extra cash (Good - Green)
    } else if (difference < 0) {
      return 'difference-row negative'; // Negative difference = Short on cash (Bad - Red)
    } else {
      return 'difference-row neutral'; // Zero difference = Balanced (Neutral)
    }
  };

  const handlePrint = () => {
    window.print();
  }

  const handleDownloadImage = async () => {
    try {
      const element = tableRef.current;
      if (!element) return;

      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `receipt-${Records.date || new Date().toLocaleDateString('en-GB')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image');
    }
  }

  const handleClearAll = () => {
    // Clear all localStorage except price, date, and user
    localStorage.removeItem('pumpReadings');
    localStorage.removeItem('denominationQuantities');
    localStorage.removeItem('billsPay');
    localStorage.removeItem('billsLiters');
    localStorage.removeItem('billsDiesel');
    localStorage.removeItem('billsOnline');
    localStorage.removeItem('billsUpi');
    localStorage.removeItem('billsOil');
    localStorage.removeItem('billsOthers');
    localStorage.removeItem('fuelDeduction');
    localStorage.removeItem('dieselDeduction');
    localStorage.removeItem('amountDeduction');
    localStorage.removeItem('coins');
    localStorage.removeItem('foodDeduction');
    localStorage.removeItem('isB1Diesel');
    localStorage.removeItem('isB2Diesel');
    localStorage.removeItem('isA2Power');
    localStorage.removeItem('billingState'); // Clear Redux persisted state
    localStorage.removeItem('Totalsale'); // Clear total sale
    localStorage.removeItem('Totalsalelts'); // Clear total sale liters

    // Reset Redux state to initial values immediately
    dispatch(update({
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
      upi: 0,
      bills: 0,
      pay: 0,
      petrollts: 0,
      diesellts: 0,
      oilnum: 0,
      others: 0,
      billsExcludingPay: 0,
      billOilAmount: 0,
      billPetrolAmount: 0,
      billDieselAmount: 0,
      fuelDeduction: 0,
      dieselDeduction: 0,
      amountDeduction: 0,
      coins: 0,
      foodDeduction: 0,
      isB1Diesel: false,
      isB2Diesel: false,
      isA2Power: false,
      price: lts, // Keep the current price
      dieselPrice: dieselPrice,
      powerPrice: powerPrice,
      denominations: {
        five: 0,
        two: 0,
        one: 0,
        fifty: 0,
        twenty: 0,
        ten: 0,
      }
    }));

    // Trigger a custom event to notify other components to reset
    window.dispatchEvent(new CustomEvent('clearAllData'));
  };

  // Convert date from input field back to display format (DD/MM/YYYY)
  const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [fetchNote, setFetchNote] = useState([]);
  const [credtial, setCredtial] = useState([]);
  const today = new Date();
  today.setDate(today.getDate() - 1);
  const yesterday = today.toISOString().split("T")[0];

  // --- Backend integration (fetch/save) ---
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        date: currentDate,
        sa1: Number(Records.Ba1),
        sa2: Number(Records.Ba2),
        sb1: Number(Records.Bb1),
        sb2: Number(Records.Bb2),
        ea1: Number(Records.Aa1),
        ea2: Number(Records.Aa2),
        eb1: Number(Records.Ab1),
        eb2: Number(Records.Ab2),

        five: Number(Records.denominations?.five) || 0,
        two: Number(Records.denominations?.two) || 0,
        one: Number(Records.denominations?.one) || 0,
        fifthy: Number(Records.denominations?.fifty) || 0,
        twenty: Number(Records.denominations?.twenty) || 0,
        ten: Number(Records.denominations?.ten) || 0,

        pay: Number(Records.pay || 0),
        petrollts: Number(Records.petrollts || 0),
        diesellts: Number(Records.diesellts || 0),
        upi1: Number(Records.online || 0),
        upi2: Number(Records.upi || 0),
        cash: Number(Records.cash || 0),
        bills: Number(Records.bills || 0),
        oil: Number(Records.oilnum || 0),
        other: Number(Records.others || 0),

        extrapetrol: Number(Records.fuelDeduction || 0),
        extradiesel: Number(Records.dieselDeduction || 0),
        amount: Number(Records.amountDeduction || 0),
        food: Number(Records.foodDeduction || 0),
        change: Number(Records.coins || 0)
      };

      await axios.post("http://localhost:9000/newEntry", payload);
      setMessage("Saved successfully");

    } catch (err) {
      console.error("Save error:", err);
      setMessage(err.response?.data?.message || "Save failed!");
    }
  };


  // Fetch data from DB
  const fetching = async () => {
    setFetchNote("");
    try {
      const res = await fetch(`http://localhost:9000/fetchData?date=${tempDate}`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const result = await res.json();
      setData(result);
      console.log(result)
      setMessage("Fetched successfully");
      setFetchNote("Data Fetched Successfully");
      return result;

    } catch (error) {
      setMessage("Error while fetching");
      setFetchNote("Error while fetching");
      return null;
    }
  };



  const handleFetch = async (e) => {
    e.preventDefault();

    if (credtial === "Nolan2026") {
      const result = await fetching(); // result is now valid

      if (result && result.data && result.data.length > 0) {
        dispatch(update({
          Ba1: Number(result.data[0].sa1),
          Ba2: Number(result.data[0].sa2),
          Bb1: Number(result.data[0].sb1),
          Bb2: Number(result.data[0].sb2),

          Aa1: Number(result.data[0].ea1),
          Aa2: Number(result.data[0].ea2),
          Ab1: Number(result.data[0].eb1),
          Ab2: Number(result.data[0].eb2),


          pay: Number(result.data[0].pay),
          upi: Number(result.data[0].upi2),
          online: Number(result.data[0].upi1),
          cash: Number(result.data[0].cash),
          bills: Number(result.data[0].bills),

          petrollts: Number(result.data[0].petrollts),
          diesellts: Number(result.data[0].diesellts),
          other: Number(result.data[0].others),
          coins: Number(result.data[0].change),
          foodDeduction: Number(result.data[0].food),

          fuelDeduction: Number(result.data[0].extrapetrol),
          dieselDeduction: Number(result.data[0].extradiesel),

          isB1Diesel: result.data[0].isB1Diesel,
          isB2Diesel: result.data[0].isB2Diesel,
          isA2Power: result.data[0].isA2Power,

          // ✅ FIXED — Proper nested structure
          denominations: {
            five: Number(result.data[0].five),
            two: Number(result.data[0].two),
            one: Number(result.data[0].one),
            fifty: Number(result.data[0].fifthy),
            twenty: Number(result.data[0].twenty),
            ten: Number(result.data[0].ten),
          },

        }));

      }
    } else {
      setFetchNote("Error: Invalid Password");
    }
  };



  useEffect(() => {
    if (message) {
      // setShowEditModal(true);
      const timer = setTimeout(() => {
        setShowEditModal(false);
        setMessage("");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleEditSave = () => {
    setCurrentDate(tempDate);
    setCurrentUser(tempUser);
    setShowEditModal(false);
    // setFetchData(false);
  };

  const handleEditCancel = () => {
    setTempDate(currentDate);
    setTempUser(currentUser);
    setCredtial("");
    setShowEditModal(false);
    setFetchData(false);
  };

  return (
    <div className="final-container">
      <div className="final-header">
        <div className="header-first-line">
          <div className="date">
            <FaCalendarAlt className="header-icon" /> Date:
            <label>
              <input type="date"
                className="form-date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
              />
            </label>
          </div>
          <div className="user">
            <FaUser className="header-icon" /> User: {currentUser}
          </div>
          <div className="test-toggle-container">
            <span className={`bluetooth-status ${deduct ? 'active' : 'inactive'}`}>
              {deduct ? "Testing 5Lts" : "No Testing"}
            </span>
            <button className={`bluetooth-toggle ${deduct ? 'on' : 'off'}`} onClick={toggle5}>
              <span className="toggle-slider"></span>
            </button>
          </div>
        </div>
        <div className="header-second-line">
          <div className="price-input-container">
            <label htmlFor="price-input" className="price-label">
              <FaMoneyBillWave className="price-icon" />
              Petrol Price/L
            </label>
            <input
              id="price-input"
              className="price-input"
              onChange={(e) => setLts(parseFloat(e.target.value) || 0)}
              type="number"
              value={lts}
              placeholder='0'
              step="0.01"
              min="0"
            />
          </div>
          <div className="price-input-container">
            <label htmlFor="diesel-price-input" className="price-label">
              <FaMoneyBillWave className="price-icon" />
              Diesel Price/L
            </label>
            <input
              id="diesel-price-input"
              className="price-input"
              onChange={(e) => setDieselPrice(parseFloat(e.target.value) || 0)}
              type="number"
              value={dieselPrice}
              placeholder='0'
              step="0.01"
              min="0"
            />
          </div>
          <div className="price-input-container">
            <label htmlFor="power-price-input" className="price-label">
              <FaMoneyBillWave className="price-icon" />
              Power Price/L
            </label>
            <input
              id="power-price-input"
              className="price-input"
              onChange={(e) => setPowerPrice(parseFloat(e.target.value) || 0)}
              type="number"
              value={powerPrice}
              placeholder='0'
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="final-wrapper">
        <h2 className="final-title">
          <FaFileInvoiceDollar className="title-icon" /> Daily Settlement Report
        </h2>
        <div className="table-container">
          <table className="final-table">
            <thead>
              <tr>
                <th>Particular</th>
                <th><FaGasPump className="table-icon" /> Liters</th>
                <th><FaMoneyBillWave className="table-icon" /> Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className='reading-data'>
                <td><MdLocalGasStation className="row-icon" /> A1</td>
                <td>{A1_Lts.toFixed(2)}</td>
                <td>{A1_Amount.toFixed(2)}</td>
              </tr>
              <tr className='reading-data'>
                <td><MdLocalGasStation className="row-icon" /> A2 {Records.isA2Power && '(Power)'}</td>
                <td>{A2_Lts.toFixed(2)}</td>
                <td>{A2_Amount.toFixed(2)}</td>
              </tr>
              <tr className='reading-data'>
                <td><MdLocalGasStation className="row-icon" /> B1 {Records.isB1Diesel && '(Diesel)'}</td>
                <td>{B1_Lts.toFixed(2)}</td>
                <td>{B1_Amount.toFixed(2)}</td>
              </tr>
              <tr className='reading-data'>
                <td><MdLocalGasStation className="row-icon" /> B2 {Records.isB2Diesel && '(Diesel)'}</td>
                <td>{B2_Lts.toFixed(2)}</td>
                <td>{B2_Amount.toFixed(2)}</td>
              </tr>

              {deduct && (
                <>
                  {petrolDeductionLiters > 0 && (
                    <tr className="highlight-row less-petrol">
                      <td>Less: Petrol Deduction</td>
                      <td>{petrolDeductionLiters.toFixed(2)}</td>
                      <td>-{petrolDeductionAmount.toFixed(2)}</td>
                    </tr>
                  )}
                  {powerDeductionLiters > 0 && (
                    <tr className="highlight-row less-petrol">
                      <td>Less: Power Deduction</td>
                      <td>{powerDeductionLiters.toFixed(2)}</td>
                      <td>-{powerDeductionAmount.toFixed(2)}</td>
                    </tr>
                  )}
                  {dieselDeductionLiters > 0 && (
                    <tr className="highlight-row less-diesel">
                      <td>Less: Diesel Deduction</td>
                      <td>{dieselDeductionLiters.toFixed(2)}</td>
                      <td>-{dieselDeductionAmount.toFixed(2)}</td>
                    </tr>
                  )}
                  {Records.fuelDeduction > 0 && (
                    <tr className="highlight-row less-petrol">
                      <td><FaMinusCircle className="row-icon" /> Less: Extra Fuel Deduction (Petrol)</td>
                      <td>{Records.fuelDeduction.toFixed(2)}</td>
                      <td>-{extraFuelDeductionAmount.toFixed(2)}</td>
                    </tr>
                  )}
                  {Records.dieselDeduction > 0 && (
                    <tr className="highlight-row less-diesel">
                      <td><FaMinusCircle className="row-icon" /> Less: Extra Fuel Deduction (Diesel)</td>
                      <td>{dieselDeduction.toFixed(2)}</td>
                      <td>-{extraDieselDeductionAmount.toFixed(2)}</td>
                    </tr>
                  )}
                </>
              )}

              {billOilAmount > 0 && (
                <tr className="highlight-row add-oil">
                  <td><FaPlus className="row-icon" /> Add: Oil Amount</td>
                  <td>{Records.oilnum}</td>
                  <td>+{billOilAmount.toFixed(2)}</td>
                </tr>
              )}
              <tr className="highlight-row total-sale">
                <td><strong><FaCalculator className="row-icon" /> Sale Amount</strong></td>
                <td><strong>{totalSaleLiters.toFixed(2)}</strong></td>
                <td><strong>{totalSale.toFixed(2)}</strong></td>
              </tr>
              <tr className='reading-data'>
                <td><GiCash className="row-icon" /> Cash</td>
                <td>-</td>
                <td>{Records.cash.toFixed(2)}</td>
              </tr>
              <tr className='reading-data'>
                <td><FaWifi className="row-icon" /> Online</td>
                <td>-</td>
                <td>{(Records.online + Records.upi).toFixed(2)}</td>
              </tr>
              <tr className='reading-data'>
                <td><FaReceipt className="row-icon" /> Bills</td>
                <td>-</td>
                <td>{Records.paybills.toFixed(2)}</td>
              </tr>
              <tr className="highlight-row sub-total">
                <td><strong><FaCalculator className="row-icon" /> Cash Amount</strong></td>
                <td>-</td>
                <td><strong>{subTotal.toFixed(2)}</strong></td>
              </tr>
              <tr className={`highlight-row sub-difference ${isSubDifferenceNegative ? 'negative' : 'positive'}`}>
                <td><strong><FaCalculator className="row-icon" /> Sub Difference (Cash - Sale)</strong></td>
                <td>-</td>
                <td><strong>{isSubDifferenceNegative ? '-' : '+'}{Math.abs(subDifferenceRaw).toFixed(2)}</strong></td>
              </tr>
              {Records.amountDeduction > 0 && (
                <tr className="highlight-row less">
                  <td><MdRemove className="row-icon" /> Less: Amount Deduction</td>
                  <td>-</td>
                  <td>-{Records.amountDeduction.toFixed(0)}</td>
                </tr>
              )}
              {Records.coins > 0 && (
                <tr className="highlight-row less">
                  <td><MdRemove className="row-icon" /> Less: Change (Coins)</td>
                  <td>-</td>
                  <td>-{Records.coins.toFixed(0)}</td>
                </tr>
              )}
              {Records.foodDeduction > 0 && (
                <tr className="highlight-row less">
                  <td><MdRemove className="row-icon" /> Less: Food Deduction</td>
                  <td>-</td>
                  <td>-{Records.foodDeduction.toFixed(0)}</td>
                </tr>
              )}
              <tr className={getDifferenceRowClass()}>
                <td><strong><FaCalculator className="row-icon" /> Difference</strong></td>
                <td>-</td>
                <td><strong>{Math.abs(difference).toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="action-buttons">
          <button type='button' className="action-btn edit-btn" onClick={() => setShowEditModal(true)}>
            <FaEdit className="btn-icon" /> Edit Details
          </button>
          <button type='button' className="action-btn clear-btn" onClick={handleClearAll}>
            <FaTrash className="btn-icon" /> Clear All
          </button>
          <button type='button' className="action-btn print-btn" onClick={handlePrint}>
            <FaPrint className="btn-icon" /> Print
          </button>
          <button type='button' className="action-btn save-btn" onClick={handleSave}>
            <FaRegSave className="btn-icon" /> Save
          </button>
          <button type='button' className="action-btn save-btn" onClick={() => { setFetchNote(""); setFetchData(true); setCredtial(""); }}>
            <AiOutlineDatabase className="btn-icon" /> Fetch
          </button>
        </div>

        <div className="note">
          {message ? (
            <h4>{message}</h4>
          ) : ""}
        </div>
      </div>

      {/* Edit Modal */}
      {(showEditModal || fetchData) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              <FaEdit className="title-icon" /> Edit Bill Details
            </h3>
            <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">
                  <FaCalendarAlt className="header-icon" /> Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                />
              </div>
              {showEditModal &&
                <div className="form-group">
                  <label className="form-label">
                    <FaUser className="header-icon" /> User Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={tempUser}
                    onChange={(e) => setTempUser(e.target.value)}
                    placeholder="Enter user name"
                  />
                </div>
              }
              {fetchData &&
                <div className="form-group">
                  <label className="form-label">
                    <MdOutlinePassword className="header-icon" /> Password
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    value={credtial}
                    onChange={(e) => setCredtial(e.target.value)}
                    placeholder="Enter password"
                  />

                  <div className='fetch'>{fetchNote}</div>
                </div>
              }
              <div className="modal-buttons">
                {showEditModal &&
                  <button type='button' className="modal-btn save-btn" onClick={handleEditSave}>
                    <FaSave /> Save
                  </button>}

                {fetchData &&
                  <button type='button' className="modal-btn save-btn" onClick={handleFetch}>
                    <FaSave /> Fetch
                  </button>
                }

                <button type='button' className="modal-btn cancel-btn" onClick={handleEditCancel}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>


            <div>
              {data && data.data && data.data.length > 0 ? (
                <div>
                  <p>ID: {data.data[0].id}</p>
                  <p>Date: {new Date(data.data[0].date).toLocaleDateString()}</p>
                </div>
              ) : (
                <h6>No Data found</h6>
              )}
            </div>


          </div>
        </div>
      )}
    </div>
  );
}

export default Final;

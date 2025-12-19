import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setReports } from '../reportSlice';
import {
  FaFileAlt,
  FaCalendarAlt,
  FaSearch,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaInbox,
  FaGasPump,
  FaChartLine,
  FaMoneyBillWave,
  FaTrash
} from 'react-icons/fa';
import { GiCash } from 'react-icons/gi';
import '../Styles/Report.css';

function Report() {
  const dispatch = useDispatch();
  const cachedReports = useSelector((state) => state.reports);

  const [data, setData] = useState(cachedReports || []);
  const [filteredData, setFilteredData] = useState(cachedReports || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all data from backend
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:9000/reading');
      setData(response.data);
      setFilteredData(response.data);
      dispatch(setReports(response.data));
    } catch (err) {
      console.error('Error fetching data:', err);

      if (cachedReports && cachedReports.length > 0) {
        setData(cachedReports);
        setFilteredData(cachedReports);
      } else {
        setError('Failed to load report data. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (e, id, date) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('Delete requested for record:', { id, date });
    const formattedDate = new Date(date).toLocaleDateString();

    if (window.confirm(`Permanently delete the record from ${formattedDate}?`)) {
      try {
        setLoading(true);
        // Force ID to be a number just in case
        const targetId = parseInt(id);
        const response = await axios.delete(`http://localhost:9000/reading/${targetId}`);
        console.log('Server response:', response.data);

        // Update local UI state immediately
        const newData = data.filter(item => item.id !== id);
        setData(newData);
        setFilteredData(prev => prev.filter(item => item.id !== id));

        // Also update Redux
        dispatch(setReports(newData));

        alert('Record deleted successfully');
      } catch (err) {
        console.error('Delete operation failed:', err);
        const message = err.response?.data?.message || err.message || 'Unknown error';
        alert(`Could not delete record: ${message}`);

        // Final attempt: refresh all data to be sure
        fetchAllData();
      } finally {
        setLoading(false);
      }
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...data];

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= new Date(startDate);
      });
    }

    if (endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate <= new Date(endDate);
      });
    }

    // Search filter (searches in date)
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const dateStr = new Date(item.date).toLocaleDateString();
        return dateStr.includes(searchTerm);
      });
    }

    setFilteredData(filtered);
  };

  // Clear filters
  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    setFilteredData(data);
  };

  // Calculate statistics - Total Liters, Petrol, Diesel, Oil, etc.
  const calculateStats = () => {
    if (filteredData.length === 0) {
      return {
        totalRecords: 0,
        totalLiters: 0,
        totalPetrolLts: 0,
        totalDieselLts: 0,
        totalCash: 0,
        totalUPI1: 0,
        totalUPI2: 0,
        totalBills: 0,
        totalOil: 0,
        totalDifference: 0,
        avgLiters: 0
      };
    }

    const totalRecords = filteredData.length;
    let totalLiters = 0;
    let totalPetrolLts = 0;
    let totalDieselLts = 0;
    let totalCash = 0;
    let totalUPI1 = 0;
    let totalUPI2 = 0;
    let totalBills = 0;
    let totalOil = 0;
    let totalDifference = 0;
    let totalSaleAmount = 0;
    let totalRecordAmount = 0;

    // Prices
    const getPrice = (key, def) => {
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : def;
      }
      catch (e) { return def; }
    };
    const petrolPrice = getPrice('fuelPrice', 109.79);
    const dieselPrice = getPrice('dieselPrice', 97.60);
    const powerPrice = getPrice('powerPrice', 117.79);
    const oilPrice = getPrice('oilPrice', 175);

    filteredData.forEach((item) => {
      let a1 = parseFloat(item.ea1 || 0) - parseFloat(item.sa1 || 0);
      let a2 = parseFloat(item.ea2 || 0) - parseFloat(item.sa2 || 0);
      let b1 = parseFloat(item.eb1 || 0) - parseFloat(item.sb1 || 0);
      let b2 = parseFloat(item.eb2 || 0) - parseFloat(item.sb2 || 0);

      // Deduct 5L for testing from each pump if used
      if (a1 > 0) a1 -= 5;
      if (a2 > 0) a2 -= 5;
      if (b1 > 0) b1 -= 5;
      if (b2 > 0) b2 -= 5;

      totalLiters += a1 + a2 + b1 + b2;

      // Calculate petrol and diesel separately (A1+A2=Petrol, B1+B2=Diesel)
      totalPetrolLts += a1 + a2;
      totalDieselLts += b1 + b2;

      totalCash += parseFloat(item.cash || 0);
      totalUPI1 += parseFloat(item.upi1 || 0);
      totalUPI2 += parseFloat(item.upi2 || 0);
      totalBills += parseFloat(item.bills || 0);
      totalOil += parseFloat(item.oil || 0);

      // Calculate difference for each record
      const recordTotal = parseFloat(item.cash || 0) +
        parseFloat(item.upi1 || 0) +
        parseFloat(item.upi2 || 0) +
        parseFloat(item.pay || item.bills || 0) +
        parseFloat(item.amount || 0) +
        parseFloat(item.food || 0) +
        parseFloat(item.change || 0);

      const a1Amt = a1 * petrolPrice;
      const a2Amt = a2 * (item.isA2Power ? powerPrice : petrolPrice);
      const b1Amt = b1 * (item.isB1Diesel ? dieselPrice : petrolPrice);
      const b2Amt = b2 * (item.isB2Diesel ? dieselPrice : petrolPrice);
      const oilAmt = parseFloat(item.oil || 0) * oilPrice;

      const saleAmount = a1Amt + a2Amt + b1Amt + b2Amt + oilAmt + parseFloat(item.additionalAmount || 0);

      totalSaleAmount += saleAmount;
      totalRecordAmount += recordTotal;
      totalDifference += recordTotal - saleAmount;
    });

    const avgLiters = totalLiters / totalRecords;

    return {
      totalRecords,
      totalLiters,
      totalPetrolLts,
      totalDieselLts,
      totalCash,
      totalUPI1,
      totalUPI2,
      totalBills,
      totalOil,
      totalDifference,
      totalSaleAmount,
      totalRecordAmount,
      avgLiters
    };
  };

  const stats = calculateStats();

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format number with commas
  const formatNumber = (num) => {
    return parseFloat(num || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading) {
    return (
      <div className="report-container">
        <div className="report-loading">
          <FaSpinner className="report-loading-icon" />
          <p>Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-container">
        <div className="report-error">
          <FaExclamationTriangle className="report-error-icon" />
          <p>{error}</p>
          <button onClick={fetchAllData} className="filter-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-container">
      <h1 className="report-title">
        <FaFileAlt className="report-title-icon" />
        Sales Report
      </h1>

      {/* Statistics Cards */}
      <div className="report-stats">
        <div className="stat-card">
          <FaChartLine className="stat-icon" />
          <div className="stat-content">
            <div className="stat-label">Total Records</div>
            <div className="stat-value">{stats.totalRecords}</div>
          </div>
        </div>
        <div className="stat-card">
          <FaGasPump className="stat-icon" />
          <div className="stat-content">
            <div className="stat-label">Total Liters Sold</div>
            <div className="stat-value">{formatNumber(stats.totalLiters)} L</div>
          </div>
        </div>
        <div className="stat-card">
          <FaGasPump className="stat-icon" />
          <div className="stat-content">
            <div className="stat-label">Total Petrol Lts</div>
            <div className="stat-value">{formatNumber(stats.totalPetrolLts)} L</div>
          </div>
        </div>
        <div className="stat-card">
          <FaGasPump className="stat-icon" />
          <div className="stat-content">
            <div className="stat-label">Total Diesel Lts</div>
            <div className="stat-value">{formatNumber(stats.totalDieselLts)} L</div>
          </div>
        </div>
        <div className="stat-card">
          <FaGasPump className="stat-icon" />
          <div className="stat-content">
            <div className="stat-label">Total Oil</div>
            <div className="stat-value">{stats.totalOil}</div>
          </div>
        </div>
        <div className="stat-card">
          <FaGasPump className="stat-icon" />
          <div className="stat-content">
            <div className="stat-label">Average Liters/Day</div>
            <div className="stat-value">{formatNumber(stats.avgLiters)} L</div>
          </div>
        </div>
        <div className="stat-card">
          <FaGasPump className="stat-icon" />
          <div className="stat-content">
            <div className="stat-label">Total Sale Amount</div>
            <div className="stat-value">₹ {formatNumber(stats.totalSaleAmount)}</div>
          </div>
        </div>
        <div className="stat-card">
          <FaGasPump className="stat-icon" />
          <div className="stat-content">
            <div className="stat-label">Total Record Amount</div>
            <div className="stat-value">₹ {formatNumber(stats.totalRecordAmount)}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="report-filters">
        <div className="filter-group">
          <label className="filter-label">
            <FaCalendarAlt /> Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <FaCalendarAlt /> End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <FaSearch /> Search
          </label>
          <input
            type="text"
            placeholder="Search by date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>

        <button onClick={applyFilters} className="filter-btn">
          <FaSearch /> Apply Filters
        </button>

        <button onClick={clearFilters} className="filter-btn clear-btn">
          <FaTimes /> Clear
        </button>
      </div>

      {/* Data Table */}
      {filteredData.length === 0 ? (
        <div className="report-empty">
          <FaInbox className="report-empty-icon" />
          <p>No records found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="report-table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Petrol (L)</th>
                <th>Diesel (L)</th>
                <th>Total Liters</th>
                <th>Cash (₹)</th>
                <th>UPI 1 (₹)</th>
                <th>UPI 2 (₹)</th>
                <th>Bills (₹)</th>
                <th>Oil (No.)</th>
                <th>Difference (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                let a1 = parseFloat(item.ea1 || 0) - parseFloat(item.sa1 || 0);
                let a2 = parseFloat(item.ea2 || 0) - parseFloat(item.sa2 || 0);
                let b1 = parseFloat(item.eb1 || 0) - parseFloat(item.sb1 || 0);
                let b2 = parseFloat(item.eb2 || 0) - parseFloat(item.sb2 || 0);

                // Deduct 5L for testing from each pump if used
                if (a1 > 0) a1 -= 5;
                if (a2 > 0) a2 -= 5;
                if (b1 > 0) b1 -= 5;
                if (b2 > 0) b2 -= 5;
                const totalLiters = a1 + a2 + b1 + b2;

                const petrolLts = a1 + a2;
                const dieselLts = b1 + b2;
                const cash = parseFloat(item.cash || 0);
                const upi1 = parseFloat(item.upi1 || 0);
                const upi2 = parseFloat(item.upi2 || 0);
                const bills = parseFloat(item.pay || item.bills || 0);
                const oil = parseFloat(item.oil || 0);

                // Prices
                const getPrice = (key, def) => {
                  try {
                    const val = localStorage.getItem(key);
                    return val ? JSON.parse(val) : def;
                  }
                  catch (e) { return def; }
                };
                const petrolPrice = getPrice('fuelPrice', 109.79);
                const dieselPrice = getPrice('dieselPrice', 97.60);
                const powerPrice = getPrice('powerPrice', 117.79);
                const oilPrice = getPrice('oilPrice', 175);

                // Calculate difference (cash collected - expected sale amount)
                const recordTotal = cash + upi1 + upi2 + bills +
                  parseFloat(item.amount || 0) +
                  parseFloat(item.food || 0) +
                  parseFloat(item.change || 0);

                // Calculate Sale Amount based on pump fuel types
                const a1Amt = a1 * petrolPrice;
                const a2Amt = a2 * (item.isA2Power ? powerPrice : petrolPrice);
                const b1Amt = b1 * (item.isB1Diesel ? dieselPrice : petrolPrice);
                const b2Amt = b2 * (item.isB2Diesel ? dieselPrice : petrolPrice);
                const oilAmt = oil * oilPrice;

                const saleAmount = a1Amt + a2Amt + b1Amt + b2Amt + oilAmt + parseFloat(item.additionalAmount || 0);
                const difference = recordTotal - saleAmount;

                return (
                  <tr key={item.id}>
                    <td>{formatDate(item.date)}</td>
                    <td>{formatNumber(petrolLts)}</td>
                    <td>{formatNumber(dieselLts)}</td>
                    <td><strong>{formatNumber(totalLiters)}</strong></td>
                    <td>{formatNumber(cash)}</td>
                    <td>{formatNumber(upi1)}</td>
                    <td>{formatNumber(upi2)}</td>
                    <td>{formatNumber(bills)}</td>
                    <td>{oil}</td>
                    <td className={difference >= 0 ? 'positive-diff' : 'negative-diff'}>
                      {difference >= 0 ? '+' : ''}{formatNumber(difference)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="report-delete-btn"
                        onClick={(e) => handleDeleteRecord(e, item.id, item.date)}
                        title="Delete Record"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Report;
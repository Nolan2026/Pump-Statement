import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaFileAlt,
  FaCalendarAlt,
  FaSearch,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaInbox,
  FaGasPump,
  FaChartLine
} from 'react-icons/fa';
import '../Styles/Report.css';

function Report() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
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

    filteredData.forEach((item) => {
      const a1 = parseFloat(item.ea1 || 0) - parseFloat(item.sa1 || 0);
      const a2 = parseFloat(item.ea2 || 0) - parseFloat(item.sa2 || 0);
      const b1 = parseFloat(item.eb1 || 0) - parseFloat(item.sb1 || 0);
      const b2 = parseFloat(item.eb2 || 0) - parseFloat(item.sb2 || 0);

      totalLiters += a1 + a2 + b1 + b2;

      // Calculate petrol and diesel separately (assuming B1, B2 can be diesel)
      totalPetrolLts += parseFloat(item.petrollts || 0);
      totalDieselLts += parseFloat(item.diesellts || 0);

      totalCash += parseFloat(item.cash || 0);
      totalUPI1 += parseFloat(item.upi1 || 0);
      totalUPI2 += parseFloat(item.upi2 || 0);
      totalBills += parseFloat(item.bills || 0);
      totalOil += parseFloat(item.oil || 0);

      // Calculate difference for each record
      const recordTotal = parseFloat(item.cash || 0) +
        parseFloat(item.upi1 || 0) +
        parseFloat(item.upi2 || 0) +
        parseFloat(item.bills || 0);
      // Assuming we need to calculate sale amount from liters
      // This is a simplified calculation - adjust based on your actual logic
      const saleAmount = (a1 + a2 + b1 + b2) * 100; // placeholder calculation
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
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const a1 = parseFloat(item.ea1 || 0) - parseFloat(item.sa1 || 0);
                const a2 = parseFloat(item.ea2 || 0) - parseFloat(item.sa2 || 0);
                const b1 = parseFloat(item.eb1 || 0) - parseFloat(item.sb1 || 0);
                const b2 = parseFloat(item.eb2 || 0) - parseFloat(item.sb2 || 0);
                const totalLiters = a1 + a2 + b1 + b2;

                const petrolLts = parseFloat(item.petrollts || 0);
                const dieselLts = parseFloat(item.diesellts || 0);
                const cash = parseFloat(item.cash || 0);
                const upi1 = parseFloat(item.upi1 || 0);
                const upi2 = parseFloat(item.upi2 || 0);
                const bills = parseFloat(item.bills || 0);
                const oil = parseFloat(item.oil || 0);

                // Calculate difference (cash collected - expected sale amount)
                const cashCollected = cash + upi1 + upi2 + bills;
                // This is a placeholder - adjust based on your actual sale calculation
                const saleAmount = totalLiters * 100; // Replace with actual price calculation
                const difference = cashCollected - saleAmount;

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
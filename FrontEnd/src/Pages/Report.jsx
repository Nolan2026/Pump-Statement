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

  // Calculate statistics - Total Liters
  const calculateStats = () => {
    if (filteredData.length === 0) return { totalRecords: 0, totalLiters: 0, avgLiters: 0 };

    const totalRecords = filteredData.length;
    const totalLiters = filteredData.reduce((sum, item) => {
      const a1 = parseFloat(item.ea1 || 0) - parseFloat(item.sa1 || 0);
      const a2 = parseFloat(item.ea2 || 0) - parseFloat(item.sa2 || 0);
      const b1 = parseFloat(item.eb1 || 0) - parseFloat(item.sb1 || 0);
      const b2 = parseFloat(item.eb2 || 0) - parseFloat(item.sb2 || 0);
      return sum + a1 + a2 + b1 + b2;
    }, 0);
    const avgLiters = totalLiters / totalRecords;

    return { totalRecords, totalLiters, avgLiters };
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
                <th>A1 (L)</th>
                <th>A2 (L)</th>
                <th>B1 (L)</th>
                <th>B2 (L)</th>
                <th>Total Liters</th>
                <th>Cash (₹)</th>
                <th>UPI 1 (₹)</th>
                <th>UPI 2 (₹)</th>
                <th>Bills (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const a1 = parseFloat(item.ea1 || 0) - parseFloat(item.sa1 || 0);
                const a2 = parseFloat(item.ea2 || 0) - parseFloat(item.sa2 || 0);
                const b1 = parseFloat(item.eb1 || 0) - parseFloat(item.sb1 || 0);
                const b2 = parseFloat(item.eb2 || 0) - parseFloat(item.sb2 || 0);
                const totalLiters = a1 + a2 + b1 + b2;
                const cash = parseFloat(item.cash || 0);
                const upi1 = parseFloat(item.upi1 || 0);
                const upi2 = parseFloat(item.upi2 || 0);
                const bills = parseFloat(item.bills || 0);

                return (
                  <tr key={item.id}>
                    <td>{formatDate(item.date)}</td>
                    <td>{formatNumber(a1)}</td>
                    <td>{formatNumber(a2)}</td>
                    <td>{formatNumber(b1)}</td>
                    <td>{formatNumber(b2)}</td>
                    <td><strong>{formatNumber(totalLiters)}</strong></td>
                    <td>{formatNumber(cash)}</td>
                    <td>{formatNumber(upi1)}</td>
                    <td>{formatNumber(upi2)}</td>
                    <td>{formatNumber(bills)}</td>
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
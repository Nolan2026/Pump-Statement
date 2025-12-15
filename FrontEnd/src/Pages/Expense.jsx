import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaMoneyBillWave,
    FaCalendarAlt,
    FaSearch,
    FaTimes,
    FaSpinner,
    FaExclamationTriangle,
    FaInbox,
    FaSave,
    FaChartLine,
    FaUtensils,
    FaCar,
    FaShoppingCart,
    FaMinus,
    FaPlus
} from 'react-icons/fa';
import '../Styles/Expense.css';

function Expense() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveMessage, setSaveMessage] = useState('');

    // Form states
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        travelling: '',
        breakfast: '',
        lunch: '',
        dinner: '',
        others: '',
        loss: '',
        gain: ''
    });

    // Filter states
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Fetch all expenses from backend
    useEffect(() => {
        fetchAllExpenses();
    }, []);

    const fetchAllExpenses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:9000/expenses');
            setData(response.data);
            setFilteredData(response.data);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setError('Failed to load expense data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Calculate expenses and total expenses
    const calculateExpenses = () => {
        const travelling = parseFloat(formData.travelling) || 0;
        const breakfast = parseFloat(formData.breakfast) || 0;
        const lunch = parseFloat(formData.lunch) || 0;
        const dinner = parseFloat(formData.dinner) || 0;
        const others = parseFloat(formData.others) || 0;
        const loss = parseFloat(formData.loss) || 0;
        const gain = parseFloat(formData.gain) || 0;

        const expenses = travelling + breakfast + lunch + dinner + others + loss;
        const totalExpenses = gain - expenses;

        return { expenses, totalExpenses };
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { expenses, totalExpenses } = calculateExpenses();

            const payload = {
                ...formData,
                travelling: parseFloat(formData.travelling) || 0,
                breakfast: parseFloat(formData.breakfast) || 0,
                lunch: parseFloat(formData.lunch) || 0,
                dinner: parseFloat(formData.dinner) || 0,
                others: parseFloat(formData.others) || 0,
                loss: parseFloat(formData.loss) || 0,
                gain: parseFloat(formData.gain) || 0
            };

            await axios.post('http://localhost:9000/expenses', payload);
            setSaveMessage('Expense saved successfully!');

            // Reset form
            setFormData({
                date: new Date().toISOString().split('T')[0],
                travelling: '',
                breakfast: '',
                lunch: '',
                dinner: '',
                others: '',
                loss: '',
                gain: ''
            });

            // Refresh data
            fetchAllExpenses();

            // Clear message after 3 seconds
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (err) {
            console.error('Error saving expense:', err);
            setSaveMessage(err.response?.data?.message || 'Failed to save expense');
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    // Apply filters
    const applyFilters = () => {
        let filtered = [...data];

        if (startDate && endDate) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
            });
        }

        setFilteredData(filtered);
    };

    // Clear filters
    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setFilteredData(data);
    };

    // Calculate statistics
    const calculateStats = () => {
        if (filteredData.length === 0) {
            return {
                totalGain: 0,
                totalLoss: 0,
                totalExpenses: 0,
                netAmount: 0
            };
        }

        let totalGain = 0;
        let totalLoss = 0;
        let totalExpenses = 0;

        filteredData.forEach(item => {
            totalGain += parseFloat(item.gain || 0);
            totalLoss += parseFloat(item.loss || 0);
            totalExpenses += parseFloat(item.expenses || 0);
        });

        const netAmount = totalGain - totalExpenses;

        return {
            totalGain,
            totalLoss,
            totalExpenses,
            netAmount
        };
    };

    const stats = calculateStats();
    const { expenses: currentExpenses, totalExpenses: currentTotal } = calculateExpenses();

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format number with currency
    const formatCurrency = (num) => {
        return parseFloat(num || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    if (loading) {
        return (
            <div className="expense-container">
                <div className="expense-loading">
                    <FaSpinner className="expense-loading-icon" />
                    <p>Loading expense data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="expense-container">
                <div className="expense-error">
                    <FaExclamationTriangle className="expense-error-icon" />
                    <p>{error}</p>
                    <button onClick={fetchAllExpenses} className="filter-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="expense-container">
            <h1 className="expense-title">
                <FaMoneyBillWave className="expense-title-icon" />
                Expense Tracker
            </h1>

            {/* Statistics Cards */}
            <div className="expense-stats">
                <div className="stat-card gain-card">
                    <FaPlus className="stat-icon" />
                    <div className="stat-content">
                        <div className="stat-label">Total Gain</div>
                        <div className="stat-value">₹ {formatCurrency(stats.totalGain)}</div>
                    </div>
                </div>
                <div className="stat-card loss-card">
                    <FaMinus className="stat-icon" />
                    <div className="stat-content">
                        <div className="stat-label">Total Loss</div>
                        <div className="stat-value">₹ {formatCurrency(stats.totalLoss)}</div>
                    </div>
                </div>
                <div className="stat-card expense-card">
                    <FaMoneyBillWave className="stat-icon" />
                    <div className="stat-content">
                        <div className="stat-label">Total Expenses</div>
                        <div className="stat-value">₹ {formatCurrency(stats.totalExpenses)}</div>
                    </div>
                </div>
                <div className={`stat-card ${stats.netAmount >= 0 ? 'profit-card' : 'loss-card'}`}>
                    <FaChartLine className="stat-icon" />
                    <div className="stat-content">
                        <div className="stat-label">Net Amount</div>
                        <div className="stat-value">₹ {formatCurrency(stats.netAmount)}</div>
                    </div>
                </div>
            </div>

            {/* Expense Form */}
            <div className="expense-form-container">
                <h2 className="form-title">Add New Expense</h2>
                <form onSubmit={handleSubmit} className="expense-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <FaCalendarAlt /> Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaCar /> Travelling
                            </label>
                            <input
                                type="number"
                                name="travelling"
                                value={formData.travelling}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaUtensils /> Breakfast
                            </label>
                            <input
                                type="number"
                                name="breakfast"
                                value={formData.breakfast}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <FaUtensils /> Lunch
                            </label>
                            <input
                                type="number"
                                name="lunch"
                                value={formData.lunch}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaUtensils /> Dinner
                            </label>
                            <input
                                type="number"
                                name="dinner"
                                value={formData.dinner}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaShoppingCart /> Others
                            </label>
                            <input
                                type="number"
                                name="others"
                                value={formData.others}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <FaMinus /> Loss
                            </label>
                            <input
                                type="number"
                                name="loss"
                                value={formData.loss}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaPlus /> Gain
                            </label>
                            <input
                                type="number"
                                name="gain"
                                value={formData.gain}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group calc-group">
                            <div className="calc-result">
                                <span className="calc-label">Expenses:</span>
                                <span className="calc-value">₹ {formatCurrency(currentExpenses)}</span>
                            </div>
                            <div className="calc-result">
                                <span className="calc-label">Total:</span>
                                <span className={`calc-value ${currentTotal >= 0 ? 'positive' : 'negative'}`}>
                                    ₹ {formatCurrency(currentTotal)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn">
                            <FaSave /> Save Expense
                        </button>
                        {saveMessage && (
                            <div className={`save-message ${saveMessage.includes('success') ? 'success' : 'error'}`}>
                                {saveMessage}
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Filters */}
            <div className="expense-filters">
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

                <button onClick={applyFilters} className="filter-btn">
                    <FaSearch /> Apply Filters
                </button>

                <button onClick={clearFilters} className="filter-btn clear-btn">
                    <FaTimes /> Clear
                </button>
            </div>

            {/* Data Table */}
            {filteredData.length === 0 ? (
                <div className="expense-empty">
                    <FaInbox className="expense-empty-icon" />
                    <p>No expense records found. Add one to get started!</p>
                </div>
            ) : (
                <div className="expense-table-container">
                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Travelling</th>
                                <th>Breakfast</th>
                                <th>Lunch</th>
                                <th>Dinner</th>
                                <th>Others</th>
                                <th>Loss</th>
                                <th>Gain</th>
                                <th>Expenses</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item) => {
                                const total = parseFloat(item.totalExpenses || 0);
                                return (
                                    <tr key={item.id}>
                                        <td>{formatDate(item.date)}</td>
                                        <td>₹ {formatCurrency(item.travelling)}</td>
                                        <td>₹ {formatCurrency(item.breakfast)}</td>
                                        <td>₹ {formatCurrency(item.lunch)}</td>
                                        <td>₹ {formatCurrency(item.dinner)}</td>
                                        <td>₹ {formatCurrency(item.others)}</td>
                                        <td>₹ {formatCurrency(item.loss)}</td>
                                        <td className="gain-cell">₹ {formatCurrency(item.gain)}</td>
                                        <td className="expense-cell">₹ {formatCurrency(item.expenses)}</td>
                                        <td className={total >= 0 ? 'positive-total' : 'negative-total'}>
                                            <strong>₹ {formatCurrency(total)}</strong>
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

export default Expense;

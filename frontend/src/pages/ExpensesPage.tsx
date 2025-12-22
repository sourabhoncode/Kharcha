import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useExpenses } from '../context/ExpensesContext';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import '../styles/ExpensesPage.css';

const ExpensesPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const { expenses, deleteExpense, deleteMultiple, updateExpense, getTotalSpending } = useExpenses();
    const [activeNav, setActiveNav] = useState('expenses');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
    const [dateRangeStart, setDateRangeStart] = useState('');
    const [dateRangeEnd, setDateRangeEnd] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedExpenses, setSelectedExpenses] = useState<Set<string>>(new Set());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<any>(null);

    const categories = ['all', 'Food', 'Utilities', 'Transport', 'Entertainment', 'Other'];

    // Filter and sort expenses - MUST be before conditional return
    const filteredExpenses = useMemo(() => {
        let filtered = expenses.filter(exp => {
            const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;

            // Date range filter
            let matchesDateRange = true;
            if (dateRangeStart || dateRangeEnd) {
                const expDate = new Date(exp.date);
                if (dateRangeStart) matchesDateRange = expDate >= new Date(dateRangeStart);
                if (dateRangeEnd) matchesDateRange = matchesDateRange && expDate <= new Date(dateRangeEnd);
            }

            // Month/Year filter
            let matchesMonthYear = true;
            if (selectedMonth || selectedYear) {
                const expDate = new Date(exp.date);
                if (selectedMonth) {
                    matchesMonthYear = (expDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth;
                }
                if (selectedYear) {
                    matchesMonthYear = matchesMonthYear && expDate.getFullYear().toString() === selectedYear;
                }
            }

            return matchesSearch && matchesCategory && matchesDateRange && matchesMonthYear;
        });

        // Sort expenses
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'date-asc':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'amount-desc':
                    return b.amount - a.amount;
                case 'amount-asc':
                    return a.amount - b.amount;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [expenses, searchTerm, selectedCategory, sortBy, dateRangeStart, dateRangeEnd, selectedMonth, selectedYear]);

    // Calculate category totals
    const categoryTotals: Record<string, number> = {};
    filteredExpenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const totalFiltered = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDeleteExpense = (id: string) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            deleteExpense(id);
            setSelectedExpenses(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const handleToggleExpense = (id: string) => {
        setSelectedExpenses(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedExpenses.size === filteredExpenses.length) {
            setSelectedExpenses(new Set());
        } else {
            setSelectedExpenses(new Set(filteredExpenses.map(exp => exp.id)));
        }
    };

    const handleDeleteSelected = () => {
        if (selectedExpenses.size === 0) return;
        if (window.confirm(`Delete ${selectedExpenses.size} expense(s)?`)) {
            deleteMultiple(Array.from(selectedExpenses));
            setSelectedExpenses(new Set());
        }
    };

    const handleStartEdit = (expense: any) => {
        setEditingId(expense.id);
        setEditData(expense);
    };

    const handleSaveEdit = () => {
        if (editingId && editData) {
            updateExpense(editingId, editData);
            setEditingId(null);
            setEditData(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData(null);
    };

    if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
                <h2>Please log in first</h2>
                <button onClick={() => navigate('/login')}>Go to Login</button>
            </div>
        );
    }

    return (
        <div className="App">
            <div className="app-wrapper">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-header" style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid rgba(0, 212, 255, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                            <Logo size="small" />
                            <div style={{ textAlign: 'left' }}>
                                <h2 style={{ margin: '0', color: '#00d4ff', fontSize: '16px', fontWeight: '700' }}>Your</h2>
                                <h2 style={{ margin: '0', color: '#fff', fontSize: '16px', fontWeight: '700' }}>Kharcha</h2>
                            </div>
                        </div>
                    </div>
                    <div className="profile-section">
                        <div className="profile-avatar-wrapper">
                            <span className="profile-emoji">{user.avatar || '👤'}</span>
                        </div>
                        <h3 className="profile-name">{user.firstName} {user.lastName}</h3>
                        <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0' }}>{user.email}</p>
                        <button
                            className="edit-profile-btn"
                            onClick={() => navigate('/edit-profile')}
                        >
                            ✏️ Edit Profile
                        </button>
                    </div>

                    <nav className="nav-menu">
                        <div className={`nav-item ${activeNav === 'home' ? 'active' : ''}`} onClick={() => { setActiveNav('home'); navigate('/dashboard'); }}>
                            <span className="nav-icon">🏠</span>
                            <span className="nav-label">Home</span>
                        </div>
                        <div className={`nav-item ${activeNav === 'expenses' ? 'active' : ''}`} onClick={() => setActiveNav('expenses')}>
                            <span className="nav-icon">💳</span>
                            <span className="nav-label">Expenses</span>
                        </div>
                        <div className={`nav-item ${activeNav === 'trips' ? 'active' : ''}`} onClick={() => { setActiveNav('trips'); navigate('/trips'); }}>
                            <span className="nav-icon">✈️</span>
                            <span className="nav-label">Trips</span>
                        </div>
                        <div className={`nav-item ${activeNav === 'settings' ? 'active' : ''}`} onClick={() => { setActiveNav('settings'); navigate('/settings'); }}>
                            <span className="nav-icon">⚙️</span>
                            <span className="nav-label">Settings</span>
                        </div>
                        <div className={`nav-item logout-item`} onClick={handleLogout}>
                            <span className="nav-icon">🚪</span>
                            <span className="nav-label">Logout</span>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    {/* Header */}
                    <div className="expenses-header">
                        <h1>Expenses</h1>
                        <button
                            className="btn-add-expense"
                            onClick={() => navigate('/add-expense')}
                        >
                            + Add Expense
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="summary-cards">
                        <div className="summary-card">
                            <div className="summary-label">Total Expenses</div>
                            <div className="summary-value">₹{getTotalSpending().toFixed(2)}</div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-label">Filtered Total</div>
                            <div className="summary-value">₹{totalFiltered.toFixed(2)}</div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-label">Number of Expenses</div>
                            <div className="summary-value">{filteredExpenses.length}</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="filters-section">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search expenses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        <div className="filter-group">
                            <label>Category:</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="filter-select"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Month:</label>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Months</option>
                                {Array.from({ length: 12 }, (_, i) => {
                                    const month = String(i + 1).padStart(2, '0');
                                    const monthName = new Date(2024, i).toLocaleString('default', { month: 'long' });
                                    return <option key={month} value={month}>{monthName}</option>;
                                })}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Year:</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="filter-select"
                            >
                                {Array.from({ length: 5 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return <option key={year} value={year.toString()}>{year}</option>;
                                })}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Sort By:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="filter-select"
                            >
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="amount-desc">Highest Amount</option>
                                <option value="amount-asc">Lowest Amount</option>
                            </select>
                        </div>
                    </div>

                    {/* Date Range Filter */}
                    <div className="date-range-filter">
                        <div className="filter-group">
                            <label>From:</label>
                            <input
                                type="date"
                                value={dateRangeStart}
                                onChange={(e) => setDateRangeStart(e.target.value)}
                                className="filter-input-date"
                            />
                        </div>
                        <div className="filter-group">
                            <label>To:</label>
                            <input
                                type="date"
                                value={dateRangeEnd}
                                onChange={(e) => setDateRangeEnd(e.target.value)}
                                className="filter-input-date"
                            />
                        </div>
                        {(dateRangeStart || dateRangeEnd) && (
                            <button
                                className="btn-clear-date-range"
                                onClick={() => {
                                    setDateRangeStart('');
                                    setDateRangeEnd('');
                                }}
                            >
                                Clear Date Range
                            </button>
                        )}
                    </div>

                    {/* Category Summary */}
                    {Object.keys(categoryTotals).length > 0 && (
                        <div className="category-summary">
                            <h3>Category Breakdown</h3>
                            <div className="category-list">
                                {Object.entries(categoryTotals).map(([category, total]) => (
                                    <div key={category} className="category-item">
                                        <span className="category-name">{category}</span>
                                        <span className="category-amount">₹{total.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Expenses Table */}
                    <div className="expenses-table-section">
                        {filteredExpenses.length === 0 ? (
                            <div className="no-expenses">
                                <p>📭 No expenses found</p>
                                <button
                                    className="btn-add-expense"
                                    onClick={() => navigate('/add-expense')}
                                >
                                    Add Your First Expense
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Bulk Actions */}
                                {selectedExpenses.size > 0 && (
                                    <div className="bulk-actions">
                                        <span>{selectedExpenses.size} selected</span>
                                        <button
                                            className="btn-delete-bulk"
                                            onClick={handleDeleteSelected}
                                        >
                                            🗑️ Delete Selected ({selectedExpenses.size})
                                        </button>
                                    </div>
                                )}

                                <table className="expenses-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedExpenses.size === filteredExpenses.length && filteredExpenses.length > 0}
                                                    onChange={handleSelectAll}
                                                    title="Select all"
                                                />
                                            </th>
                                            <th>Date</th>
                                            <th>Description</th>
                                            <th>Category</th>
                                            <th>Amount</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredExpenses.map(expense => (
                                            <tr key={expense.id} className={selectedExpenses.has(expense.id) ? 'selected-row' : ''}>
                                                <td style={{ width: '40px' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedExpenses.has(expense.id)}
                                                        onChange={() => handleToggleExpense(expense.id)}
                                                    />
                                                </td>
                                                <td className="col-date">{expense.date}</td>
                                                <td className="col-description">{expense.description}</td>
                                                <td className="col-category">
                                                    <span className={`badge badge-${expense.categoryBadge}`}>
                                                        {expense.category}
                                                    </span>
                                                </td>
                                                <td className="col-amount">₹{expense.amount.toFixed(2)}</td>
                                                <td className="col-action">
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => handleStartEdit(expense)}
                                                        title="Edit expense"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => handleDeleteExpense(expense.id)}
                                                        title="Delete expense"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Edit Modal */}
                                {editingId && editData && (
                                    <div className="modal-overlay" onClick={handleCancelEdit}>
                                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                            <h2>Edit Expense</h2>
                                            <div className="form-group">
                                                <label>Description</label>
                                                <input
                                                    type="text"
                                                    value={editData.description}
                                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                                    className="modal-input"
                                                />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Category</label>
                                                    <select
                                                        value={editData.category}
                                                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                                        className="modal-input"
                                                    >
                                                        <option value="Food">Food</option>
                                                        <option value="Utilities">Utilities</option>
                                                        <option value="Transport">Transport</option>
                                                        <option value="Entertainment">Entertainment</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Amount (₹)</label>
                                                    <input
                                                        type="number"
                                                        value={editData.amount}
                                                        onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                                                        className="modal-input"
                                                        step="0.01"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Date</label>
                                                <input
                                                    type="date"
                                                    value={editData.date}
                                                    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                                                    className="modal-input"
                                                />
                                            </div>
                                            <div className="modal-actions">
                                                <button
                                                    className="btn-cancel"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="btn-save"
                                                    onClick={handleSaveEdit}
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default ExpensesPage;

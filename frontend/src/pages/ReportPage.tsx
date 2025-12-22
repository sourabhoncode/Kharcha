import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useExpenses } from '../context/ExpensesContext';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import '../styles/ReportPage.css';

const ReportPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const { expenses } = useExpenses();
    const [activeNav, setActiveNav] = useState('reports');
    const [reportType, setReportType] = useState<'monthly' | 'category' | 'summary' | 'daily'>('monthly');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].substring(0, 7));

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Calculate monthly data
    const getMonthlyData = () => {
        const monthlyTotals: Record<string, number> = {};
        const monthlyCount: Record<string, number> = {};

        expenses.forEach(exp => {
            const expMonth = exp.date.substring(0, 7);
            monthlyTotals[expMonth] = (monthlyTotals[expMonth] || 0) + exp.amount;
            monthlyCount[expMonth] = (monthlyCount[expMonth] || 0) + 1;
        });

        return { monthlyTotals, monthlyCount };
    };

    // Calculate category data
    const getCategoryData = () => {
        const categoryTotals: Record<string, number> = {};
        const categoryCount: Record<string, number> = {};

        expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
            categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
        });

        return { categoryTotals, categoryCount };
    };

    // Calculate daily data for selected month
    const getDailyData = () => {
        const dailyTotals: Record<string, number> = {};
        const dailyCount: Record<string, number> = {};

        expenses.forEach(exp => {
            if (exp.date.startsWith(selectedMonth)) {
                const day = exp.date;
                dailyTotals[day] = (dailyTotals[day] || 0) + exp.amount;
                dailyCount[day] = (dailyCount[day] || 0) + 1;
            }
        });

        return { dailyTotals, dailyCount };
    };

    const monthlyData = getMonthlyData();
    const categoryData = getCategoryData();
    const dailyData = getDailyData();

    const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const maxMonthly = Math.max(...Object.values(monthlyData.monthlyTotals), 1);
    const maxCategory = Math.max(...Object.values(categoryData.categoryTotals), 1);
    const maxDaily = Math.max(...Object.values(dailyData.dailyTotals), 1);

    const monthlyExpenses = useMemo(() => {
        return expenses
            .filter(exp => exp.date.startsWith(selectedMonth))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [selectedMonth, expenses]);

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
                        <div className={`nav-item ${activeNav === 'home' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
                            <span className="nav-icon">🏠</span>
                            <span className="nav-label">Home</span>
                        </div>
                        <div className={`nav-item ${activeNav === 'expenses' ? 'active' : ''}`} onClick={() => { setActiveNav('expenses'); navigate('/expenses'); }}>
                            <span className="nav-icon">💳</span>
                            <span className="nav-label">Expenses</span>
                        </div>
                        <div className={`nav-item ${activeNav === 'reports' ? 'active' : ''}`} onClick={() => setActiveNav('reports')}>
                            <span className="nav-icon">📋</span>
                            <span className="nav-label">Reports</span>
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
                    <div className="report-header">
                        <h1>Financial Reports</h1>
                        <p className="report-subtitle">Analyze your spending patterns and trends</p>
                    </div>

                    {/* Report Type Selector */}
                    <div className="report-selector">
                        <button
                            className={`report-tab ${reportType === 'summary' ? 'active' : ''}`}
                            onClick={() => setReportType('summary')}
                        >
                            📊 Summary
                        </button>
                        <button
                            className={`report-tab ${reportType === 'monthly' ? 'active' : ''}`}
                            onClick={() => setReportType('monthly')}
                        >
                            📈 Monthly
                        </button>
                        <button
                            className={`report-tab ${reportType === 'category' ? 'active' : ''}`}
                            onClick={() => setReportType('category')}
                        >
                            🏷️ Category
                        </button>
                        <button
                            className={`report-tab ${reportType === 'daily' ? 'active' : ''}`}
                            onClick={() => setReportType('daily')}
                        >
                            📅 Daily
                        </button>
                    </div>

                    {/* Summary Report */}
                    {reportType === 'summary' && (
                        <section className="report-section">
                            <h2>Spending Summary</h2>
                            <div className="summary-grid">
                                <div className="summary-card">
                                    <div className="summary-icon">💰</div>
                                    <div className="summary-content">
                                        <p className="summary-label">Total Spending</p>
                                        <p className="summary-value">₹{totalSpending.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="summary-card">
                                    <div className="summary-icon">📊</div>
                                    <div className="summary-content">
                                        <p className="summary-label">Average Per Transaction</p>
                                        <p className="summary-value">₹{expenses.length > 0 ? (totalSpending / expenses.length).toFixed(2) : '0.00'}</p>
                                    </div>
                                </div>
                                <div className="summary-card">
                                    <div className="summary-icon">🛒</div>
                                    <div className="summary-content">
                                        <p className="summary-label">Total Transactions</p>
                                        <p className="summary-value">{expenses.length}</p>
                                    </div>
                                </div>
                                <div className="summary-card">
                                    <div className="summary-icon">📅</div>
                                    <div className="summary-content">
                                        <p className="summary-label">Months with Data</p>
                                        <p className="summary-value">{Object.keys(monthlyData.monthlyTotals).length}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Top Categories */}
                            <div className="report-subsection">
                                <h3>Top Spending Categories</h3>
                                <div className="category-list">
                                    {Object.entries(categoryData.categoryTotals)
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, 5)
                                        .map(([category, amount]) => (
                                            <div key={category} className="category-item">
                                                <div className="category-info">
                                                    <span className="category-name">{category}</span>
                                                    <span className="category-count">{categoryData.categoryCount[category]} transactions</span>
                                                </div>
                                                <span className="category-amount">₹{amount.toFixed(2)}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Monthly Report */}
                    {reportType === 'monthly' && (
                        <section className="report-section">
                            <h2>Monthly Spending Trend</h2>
                            <div className="chart-container">
                                <div className="bar-chart">
                                    {Object.entries(monthlyData.monthlyTotals)
                                        .sort(([a], [b]) => a.localeCompare(b))
                                        .map(([month, amount]) => (
                                            <div key={month} className="bar-wrapper">
                                                <div
                                                    className="bar"
                                                    style={{ height: maxMonthly > 0 ? (amount / maxMonthly) * 100 + '%' : '5%' }}
                                                    title={`${month}: ₹${amount.toFixed(2)}`}
                                                ></div>
                                                <label className="bar-label">{month}</label>
                                                <span className="bar-value">₹{amount.toFixed(2)}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Category Report */}
                    {reportType === 'category' && (
                        <section className="report-section">
                            <h2>Spending by Category</h2>
                            <div className="chart-container">
                                <div className="bar-chart">
                                    {Object.entries(categoryData.categoryTotals)
                                        .sort(([, a], [, b]) => b - a)
                                        .map(([category, amount]) => (
                                            <div key={category} className="bar-wrapper">
                                                <div
                                                    className="bar"
                                                    style={{ height: maxCategory > 0 ? (amount / maxCategory) * 100 + '%' : '5%' }}
                                                    title={`${category}: ₹${amount.toFixed(2)}`}
                                                ></div>
                                                <label className="bar-label">{category}</label>
                                                <span className="bar-value">₹{amount.toFixed(2)}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Daily Report */}
                    {reportType === 'daily' && (
                        <section className="report-section">
                            <h2>Daily Spending - {selectedMonth}</h2>
                            <div className="month-selector">
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="month-input"
                                />
                            </div>

                            {monthlyExpenses.length > 0 ? (
                                <div className="daily-list">
                                    {Object.entries(dailyData.dailyTotals)
                                        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                                        .map(([date, amount]) => (
                                            <div key={date} className="daily-item">
                                                <div className="daily-date">
                                                    <span className="date-label">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                                </div>
                                                <div className="daily-bar">
                                                    <div
                                                        className="bar"
                                                        style={{ width: maxDaily > 0 ? (amount / maxDaily) * 100 + '%' : '5%' }}
                                                    ></div>
                                                </div>
                                                <div className="daily-info">
                                                    <span className="daily-amount">₹{amount.toFixed(2)}</span>
                                                    <span className="daily-count">{dailyData.dailyCount[date]} transaction(s)</span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No expenses for {selectedMonth}</p>
                            )}

                            {/* Transaction List for Selected Month */}
                            <div className="transaction-list">
                                <h3>Transactions for {selectedMonth}</h3>
                                {monthlyExpenses.length > 0 ? (
                                    <table className="expenses-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Description</th>
                                                <th>Category</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monthlyExpenses.map(expense => (
                                                <tr key={expense.id}>
                                                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                                                    <td>{expense.description}</td>
                                                    <td><span className={`badge badge-${expense.categoryBadge}`}>{expense.category}</span></td>
                                                    <td>₹{expense.amount.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No transactions for {selectedMonth}</p>
                                )}
                            </div>
                        </section>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default ReportPage;

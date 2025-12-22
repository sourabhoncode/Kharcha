import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useExpenses } from '../context/ExpensesContext';
import { useBudget } from '../context/BudgetContext';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import '../App.css';

const Dashboard: React.FC = () => {
    const [activeNav, setActiveNav] = useState('home');
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const { expenses, getTotalSpending, getMonthlyAverage, getBiggestCategory } = useExpenses();
    const { getBudgetForMonth, setBudgetForMonth } = useBudget();

    const [budgetAmount, setBudgetAmount] = useState('');
    const [showBudgetForm, setShowBudgetForm] = useState(false);

    // IMPORTANT: All hooks must be called unconditionally before any conditional returns
    // Memoize expensive calculations
    const totalSpending = useMemo(() => getTotalSpending(), [expenses]);
    const monthlyAverage = useMemo(() => getMonthlyAverage(), [expenses]);
    const biggestCategory = useMemo(() => getBiggestCategory(), [expenses]);

    // Memoize category spending calculation
    const categorySpending = useMemo(() => {
        const categoryTotals: Record<string, number> = {};
        expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });
        return categoryTotals;
    }, [expenses]);

    const categories = ['Food', 'Utilities', 'Transport', 'Entertainment', 'Other'];
    const categoryValues = useMemo(() => categories.map(cat => categorySpending[cat] || 0), [categorySpending]);
    const maxCategoryValue = useMemo(() => Math.max(...categoryValues, 1), [categoryValues]);

    // Memoize monthly trend calculation
    const { monthlyTotals, monthLabels, monthlyTrend, maxMonthlyValue } = useMemo(() => {
        const monthlyTotals: Record<string, number> = {};
        const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        expenses.forEach(exp => {
            const date = new Date(exp.date);
            const month = fullMonthNames[date.getMonth()];
            monthlyTotals[month] = (monthlyTotals[month] || 0) + exp.amount;
        });

        const currentMonth = new Date().getMonth();
        let startMonth, endMonth;
        if (currentMonth <= 5) {
            startMonth = 0;
            endMonth = 5;
        } else {
            startMonth = 6;
            endMonth = 11;
        }

        const monthLabels = fullMonthNames.slice(startMonth, endMonth + 1);
        const monthlyTrend = monthLabels.map(month => monthlyTotals[month] || 0);
        const maxMonthlyValue = Math.max(...monthlyTrend, 1);

        return { monthlyTotals, monthLabels, monthlyTrend, maxMonthlyValue };
    }, [expenses]);

    // Budget calculations
    const now = new Date();
    const currentMonthBudget = useMemo(() => getBudgetForMonth(now.getFullYear(), now.getMonth() + 1), [now]);

    const { currentMonthSpent, remaining, budgetPercentage } = useMemo(() => {
        const currentMonthSpent = expenses
            .filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
            })
            .reduce((sum, exp) => sum + exp.amount, 0);

        const remaining = currentMonthBudget ? currentMonthBudget - currentMonthSpent : null;
        const budgetPercentage = currentMonthBudget ? (currentMonthSpent / currentMonthBudget) * 100 : 0;

        return { currentMonthSpent, remaining, budgetPercentage };
    }, [expenses, currentMonthBudget, now]);

    // Show only recent 10 expenses to prevent lag
    const recentExpenses = useMemo(() => {
        return expenses.slice(0, 10);
    }, [expenses]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Now it's safe to have conditional returns - all hooks are already called
    if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
                <h2>Please log in first</h2>
                <button onClick={() => navigate('/login')}>Go to Login</button>
            </div>
        );
    }

    const handleSetBudget = () => {
        if (budgetAmount && parseFloat(budgetAmount) > 0) {
            setBudgetForMonth(now.getFullYear(), now.getMonth() + 1, parseFloat(budgetAmount));
            setBudgetAmount('');
            setShowBudgetForm(false);
        }
    };

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
                        <div className={`nav-item ${activeNav === 'home' ? 'active' : ''}`} onClick={() => setActiveNav('home')}>
                            <span className="nav-icon">🏠</span>
                            <span className="nav-label">Home</span>
                        </div>
                        <div className={`nav-item ${activeNav === 'expenses' ? 'active' : ''}`} onClick={() => { setActiveNav('expenses'); navigate('/expenses'); }}>
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
                    <div className="content-grid">
                        {/* Summary Section */}
                        <section className="pending-tasks">
                            <h2>Summary</h2>
                            <div className="task-item">
                                <span className="task-icon">💰</span>
                                <div className="task-info">
                                    <p className="task-label">Total Spending</p>
                                </div>
                                <span className="task-count">₹{totalSpending.toFixed(2)}</span>
                            </div>
                            <div className="task-item">
                                <span className="task-icon">📊</span>
                                <div className="task-info">
                                    <p className="task-label">Monthly Average</p>
                                </div>
                                <span className="task-count">₹{monthlyAverage.toFixed(2)}</span>
                            </div>
                            <div className="task-item">
                                <span className="task-icon">🛒</span>
                                <div className="task-info">
                                    <p className="task-label">Total Transactions</p>
                                </div>
                                <span className="task-count">{expenses.length}</span>
                            </div>
                            <div className="task-item">
                                <span className="task-icon">📈</span>
                                <div className="task-info">
                                    <p className="task-label">Biggest Category</p>
                                </div>
                                <span className="task-count">{biggestCategory}</span>
                            </div>
                        </section>

                        {/* Recent Expenses */}
                        <section className="recent-expenses">
                            <h2>Recent Expenses</h2>
                            {expenses.length === 0 ? (
                                <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                                    No expenses yet. Add one to get started!
                                </p>
                            ) : (
                                <>
                                    <table className="expenses-table">
                                        <thead>
                                            <tr>
                                                <th>Description</th>
                                                <th>Category</th>
                                                <th>Date</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentExpenses.map(expense => (
                                                <tr key={expense.id}>
                                                    <td>{expense.description}</td>
                                                    <td><span className={`badge badge-${expense.categoryBadge}`}>{expense.category}</span></td>
                                                    <td>{expense.date}</td>
                                                    <td>₹{expense.amount.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {expenses.length > 10 && (
                                        <p style={{ color: '#999', textAlign: 'center', padding: '10px', fontSize: '12px' }}>
                                            Showing 10 of {expenses.length} expenses. <button onClick={() => navigate('/expenses')} style={{ color: '#00d4ff', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', fontSize: 'inherit' }}>View all</button>
                                        </p>
                                    )}
                                </>
                            )}
                        </section>
                    </div>

                    {/* Monthly Budget Section */}
                    <section className="budget-section">
                        <div className="budget-header">
                            <h2>💰 Monthly Budget Tracker</h2>
                            <button
                                className="btn-set-budget"
                                onClick={() => setShowBudgetForm(!showBudgetForm)}
                            >
                                {currentMonthBudget ? '✏️ Edit Budget' : '➕ Set Budget'}
                            </button>
                        </div>

                        {showBudgetForm && (
                            <div className="budget-form">
                                <input
                                    type="number"
                                    placeholder="Enter monthly budget amount (₹)"
                                    value={budgetAmount}
                                    onChange={(e) => setBudgetAmount(e.target.value)}
                                    step="0.01"
                                    min="0"
                                />
                                <button className="btn-confirm" onClick={handleSetBudget}>✓ Set</button>
                                <button
                                    className="btn-cancel-form"
                                    onClick={() => {
                                        setShowBudgetForm(false);
                                        setBudgetAmount('');
                                    }}
                                >
                                    ✕ Cancel
                                </button>
                            </div>
                        )}

                        {currentMonthBudget ? (
                            <div className="budget-info">
                                <div className="budget-stats">
                                    <div className="stat-card">
                                        <span className="stat-label">Monthly Budget</span>
                                        <span className="stat-value">₹{currentMonthBudget.toFixed(2)}</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-label">Amount Spent</span>
                                        <span className="stat-value spent">₹{currentMonthSpent.toFixed(2)}</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-label">Remaining</span>
                                        <span className={`stat-value ${remaining! >= 0 ? 'positive' : 'negative'}`}>
                                            ₹{remaining!.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="budget-progress">
                                    <div className="progress-label">
                                        <span>Budget Used: {budgetPercentage.toFixed(1)}%</span>
                                        <span className={budgetPercentage > 100 ? 'over-budget' : ''}>
                                            {budgetPercentage > 100 ? '⚠️ Over Budget!' : '✓ On Track'}
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className={`progress-fill ${budgetPercentage > 100 ? 'danger' : budgetPercentage > 75 ? 'warning' : 'success'}`}
                                            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="progress-info">
                                        You have <strong>₹{remaining! >= 0 ? remaining!.toFixed(2) : Math.abs(remaining!).toFixed(2)}</strong> {remaining! >= 0 ? 'left to spend' : 'overspent'} this month.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="budget-empty">
                                <p>📅 No budget set for this month yet.</p>
                                <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>Set a budget to track your spending and manage your finances better.</p>
                            </div>
                        )}
                    </section>

                    {/* Quick Access */}
                    <section className="quick-access">
                        <h2>Quick Access</h2>
                        <div className="quick-buttons">
                            <button className="quick-btn btn-expense" onClick={() => navigate('/add-expense')}>
                                <span className="btn-icon">➕</span>
                                <span className="btn-text">Add Expense</span>
                            </button>
                            <button className="quick-btn btn-receipt" onClick={() => navigate('/receipt')}>
                                <span className="btn-icon">📸</span>
                                <span className="btn-text">Receipt Photo</span>
                            </button>
                            <button className="quick-btn btn-report" onClick={() => navigate('/report')}>
                                <span className="btn-icon">📋</span>
                                <span className="btn-text">View Report</span>
                            </button>
                            <button className="quick-btn btn-trip" onClick={() => navigate('/trips')}>
                                <span className="btn-icon">✈️</span>
                                <span className="btn-text">Plan Trip</span>
                            </button>
                        </div>
                    </section>

                    {/* Spending Analysis */}
                    <section className="monthly-report">
                        <h2>Spending Analysis</h2>
                        <div className="charts-container">
                            <div className="chart">
                                <h3>Monthly Spending Trend (Last 6 Months)</h3>
                                <div className="chart-placeholder">
                                    {monthlyTrend.map((value, index) => (
                                        <div
                                            key={index}
                                            className="bar"
                                            style={{ height: maxMonthlyValue > 0 ? (value / maxMonthlyValue) * 100 + '%' : '5%' }}
                                            title={`₹${value.toFixed(2)}`}
                                        ></div>
                                    ))}
                                </div>
                                <div className="chart-labels">{monthLabels.join(' - ')}</div>
                            </div>
                            <div className="chart">
                                <h3>Spending by Category</h3>
                                <div className="chart-placeholder">
                                    {categoryValues.map((value, index) => (
                                        <div
                                            key={index}
                                            className="bar"
                                            style={{ height: maxCategoryValue > 0 ? (value / maxCategoryValue) * 100 + '%' : '5%' }}
                                            title={`${categories[index]}: ₹${value.toFixed(2)}`}
                                        ></div>
                                    ))}
                                </div>
                                <div className="chart-labels">Food - Utilities - Transport - Entertainment - Other</div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useExpenses } from '../context/ExpensesContext';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import '../styles/SettingsPage.css';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const { clearExpenses } = useExpenses();
    const [activeNav, setActiveNav] = useState('settings');
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'delete-all' | 'logout' | null>(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
                <h2>Please log in first</h2>
                <button onClick={() => navigate('/login')}>Go to Login</button>
            </div>
        );
    }

    const handleDeleteAllExpenses = () => {
        setConfirmAction('delete-all');
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (confirmAction === 'delete-all') {
            clearExpenses();
            setShowConfirm(false);
            setConfirmAction(null);
            alert('All expenses have been deleted!');
        }
    };

    const handleCancelConfirm = () => {
        setShowConfirm(false);
        setConfirmAction(null);
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
                        <div className={`nav-item ${activeNav === 'home' ? 'active' : ''}`} onClick={() => { setActiveNav('home'); navigate('/dashboard'); }}>
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
                        <div className={`nav-item ${activeNav === 'settings' ? 'active' : ''}`} onClick={() => setActiveNav('settings')}>
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
                    <div className="settings-header">
                        <h1>Settings</h1>
                    </div>

                    {/* Settings Sections */}
                    <div className="settings-sections">
                        {/* Account Settings */}
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <h2>👤 Account Settings</h2>
                            </div>
                            <div className="settings-card-body">
                                <div className="setting-item">
                                    <div className="setting-label">
                                        <span className="label-title">Email Address</span>
                                        <span className="label-value">{user.email}</span>
                                    </div>
                                    <button
                                        className="btn-change"
                                        onClick={() => navigate('/edit-profile')}
                                    >
                                        Change
                                    </button>
                                </div>
                                <div className="setting-item">
                                    <div className="setting-label">
                                        <span className="label-title">Full Name</span>
                                        <span className="label-value">{user.firstName} {user.lastName}</span>
                                    </div>
                                    <button
                                        className="btn-change"
                                        onClick={() => navigate('/edit-profile')}
                                    >
                                        Change
                                    </button>
                                </div>
                                <div className="setting-item">
                                    <div className="setting-label">
                                        <span className="label-title">Avatar</span>
                                        <span className="label-value avatar-preview">{user.avatar || '👤'}</span>
                                    </div>
                                    <button
                                        className="btn-change"
                                        onClick={() => navigate('/edit-profile')}
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Privacy & Security */}
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <h2>🔒 Privacy & Security</h2>
                            </div>
                            <div className="settings-card-body">
                                <div className="setting-info">
                                    <p>Your data is stored locally in your browser. No information is shared with external servers.</p>
                                </div>
                                <div className="setting-item">
                                    <div className="setting-label">
                                        <span className="label-title">Data Storage</span>
                                        <span className="label-value">Local Browser Storage</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Management */}
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <h2>📊 Data Management</h2>
                            </div>
                            <div className="settings-card-body">
                                <div className="setting-item danger">
                                    <div className="setting-label">
                                        <span className="label-title">Delete All Expenses</span>
                                        <span className="label-description">This action cannot be undone. All your expenses will be permanently deleted.</span>
                                    </div>
                                    <button
                                        className="btn-danger"
                                        onClick={handleDeleteAllExpenses}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* App Information */}
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <h2>ℹ️ App Information</h2>
                            </div>
                            <div className="settings-card-body">
                                <div className="app-info">
                                    <div className="info-item">
                                        <span className="info-label">App Name</span>
                                        <span className="info-value">Financial Tracker</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Version</span>
                                        <span className="info-value">1.0.0</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Built With</span>
                                        <span className="info-value">React + TypeScript</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Currency</span>
                                        <span className="info-value">₹ Indian Rupee (INR)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Modal */}
                    {showConfirm && (
                        <div className="modal-overlay" onClick={handleCancelConfirm}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <h2>⚠️ Confirm Action</h2>
                                <p>
                                    {confirmAction === 'delete-all'
                                        ? 'Are you sure you want to delete all expenses? This action cannot be undone.'
                                        : 'Are you sure you want to logout?'}
                                </p>
                                <div className="modal-actions">
                                    <button
                                        className="btn-cancel"
                                        onClick={handleCancelConfirm}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn-confirm"
                                        onClick={handleConfirmDelete}
                                    >
                                        {confirmAction === 'delete-all' ? '🗑️ Delete All' : '🚪 Logout'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default SettingsPage;

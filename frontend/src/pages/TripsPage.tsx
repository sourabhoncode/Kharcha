import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import '../styles/TripsPage.css';

interface Trip {
    id: string;
    destination: string;
    startDate: string;
    endDate: string;
    budget: number;
    description: string;
}

const TripsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const [activeNav, setActiveNav] = useState('trips');
    const [trips, setTrips] = useState<Trip[]>(() => {
        const saved = localStorage.getItem('trips');
        return saved ? JSON.parse(saved) : [];
    });
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        description: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'budget-asc' | 'budget-desc'>('date-asc');
    const [selectedTrips, setSelectedTrips] = useState<Set<string>>(new Set());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<Trip | null>(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const filteredTrips = useMemo(() => {
        let filtered = trips.filter(trip =>
            trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date-asc':
                    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                case 'date-desc':
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                case 'budget-asc':
                    return a.budget - b.budget;
                case 'budget-desc':
                    return b.budget - a.budget;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [trips, searchTerm, sortBy]);

    const handleAddTrip = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.destination && formData.startDate && formData.endDate && formData.budget) {
            const newTrip: Trip = {
                id: Date.now().toString(),
                destination: formData.destination,
                startDate: formData.startDate,
                endDate: formData.endDate,
                budget: parseFloat(formData.budget),
                description: formData.description
            };
            const updatedTrips = [...trips, newTrip];
            setTrips(updatedTrips);
            localStorage.setItem('trips', JSON.stringify(updatedTrips));
            setFormData({ destination: '', startDate: '', endDate: '', budget: '', description: '' });
            setShowForm(false);
        }
    };

    const handleDeleteTrip = (id: string) => {
        if (window.confirm('Delete this trip?')) {
            const updatedTrips = trips.filter(trip => trip.id !== id);
            setTrips(updatedTrips);
            localStorage.setItem('trips', JSON.stringify(updatedTrips));
            setSelectedTrips(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const handleToggleTrip = (id: string) => {
        setSelectedTrips(prev => {
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
        if (selectedTrips.size === filteredTrips.length) {
            setSelectedTrips(new Set());
        } else {
            setSelectedTrips(new Set(filteredTrips.map(trip => trip.id)));
        }
    };

    const handleDeleteSelected = () => {
        if (selectedTrips.size === 0) return;
        if (window.confirm(`Delete ${selectedTrips.size} trip(s)?`)) {
            const updatedTrips = trips.filter(trip => !selectedTrips.has(trip.id));
            setTrips(updatedTrips);
            localStorage.setItem('trips', JSON.stringify(updatedTrips));
            setSelectedTrips(new Set());
        }
    };

    const handleStartEdit = (trip: Trip) => {
        setEditingId(trip.id);
        setEditData(trip);
    };

    const handleSaveEdit = () => {
        if (editingId && editData) {
            const updatedTrips = trips.map(trip =>
                trip.id === editingId ? editData : trip
            );
            setTrips(updatedTrips);
            localStorage.setItem('trips', JSON.stringify(updatedTrips));
            setEditingId(null);
            setEditData(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData(null);
    };

    const calculateDays = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    };

    const totalBudget = filteredTrips.reduce((sum, trip) => sum + trip.budget, 0);
    const allTripsCount = trips.length;

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
                    <div className={`nav-item ${activeNav === 'trips' ? 'active' : ''}`} onClick={() => setActiveNav('trips')}>
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

            <main className="main-content">
                <div className="trips-header">
                    <div>
                        <h1>✈️ Trips</h1>
                        <p className="header-subtitle">Plan and manage your adventures</p>
                    </div>
                    <button
                        className="btn-add-trip"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '✕ Cancel' : '+ Plan Trip'}
                    </button>
                </div>

                {showForm && (
                    <form className="add-trip-form" onSubmit={handleAddTrip}>
                        <h3>Plan Your Next Adventure</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Destination *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Paris, France"
                                    value={formData.destination}
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Budget (₹) *</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    step="0.01"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Start Date *</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Date *</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea
                                placeholder="Trip details, things to do, notes..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <button type="submit" className="btn-submit">Create Trip</button>
                    </form>
                )}

                {trips.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">✈️</div>
                        <h2>No trips planned yet</h2>
                        <p>Start planning your next adventure</p>
                        <button className="btn-add-trip" onClick={() => setShowForm(true)}>
                            Plan Your First Trip
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Summary Stats */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">🗺️</div>
                                <div className="stat-content">
                                    <div className="stat-label">Total Trips</div>
                                    <div className="stat-value">{allTripsCount}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-content">
                                    <div className="stat-label">Total Budget</div>
                                    <div className="stat-value">₹{totalBudget.toFixed(0)}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-content">
                                    <div className="stat-label">Average Per Trip</div>
                                    <div className="stat-value">₹{(totalBudget / allTripsCount).toFixed(0)}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📅</div>
                                <div className="stat-content">
                                    <div className="stat-label">Upcoming</div>
                                    <div className="stat-value">{trips.filter(t => new Date(t.endDate) > new Date()).length}</div>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="controls-section">
                            <div className="search-container">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search trips..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="sort-select">
                                <option value="date-asc">📅 Earliest First</option>
                                <option value="date-desc">📅 Latest First</option>
                                <option value="budget-asc">💰 Low Budget First</option>
                                <option value="budget-desc">💰 High Budget First</option>
                            </select>
                            {filteredTrips.length > 0 && (
                                <button
                                    className="btn-select-all"
                                    onClick={handleSelectAll}
                                >
                                    {selectedTrips.size === filteredTrips.length ? '✓ All Selected' : 'Select All'}
                                </button>
                            )}
                            {selectedTrips.size > 0 && (
                                <button className="btn-delete-selected" onClick={handleDeleteSelected}>
                                    🗑️ Delete ({selectedTrips.size})
                                </button>
                            )}
                        </div>

                        {/* Trips Grid */}
                        <div className="trips-grid">
                            {filteredTrips.map(trip => (
                                <div key={trip.id} className={`trip-card ${selectedTrips.has(trip.id) ? 'selected' : ''}`}>
                                    {editingId === trip.id ? (
                                        <div className="edit-mode">
                                            <h4>Edit Trip</h4>
                                            <div className="edit-form">
                                                <div className="edit-form-row">
                                                    <div className="form-group">
                                                        <label>Destination</label>
                                                        <input
                                                            type="text"
                                                            value={editData?.destination || ''}
                                                            onChange={(e) => editData && setEditData({ ...editData, destination: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Budget</label>
                                                        <input
                                                            type="number"
                                                            value={editData?.budget || ''}
                                                            onChange={(e) => editData && setEditData({ ...editData, budget: parseFloat(e.target.value) })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="edit-form-row">
                                                    <div className="form-group">
                                                        <label>Start Date</label>
                                                        <input
                                                            type="date"
                                                            value={editData?.startDate || ''}
                                                            onChange={(e) => editData && setEditData({ ...editData, startDate: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>End Date</label>
                                                        <input
                                                            type="date"
                                                            value={editData?.endDate || ''}
                                                            onChange={(e) => editData && setEditData({ ...editData, endDate: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Description</label>
                                                    <textarea
                                                        value={editData?.description || ''}
                                                        onChange={(e) => editData && setEditData({ ...editData, description: e.target.value })}
                                                        rows={2}
                                                    />
                                                </div>
                                                <div className="edit-actions">
                                                    <button type="button" onClick={handleSaveEdit} className="btn-save">
                                                        💾 Save
                                                    </button>
                                                    <button type="button" onClick={handleCancelEdit} className="btn-cancel">
                                                        ✕ Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="trip-header">
                                                <div className="trip-title-section">
                                                    <h3>{trip.destination}</h3>
                                                    <p className="trip-dates">
                                                        {new Date(trip.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTrips.has(trip.id)}
                                                    onChange={() => handleToggleTrip(trip.id)}
                                                    className="trip-checkbox"
                                                />
                                            </div>
                                            <div className="trip-body">
                                                <div className="trip-detail">
                                                    <span className="detail-icon">💰</span>
                                                    <div>
                                                        <div className="detail-label">Budget</div>
                                                        <div className="detail-value">₹{trip.budget.toFixed(2)}</div>
                                                    </div>
                                                </div>
                                                <div className="trip-detail">
                                                    <span className="detail-icon">📅</span>
                                                    <div>
                                                        <div className="detail-label">Duration</div>
                                                        <div className="detail-value">{calculateDays(trip.startDate, trip.endDate)} days</div>
                                                    </div>
                                                </div>
                                                {trip.description && (
                                                    <div className="trip-description">
                                                        <p>{trip.description}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="trip-footer">
                                                <button
                                                    className="btn-icon btn-edit-trip"
                                                    onClick={() => handleStartEdit(trip)}
                                                    title="Edit trip"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn-icon btn-delete-trip"
                                                    onClick={() => handleDeleteTrip(trip.id)}
                                                    title="Delete trip"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {filteredTrips.length === 0 && (
                            <div className="no-results">
                                <p>No trips found matching your search</p>
                            </div>
                        )}
                    </>
                )}
            </main>
            </div>
            <Footer />
        </div>
    );
};

export default TripsPage;

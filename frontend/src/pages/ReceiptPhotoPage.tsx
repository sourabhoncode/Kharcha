import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useExpenses } from '../context/ExpensesContext';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import '../styles/ReceiptPhoto.css';

interface ExtractedData {
    description: string;
    amount: string;
    category: string;
    date: string;
}

const ReceiptPhotoPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const { addExpense } = useExpenses();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const [activeNav, setActiveNav] = useState('receipt');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<ExtractedData>({
        description: '',
        amount: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0]
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadMethod, setUploadMethod] = useState<'upload' | 'camera' | null>(null);
    const [savedReceipts, setSavedReceipts] = useState<Array<{ id: string; image: string; data: ExtractedData; timestamp: string }>>(() => {
        const saved = localStorage.getItem('savedReceipts');
        return saved ? JSON.parse(saved) : [];
    });

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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target?.result as string;
                setUploadedImage(imageData);
                simulateOCR(imageData);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target?.result as string;
                setUploadedImage(imageData);
                simulateOCR(imageData);
            };
            reader.readAsDataURL(file);
        }
    };

    const simulateOCR = (imageData: string) => {
        setIsProcessing(true);
        // Simulate OCR processing delay
        setTimeout(() => {
            // Mock data extraction - in a real app, you'd call an OCR API
            const mockAmounts = ['₹45', '₹120', '₹350', '₹89', '₹250', '₹500', '₹150'];
            const mockDescriptions = ['Groceries', 'Restaurant Meal', 'Coffee', 'Shopping', 'Gas', 'Entertainment', 'Supplies'];
            const mockCategories = ['food', 'food', 'food', 'other', 'transport', 'entertainment', 'utilities'];

            const randomIndex = Math.floor(Math.random() * mockAmounts.length);

            setExtractedData({
                description: mockDescriptions[randomIndex],
                amount: mockAmounts[randomIndex].replace('₹', ''),
                category: mockCategories[randomIndex],
                date: new Date().toISOString().split('T')[0]
            });
            setIsProcessing(false);
        }, 1500);
    };

    const handleDataChange = (field: keyof ExtractedData, value: string) => {
        setExtractedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveReceipt = () => {
        if (!uploadedImage || !extractedData.description || !extractedData.amount) {
            alert('Please fill in all required fields');
            return;
        }

        const newReceipt = {
            id: Date.now().toString(),
            image: uploadedImage,
            data: extractedData,
            timestamp: new Date().toLocaleString()
        };

        const updated = [newReceipt, ...savedReceipts];
        setSavedReceipts(updated);
        localStorage.setItem('savedReceipts', JSON.stringify(updated));

        // Reset form
        setUploadedImage(null);
        setUploadMethod(null);
        setExtractedData({
            description: '',
            amount: '',
            category: 'food',
            date: new Date().toISOString().split('T')[0]
        });

        alert('Receipt saved successfully!');
    };

    const handleAddExpenseFromReceipt = (receipt: typeof savedReceipts[0]) => {
        try {
            addExpense({
                id: Date.now().toString(),
                description: receipt.data.description,
                category: receipt.data.category,
                amount: parseFloat(receipt.data.amount),
                date: receipt.data.date,
                categoryBadge: receipt.data.category as 'food' | 'utilities' | 'transport' | 'entertainment' | 'other'
            });
            alert('Expense added from receipt!');
        } catch (error) {
            alert('Error adding expense');
        }
    };

    const handleDeleteReceipt = (id: string) => {
        const updated = savedReceipts.filter(r => r.id !== id);
        setSavedReceipts(updated);
        localStorage.setItem('savedReceipts', JSON.stringify(updated));
    };

    const categories = [
        { value: 'food', label: 'Food', emoji: '🍔' },
        { value: 'utilities', label: 'Utilities', emoji: '💡' },
        { value: 'transport', label: 'Transport', emoji: '🚗' },
        { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
        { value: 'other', label: 'Other', emoji: '📦' }
    ];

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
                        <div className={`nav-item ${activeNav === 'receipt' ? 'active' : ''}`} onClick={() => setActiveNav('receipt')}>
                            <span className="nav-icon">📸</span>
                            <span className="nav-label">Receipts</span>
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
                    <div className="receipt-header">
                        <h1>Receipt Photo Scanner</h1>
                        <p className="receipt-subtitle">Capture or upload receipts to automatically extract expense details</p>
                    </div>

                    {!uploadedImage ? (
                        <>
                            {uploadMethod === null && (
                                <div className="upload-method-selector">
                                    <div className="method-card" onClick={() => setUploadMethod('camera')}>
                                        <div className="method-icon">📷</div>
                                        <h3>Take Photo</h3>
                                        <p>Capture a receipt using your device camera</p>
                                    </div>
                                    <div className="method-card" onClick={() => setUploadMethod('upload')}>
                                        <div className="method-icon">📁</div>
                                        <h3>Upload Image</h3>
                                        <p>Select an existing image from your device</p>
                                    </div>
                                </div>
                            )}

                            {uploadMethod === 'camera' && (
                                <div className="upload-section">
                                    <div className="upload-area">
                                        <input
                                            ref={cameraInputRef}
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleCameraCapture}
                                            style={{ display: 'none' }}
                                        />
                                        <button
                                            className="upload-btn camera-btn"
                                            onClick={() => cameraInputRef.current?.click()}
                                        >
                                            <span className="btn-icon">📷</span>
                                            <span className="btn-text">Capture Receipt Photo</span>
                                        </button>
                                    </div>
                                    <button
                                        className="back-btn"
                                        onClick={() => setUploadMethod(null)}
                                    >
                                        ← Back
                                    </button>
                                </div>
                            )}

                            {uploadMethod === 'upload' && (
                                <div className="upload-section">
                                    <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            style={{ display: 'none' }}
                                        />
                                        <div className="upload-content">
                                            <span className="upload-icon">📁</span>
                                            <h3>Drop your receipt here</h3>
                                            <p>or click to browse</p>
                                        </div>
                                    </div>
                                    <button
                                        className="back-btn"
                                        onClick={() => setUploadMethod(null)}
                                    >
                                        ← Back
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="receipt-preview-section">
                            <div className="receipt-preview">
                                <img src={uploadedImage} alt="Receipt" className="receipt-image" />
                            </div>

                            {isProcessing ? (
                                <div className="processing-indicator">
                                    <div className="spinner"></div>
                                    <p>Scanning receipt...</p>
                                </div>
                            ) : (
                                <div className="extracted-data-form">
                                    <h3>Extracted Details</h3>

                                    <div className="form-group">
                                        <label>Description *</label>
                                        <input
                                            type="text"
                                            value={extractedData.description}
                                            onChange={(e) => handleDataChange('description', e.target.value)}
                                            placeholder="Item or service description"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Amount (₹) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={extractedData.amount}
                                            onChange={(e) => handleDataChange('amount', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            value={extractedData.category}
                                            onChange={(e) => handleDataChange('category', e.target.value)}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.value} value={cat.value}>
                                                    {cat.emoji} {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            value={extractedData.date}
                                            onChange={(e) => handleDataChange('date', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            className="btn-save-receipt"
                                            onClick={handleSaveReceipt}
                                        >
                                            💾 Save Receipt
                                        </button>
                                        <button
                                            className="btn-cancel"
                                            onClick={() => {
                                                setUploadedImage(null);
                                                setUploadMethod(null);
                                                setExtractedData({
                                                    description: '',
                                                    amount: '',
                                                    category: 'food',
                                                    date: new Date().toISOString().split('T')[0]
                                                });
                                            }}
                                        >
                                            ✕ Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Saved Receipts */}
                    {savedReceipts.length > 0 && (
                        <div className="saved-receipts-section">
                            <h2>Saved Receipts ({savedReceipts.length})</h2>
                            <div className="receipts-grid">
                                {savedReceipts.map(receipt => (
                                    <div key={receipt.id} className="receipt-card">
                                        <div className="receipt-card-image">
                                            <img src={receipt.image} alt="Receipt" />
                                        </div>
                                        <div className="receipt-card-info">
                                            <h4>{receipt.data.description}</h4>
                                            <p className="receipt-amount">₹{parseFloat(receipt.data.amount).toFixed(2)}</p>
                                            <p className="receipt-category">{receipt.data.category}</p>
                                            <p className="receipt-date">{receipt.data.date}</p>
                                            <p className="receipt-time">{receipt.timestamp}</p>
                                        </div>
                                        <div className="receipt-card-actions">
                                            <button
                                                className="btn-add-expense"
                                                onClick={() => handleAddExpenseFromReceipt(receipt)}
                                            >
                                                ➕ Add Expense
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => {
                                                    if (window.confirm('Delete this receipt?')) {
                                                        handleDeleteReceipt(receipt.id);
                                                    }
                                                }}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default ReceiptPhotoPage;

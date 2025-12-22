import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Logo from './Logo';
import '../styles/Footer.css';

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useUser();
    const currentYear = new Date().getFullYear();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-section footer-branding">
                    <div className="footer-logo-section">
                        <Logo size="small" />
                        <div className="footer-brand-text">
                            <h3>Your Kharcha</h3>
                            <p>Track your finances smartly</p>
                        </div>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Features</h4>
                    <ul>
                        <li><button className="footer-link" onClick={() => navigate('/expenses')}>Expense Tracking</button></li>
                        <li><button className="footer-link" onClick={() => navigate('/trips')}>Trip Planning</button></li>
                        <li><button className="footer-link" onClick={() => navigate('/dashboard')}>Dashboard Analytics</button></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Account</h4>
                    <ul>
                        <li><button className="footer-link" onClick={() => navigate('/edit-profile')}>Edit Profile</button></li>
                        <li><button className="footer-link" onClick={() => navigate('/settings')}>Settings</button></li>
                        <li><button className="footer-link" onClick={handleLogout}>Logout</button></li>
                    </ul>
                </div>

                <div className="footer-copyright">
                    <p>&copy; {currentYear} Your Kharcha. All rights reserved.</p>
                    <p className="footer-creator">Created by <span className="creator-name">Sourabh Verma</span> 💙 </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React from 'react';
import Logo from './Logo';
import '../styles/Footer.css';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

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
                        <li><a href="#expenses">Expense Tracking</a></li>
                        <li><a href="#trips">Trip Planning</a></li>
                        <li><a href="#dashboard">Dashboard Analytics</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Account</h4>
                    <ul>
                        <li><a href="#profile">Edit Profile</a></li>
                        <li><a href="#settings">Settings</a></li>
                        <li><a href="#logout">Logout</a></li>
                    </ul>
                </div>

                <div className="footer-copyright">
                    <p>&copy; {currentYear} Your Kharcha. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <nav className="home-nav">
                <div className="nav-brand">💰 Financial Tracker</div>
                <div className="nav-buttons">
                    <button className="nav-btn login-btn" onClick={() => navigate('/login')}>
                        Login
                    </button>
                    <button className="nav-btn signup-btn" onClick={() => navigate('/register')}>
                        Sign Up
                    </button>
                </div>
            </nav>

            <main className="home-main">
                <section className="hero">
                    <div className="hero-content">
                        <h1>Manage Your Money Effortlessly</h1>
                        <p>Take control of your finances with our simple and powerful expense tracker</p>
                        <div className="hero-buttons">
                            <button className="hero-btn primary-btn" onClick={() => navigate('/register')}>
                                Get Started Now
                            </button>
                            <button className="hero-btn secondary-btn" onClick={() => navigate('/login')}>
                                Already a Member? Login
                            </button>
                        </div>
                    </div>
                </section>

                <section className="features">
                    <h2>Why Choose Us?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>Track Expenses</h3>
                            <p>Easily record and categorize your daily expenses to understand your spending habits</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📈</div>
                            <h3>Visual Reports</h3>
                            <p>Get insights with beautiful charts and graphs showing your spending patterns</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💳</div>
                            <h3>Budget Planning</h3>
                            <p>Set budgets for different categories and get alerts when you're close to limits</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✈️</div>
                            <h3>Trip Tracking</h3>
                            <p>Plan and track expenses for your trips separately to manage travel budgets</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⚙️</div>
                            <h3>Custom Categories</h3>
                            <p>Create custom expense categories that match your lifestyle and spending needs</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Secure & Private</h3>
                            <p>Your financial data is encrypted and stored securely with complete privacy</p>
                        </div>
                    </div>
                </section>

                <section className="how-it-works">
                    <h2>How It Works</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Create Account</h3>
                            <p>Sign up with your email and password in less than a minute</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Add Expenses</h3>
                            <p>Record your daily expenses with amount, category, and date</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Analyze Spending</h3>
                            <p>View detailed reports and charts to understand your finances better</p>
                        </div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <h3>Optimize Budget</h3>
                            <p>Make informed decisions to improve your financial health</p>
                        </div>
                    </div>
                </section>

                <section className="cta">
                    <h2>Ready to Take Control of Your Finances?</h2>
                    <p>Join thousands of users who are managing their money smarter</p>
                    <button className="cta-btn" onClick={() => navigate('/register')}>
                        Start Your Free Account Today
                    </button>
                </section>
            </main>

            <footer className="home-footer">
                <p>&copy; 2024 Financial Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;

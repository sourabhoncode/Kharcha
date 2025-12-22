import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/AuthPages.css';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);
            // Simulate API call - Extract first and last name from email
            setTimeout(() => {
                const nameParts = email.split('@')[0].split('.');
                const userData = {
                    email: email,
                    firstName: nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'User',
                    lastName: nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : '',
                };
                setUser(userData);
                setIsLoading(false);
                navigate('/dashboard');
            }, 1500);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Login to access your financial tracker</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <button type="submit" className="auth-btn" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: '#00d4ff', cursor: 'pointer', textDecoration: 'underline' }}>Sign Up</button></p>
                    <p><button onClick={() => { }} style={{ background: 'none', border: 'none', color: '#00d4ff', cursor: 'pointer', textDecoration: 'underline' }}>Forgot Password?</button></p>
                </div>
            </div>

            <div className="auth-sidebar">
                <div className="sidebar-content">
                    <h2>💰 Financial Tracker</h2>
                    <p>Manage your money smarter and achieve your financial goals</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

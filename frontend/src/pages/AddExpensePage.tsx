import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses, Expense } from '../context/ExpensesContext';
import '../styles/AddExpense.css';

const AddExpensePage: React.FC = () => {
    const navigate = useNavigate();
    const { addExpense } = useExpenses();
    const [formData, setFormData] = useState({
        description: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        amount: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const categories = [
        { value: 'food', label: 'Food', badge: 'food' },
        { value: 'utilities', label: 'Utilities', badge: 'utilities' },
        { value: 'transport', label: 'Transport', badge: 'transport' },
        { value: 'entertainment', label: 'Entertainment', badge: 'entertainment' },
        { value: 'other', label: 'Other', badge: 'other' }
    ];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);

            const categoryObj = categories.find(c => c.value === formData.category);
            const newExpense: Expense = {
                id: Date.now().toString(),
                description: formData.description,
                category: categoryObj?.label || formData.category,
                date: formData.date,
                amount: parseFloat(formData.amount),
                categoryBadge: formData.category as 'food' | 'utilities' | 'transport' | 'entertainment' | 'other'
            };

            addExpense(newExpense);
            setIsLoading(false);
            navigate('/dashboard');
        }
    };

    return (
        <div className="add-expense-container">
            <div className="add-expense-card">
                <div className="add-expense-header">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
                    <h1>Add New Expense</h1>
                    <div style={{ width: '40px' }}></div>
                </div>

                <form className="add-expense-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder="e.g., Grocery Shopping"
                            value={formData.description}
                            onChange={handleChange}
                            className={errors.description ? 'input-error' : ''}
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={errors.category ? 'input-error' : ''}
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <span className="error-message">{errors.category}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="amount">Amount (₹) *</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={formData.amount}
                                onChange={handleChange}
                                className={errors.amount ? 'input-error' : ''}
                            />
                            {errors.amount && <span className="error-message">{errors.amount}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date *</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className={errors.date ? 'input-error' : ''}
                        />
                        {errors.date && <span className="error-message">{errors.date}</span>}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard')}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? 'Adding Expense...' : 'Add Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpensePage;

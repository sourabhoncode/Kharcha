import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/EditProfile.css';

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useUser();
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        avatar: user?.avatar || '👤'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const emojis = ['👤', '👨', '👩', '🧑', '😊', '😎', '🤓', '🙂', '😌', '🧔', '👨‍🦱', '👩‍🦰', '🧑‍🦲'];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim() || !formData.email.includes('@')) {
            newErrors.email = 'Valid email is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setFormData(prev => ({
            ...prev,
            avatar: emoji
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            updateUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                avatar: formData.avatar
            });
            navigate('/dashboard');
        }
    };

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-card">
                <div className="edit-profile-header">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
                    <h1>Edit Profile</h1>
                    <div style={{ width: '40px' }}></div>
                </div>

                <form className="edit-profile-form" onSubmit={handleSubmit}>
                    <div className="avatar-section">
                        <h3>Select Avatar</h3>
                        <div className="emoji-grid">
                            {emojis.map(emoji => (
                                <button
                                    key={emoji}
                                    type="button"
                                    className={`emoji-btn ${formData.avatar === emoji ? 'selected' : ''}`}
                                    onClick={() => handleEmojiSelect(emoji)}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                        <div className="selected-avatar">
                            <span className="avatar-display">{formData.avatar}</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={errors.firstName ? 'input-error' : ''}
                        />
                        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={errors.lastName ? 'input-error' : ''}
                        />
                        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;

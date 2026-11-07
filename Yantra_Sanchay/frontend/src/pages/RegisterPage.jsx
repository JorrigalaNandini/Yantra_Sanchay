import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { authService, offlineAuthService } from '../services';
import { getDashboardPath, normalizeRole } from '../components/ProtectedRoute';
import './RegisterPage.css';

const resolveRegisterRole = () => {
    const stored = localStorage.getItem('selectedRole');
    const normalized = normalizeRole(stored);

    if (normalized === 'machinery_provider') {
        return 'machinery_provider';
    }

    return 'farmer';
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const { translate } = useLanguage();
    const [role, setRole] = useState(resolveRegisterRole);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        location: {
            latitude: null,
            longitude: null,
            village: '',
            district: '',
            state: '',
            accuracy: null,
        },
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationDetected, setLocationDetected] = useState(false);

    // Auto-detect location on component mount
    useEffect(() => {
        if (role === 'farmer') {
            detectLocation();
        }
    }, [role]);

    const detectLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude, accuracy } = position.coords;

                    // Update location in formData
                    setFormData((prev) => ({
                        ...prev,
                        location: {
                            ...prev.location,
                            latitude,
                            longitude,
                            accuracy,
                        },
                    }));

                    // Try to get address from coordinates using reverse geocoding
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();

                        setFormData((prev) => ({
                            ...prev,
                            location: {
                                ...prev.location,
                                village: data.address?.village || data.address?.town || '',
                                district: data.address?.county || '',
                                state: data.address?.state || '',
                            },
                        }));
                    } catch (err) {
                        console.log('Could not get location details');
                    }

                    setLocationDetected(true);
                    setLocationLoading(false);
                },
                (error) => {
                    setError(`Location error: ${error.message}`);
                    setLocationLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser');
            setLocationLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('location_')) {
            const locationField = name.replace('location_', '');
            setFormData((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    [locationField]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name || !formData.phone || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (role === 'machinery_provider' && !formData.email) {
            setError('Email is required for machinery providers');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.register({
                name: formData.name,
                email: formData.email || undefined,
                phone: formData.phone,
                password: formData.password,
                role,
                preferredLanguage: 'english',
                location: role === 'farmer' ? formData.location : undefined,
            });

            const data = response.data;

            if (data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                localStorage.setItem('loginMode', 'online');
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', data.data.user.role);

                await offlineAuthService.saveUserOffline(
                    data.data.user,
                    formData.password
                );

                window.dispatchEvent(new Event('authChange'));
                navigate(getDashboardPath(data.data.user));
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-box">
                    <h1>🚜 Yantra Sanchay</h1>
                    <h2>{translate('register')}</h2>

                    <div className="role-selector">
                        <label>
                            <input
                                type="radio"
                                value="farmer"
                                checked={role === 'farmer'}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            {translate('farmer') || 'Farmer'}
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="machinery_provider"
                                checked={role === 'machinery_provider'}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            {translate('provider') || 'Machinery Provider'}
                        </label>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>{translate('name')}</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Full Name"
                            />
                        </div>

                        {role === 'machinery_provider' && (
                            <div className="form-group">
                                <label>{translate('email')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="your@email.com"
                                />
                            </div>
                        )}

                        {role === 'farmer' && formData.email && (
                            <div className="form-group">
                                <label>{translate('email')} (Optional)</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="your@email.com (optional)"
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>{translate('phone') || 'Mobile Number'}</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                placeholder="10-digit mobile number"
                            />
                        </div>

                        {role === 'farmer' && (
                            <>
                                <div className="location-section">
                                    <div className="location-header">
                                        <h3>📍 Your Location</h3>
                                        <button
                                            type="button"
                                            onClick={detectLocation}
                                            disabled={locationLoading}
                                            className="btn-detect-location"
                                        >
                                            {locationLoading ? 'Detecting...' : 'Detect Location'}
                                        </button>
                                    </div>

                                    {locationDetected && (
                                        <div className="location-status">
                                            <p>✅ Location detected successfully</p>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label>Village</label>
                                        <input
                                            type="text"
                                            name="location_village"
                                            value={formData.location.village}
                                            onChange={handleInputChange}
                                            placeholder="Village name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>District</label>
                                        <input
                                            type="text"
                                            name="location_district"
                                            value={formData.location.district}
                                            onChange={handleInputChange}
                                            placeholder="District name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>State</label>
                                        <input
                                            type="text"
                                            name="location_state"
                                            value={formData.location.state}
                                            onChange={handleInputChange}
                                            placeholder="State name"
                                        />
                                    </div>

                                    {formData.location.latitude && (
                                        <div className="location-coordinates">
                                            <small>
                                                📍 Lat: {formData.location.latitude.toFixed(4)}, Lon: {formData.location.longitude.toFixed(4)}
                                                {formData.location.accuracy && <span> (±{Math.round(formData.location.accuracy)}m)</span>}
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label>{translate('password')}</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm {translate('password')}</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? translate('loading') : translate('register')}
                        </button>
                    </form>

                    <div className="register-footer">
                        <p>
                            Already have account? <Link to="/login">{translate('login')}</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

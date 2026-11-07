import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authService } from '../services';
import { useLanguage } from '../context/LanguageContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { offlineAuthService } from '../services/offlineAuthService';
import { getDashboardPath } from '../components/ProtectedRoute';
import './LoginPage.css';

const LoginPage = ({ setUser }) => {
    const navigate = useNavigate();
    const { translate } = useLanguage();
    const { isOnline } = useOnlineStatus();
    const [searchParams] = useSearchParams();

    const urlRole = searchParams.get('role');
    const urlLoginType = searchParams.get('loginType');

    const [selectedRole, setSelectedRole] = useState(
        urlRole === 'officer' ? 'officer' : 'farmer'
    );

    const [loginType, setLoginType] = useState(
        urlLoginType === 'email' || urlRole === 'officer'
            ? 'email'
            : 'username'
    );

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const role = searchParams.get('role');
        const type = searchParams.get('loginType');

        if (role === 'officer') {
            setSelectedRole('officer');
            setLoginType('email');
        } else {
            setSelectedRole('farmer');
            setLoginType('username');
        }

        if (role) {
            localStorage.setItem('selectedRole', role);
        }

        if (type) {
            localStorage.setItem('loginType', type);
        }
    }, [searchParams]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setError('');
    };

    const persistSession = (user, token, mode) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('loginMode', mode);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', user.role);
        window.dispatchEvent(new Event('authChange'));
    };

    const redirectAfterLogin = (user) => {
        navigate(getDashboardPath(user));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            let loginData;

            if (selectedRole === 'farmer') {
                if (
                    !formData.name.trim() ||
                    !formData.phone.trim() ||
                    !formData.password
                ) {
                    setError('Please fill in all farmer login fields.');
                    setLoading(false);
                    return;
                }

                loginData = {
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    password: formData.password
                };
            } else {
                if (!formData.email.trim() || !formData.password) {
                    setError('Please fill in all officer login fields.');
                    setLoading(false);
                    return;
                }

                loginData = {
                    email: formData.email.trim(),
                    password: formData.password
                };
            }

            if (isOnline) {
                try {
                    const response = await authService.login(loginData);

                    if (response?.data?.success) {
                        const user = response.data.data.user;
                        const token = response.data.data.token;

                        await offlineAuthService.saveUserOffline(
                            user,
                            loginData.password
                        );

                        persistSession(user, token, 'online');
                        setUser(user);
                        redirectAfterLogin(user);
                    } else {
                        setError(
                            response?.data?.message ||
                            'Login failed. Please try again.'
                        );
                    }
                } catch (err) {
                    setError(
                        err.response?.data?.message ||
                        'Login failed. Please check your credentials.'
                    );
                }
            } else {
                let offlineResult;

                if (selectedRole === 'farmer') {
                    offlineResult =
                        await offlineAuthService.authenticateOffline(
                            loginData.name,
                            loginData.phone,
                            loginData.password
                        );
                } else {
                    offlineResult =
                        await offlineAuthService.authenticateOfflineByEmail(
                            loginData.email,
                            loginData.password
                        );
                }

                if (offlineResult.success) {
                    const mockToken = 'offline_' + Date.now();

                    persistSession(offlineResult.user, mockToken, 'offline');

                    await offlineAuthService.updateLastLogin(
                        offlineResult.user._id
                    );

                    setUser(offlineResult.user);
                    redirectAfterLogin(offlineResult.user);
                } else {
                    setError(
                        offlineResult.message ||
                        'Offline login failed.'
                    );
                }
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-box">
                    <h1>🚜 Yantra Sanchay</h1>

                    <h2>
                        {selectedRole === 'farmer'
                            ? 'Farmer Login'
                            : 'Officer / Provider Login'}
                    </h2>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div
                        className={`connection-status ${isOnline ? 'online' : 'offline'
                            }`}
                    >
                        <span className="status-dot"></span>

                        <span className="status-text">
                            {isOnline
                                ? '🟢 Online'
                                : '🔴 Offline Mode'}
                        </span>
                    </div>

                    {!isOnline && (
                        <div className="offline-info">
                            <p>
                                You are in offline mode.
                                Login works only if you have
                                logged in before while online.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {selectedRole === 'farmer' ? (
                            <>
                                <div className="form-group">
                                    <label>
                                        {translate('name') || 'Name'}
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Your Name"
                                        autoComplete="username"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        {translate('phone') ||
                                            'Mobile Number'}
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="10-digit mobile number"
                                        maxLength="10"
                                        autoComplete="tel"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="form-group">
                                <label>
                                    {translate('email') ||
                                        'Official Email'}
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="officer@example.gov.in"
                                    autoComplete="email"
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>
                                {translate('password') || 'Password'}
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={loading}
                        >
                            {loading
                                ? translate('loading') ||
                                'Logging in...'
                                : selectedRole === 'farmer'
                                    ? 'Login as Farmer'
                                    : 'Login as Officer / Provider'}
                        </button>
                    </form>

                    <div className="login-footer">
                        {selectedRole === 'farmer' ? (
                            <p>
                                Don't have a farmer account?{' '}
                                <Link to="/register">
                                    Register here
                                </Link>
                            </p>
                        ) : (
                            <p className="officer-note">
                                Machinery providers and officers
                                sign in with the registered email.
                                Admin accounts are issued by
                                government administration.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );


};

export default LoginPage;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Header.css';

const Header = ({ user, setUser }) => {
    const navigate = useNavigate();
    const { language, changeLanguage, translate } = useLanguage();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    🚜 Yantra Sanchay
                </Link>

                <nav className="nav">
                    <Link to="/">{translate('home')}</Link>
                    {user && (
                        <>
                            {user.role === 'farmer' && (
                                <>
                                    <Link to="/find-machinery">{translate('findMachinery')}</Link>
                                    <Link to="/tell-me-what-you-need">{translate('tellMeWhatYouNeed')}</Link>
                                    <Link to="/pooling">{translate('pooling')}</Link>
                                    <Link to="/my-requests">{translate('myRequests')}</Link>
                                    <Link to="/farmer/dashboard">{translate('dashboard')}</Link>
                                </>
                            )}
                            {(user.role === 'machinery_provider' || user.role === 'provider') && (
                                <>
                                    <Link to="/add-machinery">{translate('addMachinery')}</Link>
                                    <Link to="/provider/dashboard">{translate('dashboard')}</Link>
                                </>
                            )}
                            {user.role === 'admin' && <Link to="/admin/dashboard">{translate('adminDashboard')}</Link>}
                        </>
                    )}
                </nav>

                <div className="header-right">
                    <div className="language-selector">
                        <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
                            <option value="english">English</option>
                            <option value="telugu">Telugu</option>
                            <option value="hindi">Hindi</option>
                        </select>
                    </div>

                    {user ? (
                        <div className="user-menu">
                            <span>{user.name}</span>
                            <button onClick={handleLogout}>{translate('logout')}</button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-login">
                                {translate('login')}
                            </Link>
                            <Link to="/register" className="btn-register">
                                {translate('register')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogin = (role) => {
        const loginType = role === 'farmer' ? 'username' : 'email';

        localStorage.setItem('selectedRole', role);
        localStorage.setItem('loginType', loginType);

        navigate(`/login?role=${role}&loginType=${loginType}`);
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="home-page">

            <div className="home-overlay"></div>

            <header className="home-header">
                <button
                    type="button"
                    className="register-btn"
                    onClick={handleRegister}
                >
                    Register
                </button>
            </header>

            <div className="hero-container">

                <div className="hero-left">

                    <div className="badge badge-tech">
                        <span className="badge-dot">●</span>
                        TECHNOLOGY FOR BETTER FARMING
                    </div>

                    <div className="hero-heading">
                        <h1>
                            The right{' '}
                            <span className="highlight-italic">
                                machine.
                            </span>
                        </h1>

                        <h1>
                            Right when{' '}
                            <span className="highlight-white">
                                you need it.
                            </span>
                        </h1>
                    </div>

                    <p className="hero-description">
                        Yantra Sanchay connects farmers with agricultural
                        machinery, local resources, and smart farming
                        solutions — all in one place.
                    </p>

                    <div className="portal-section">
                        <h3 className="portal-title">
                            ACCESS YOUR PORTAL
                        </h3>

                        <div className="portal-buttons">

                            <button
                                type="button"
                                className="portal-btn farmer-btn"
                                onClick={() => handleLogin('farmer')}
                            >
                                <span className="btn-icon">👨‍🌾</span>

                                <span className="btn-content">
                                    <span className="btn-label">
                                        Farmer Login
                                    </span>

                                    <span className="btn-desc">
                                        Login with name & mobile number
                                    </span>
                                </span>

                                <span className="btn-arrow">→</span>
                            </button>

                            <button
                                type="button"
                                className="portal-btn officer-btn"
                                onClick={() => handleLogin('officer')}
                            >
                                <span className="btn-icon">👮</span>

                                <span className="btn-content">
                                    <span className="btn-label">
                                        Officer / Provider Login
                                    </span>

                                    <span className="btn-desc">
                                        Provider or admin email login
                                    </span>
                                </span>

                                <span className="btn-arrow">→</span>
                            </button>

                        </div>
                    </div>
                </div>

                <div className="hero-right">

                    <div className="badge badge-network">
                        <span className="network-dot">●</span>
                        MACHINERY NETWORK ACTIVE
                    </div>

                    <div className="machinery-card-container">

                        <div className="available-section">
                            <div className="available-header">
                                <span className="available-label">
                                    AVAILABLE NEARBY
                                </span>

                                <span className="live-badge">
                                    ● LIVE
                                </span>
                            </div>

                            <h2 className="machinery-title">
                                Farm Machinery
                            </h2>
                        </div>

                        <div className="machinery-cards">

                            <div className="machinery-card featured">
                                <div className="machinery-image">
                                    <div className="tractor-icon">
                                        🚜
                                    </div>
                                </div>

                                <div className="card-details">
                                    <h4 className="machinery-name">
                                        Mahindra 575 DI
                                    </h4>

                                    <p className="machinery-specs">
                                        TRACTOR · 45 HP
                                    </p>

                                    <div className="availability-badge">
                                        <span>●</span> Available
                                    </div>
                                </div>
                            </div>

                            <div className="machinery-mini-card">
                                <div className="mini-icon">🌾</div>

                                <div>
                                    <strong>
                                        Agricultural Equipment
                                    </strong>

                                    <span>
                                        Available through Yantra Sanchay
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div className="cards-counter">
                            <span className="counter-item">
                                <strong>01</strong>
                                <small>FIND</small>
                            </span>

                            <span className="counter-line"></span>

                            <span className="counter-item">
                                <strong>02</strong>
                                <small>SHARE</small>
                            </span>

                            <span className="counter-line"></span>

                            <span className="counter-item">
                                <strong>03</strong>
                                <small>GROW</small>
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            <div className="home-footer">
                <span>🌱</span>
                SMART AGRICULTURE · SHARED RESOURCES · BETTER FARMING
            </div>

        </div>
    );
};

export default HomePage;


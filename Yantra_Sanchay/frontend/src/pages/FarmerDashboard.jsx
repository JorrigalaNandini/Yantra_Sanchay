
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [dashboardStats, setDashboardStats] = useState({
        machineryAvailable: 0,
        myRequests: 0,
        poolingGroups: 0,
        recommendations: 0
    });

    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState('');

    const fetchDashboardStats = async () => {
        try {
            setStatsLoading(true);
            setStatsError('');

            const response = await userService.getDashboard();

            if (response.data.success) {
                const data = response.data.data || {};

                setDashboardStats({
                    machineryAvailable: data.machineryAvailable ?? 0,
                    myRequests: data.myRequests ?? 0,
                    poolingGroups: data.poolingGroups ?? 0,
                    recommendations: data.recommendations ?? 0
                });
            } else {
                setStatsError(
                    response.data.message ||
                    'Unable to load dashboard statistics.'
                );
            }
        } catch (error) {
            console.error(
                'Error loading farmer dashboard statistics:',
                error
            );

            setStatsError(
                error.response?.data?.message ||
                'Unable to load dashboard statistics. Please try again.'
            );
        } finally {
            setStatsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);


    return (
        <div className="farmer-dashboard">

            {/* ================= HEADER ================= */}
            <div className="dashboard-header">

                <div className="welcome-section">
                    <span className="welcome-label">FARMER DASHBOARD</span>

                    <h1>
                        Welcome, {user.name || 'Farmer'}! 👋
                    </h1>

                    <p>
                        Manage your agricultural machinery needs,
                        discover nearby equipment and make farming easier.
                    </p>
                </div>

                <div className="farmer-profile">
                    <div className="profile-icon">
                        {(user.name || 'F').charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <strong>{user.name || 'Farmer'}</strong>
                        <span>Farmer</span>
                    </div>
                </div>

            </div>


            {/* ================= QUICK STATS ================= */}
            <div className="stats-container">

                <div
                    className="stat-card"
                    onClick={() => navigate('/find-machinery')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-icon">🚜</div>
                    <div>
                        <span>Machinery Available</span>

                        <strong>
                            {statsLoading
                                ? '...'
                                : dashboardStats.machineryAvailable}
                        </strong>
                    </div>
                </div>

                <div
                    className="stat-card"
                    onClick={() => navigate('/my-requests')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-icon">📋</div>
                    <div>
                        <span>My Requests</span>

                        <strong>
                            {statsLoading
                                ? '...'
                                : dashboardStats.myRequests}
                        </strong>
                    </div>
                </div>

                <div
                    className="stat-card"
                    onClick={() => navigate('/pooling')}
                    style={{ cursor: 'pointer' }}
                >
                    <div>
                        <span>Pooling Groups</span>

                        <strong>
                            {statsLoading
                                ? '...'
                                : dashboardStats.poolingGroups}
                        </strong>
                    </div>
                </div>

                <div
                    className="stat-card"
                    onClick={() => navigate('/tell-me-what-you-need')}
                    style={{ cursor: 'pointer' }}
                >
                    <div>
                        <span>Recommendations</span>

                        <strong>
                            {statsLoading
                                ? '...'
                                : dashboardStats.recommendations}
                        </strong>
                    </div>
                </div>

            </div>


            {statsError && (
                <div className="dashboard-stats-error">
                    <p>{statsError}</p>
                    <button type="button" onClick={fetchDashboardStats}>
                        Retry
                    </button>
                </div>
            )}


            {/* ================= MAIN SECTION ================= */}
            <div className="dashboard-section">

                <div className="section-heading">
                    <div>
                        <span className="section-label">SERVICES</span>
                        <h2>What would you like to do?</h2>
                    </div>

                    <p>
                        Choose a service to get started
                    </p>
                </div>


                <div className="dashboard-grid">

                    {/* REQUEST MACHINERY */}
                    <div className="card request-machinery-card">

                        <div className="card-top">
                            <div className="card-icon">🚜</div>
                            <span className="card-arrow">→</span>
                        </div>

                        <h3>Request Machinery</h3>

                        <p style={{ color: 'green' }}>
                            Submit a machinery request for your farming
                            needs and find suitable equipment nearby.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/request-machinery')}
                        >
                            Request Now
                            <span>→</span>
                        </button>

                    </div>


                    {/* FIND MACHINERY */}
                    <div className="card machinery-card">

                        <div className="card-top">
                            <div className="card-icon">📍</div>
                            <span className="card-arrow">→</span>
                        </div>

                        <h3>Find Machinery</h3>

                        <p>
                            Search for agricultural machinery
                            available near your location.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/find-machinery')}
                        >
                            Explore Machinery
                            <span>→</span>
                        </button>

                    </div>


                    {/* AI NEEDS */}
                    <div className="card ai-card">

                        <div className="card-top">
                            <div className="card-icon">💬</div>
                            <span className="card-arrow">→</span>
                        </div>

                        <h3>Tell Me What You Need</h3>

                        <p>
                            Describe your farming requirement
                            and receive smart machinery suggestions.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/tell-me-what-you-need')}
                        >
                            Ask AI Assistant
                            <span>→</span>
                        </button>

                    </div>


                    {/* PHOTO ASSESSMENT */}
                    <div className="card photo-card">

                        <div className="card-top">
                            <div className="card-icon">📸</div>
                            <span className="card-arrow">→</span>
                        </div>

                        <h3>Photo Assessment</h3>

                        <p>
                            Upload a farm photo and get
                            intelligent machinery recommendations.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/farm-assessment')}
                        >
                            Upload Photo
                            <span>→</span>
                        </button>

                    </div>


                    {/* MACHINERY POOLING */}
                    <div className="card pooling-card">

                        <div className="card-top">
                            <div className="card-icon">🤝</div>
                            <span className="card-arrow">→</span>
                        </div>

                        <h3>Machinery Pooling</h3>

                        <p>
                            Connect with nearby farmers and
                            share machinery costs.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/pooling')}
                        >
                            View Pooling
                            <span>→</span>
                        </button>

                    </div>


                    {/* MY REQUESTS */}
                    <div
                        className="card requests-card"
                        onClick={() => navigate('/my-requests')}
                        role="button"
                        tabIndex={0}
                    >

                        <div className="card-top">
                            <div className="card-icon">📋</div>
                            <span className="card-arrow">→</span>
                        </div>

                        <h3>My Requests</h3>

                        <p>
                            Track your machinery requests,
                            bookings and their current status.
                        </p>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/my-requests');
                            }}
                        >
                            View Requests
                            <span>→</span>
                        </button>

                    </div>


                    {/* RECOMMENDATIONS */}
                    <div className="card recommendations-card">

                        <div className="card-top">
                            <div className="card-icon">⭐</div>
                            <span className="card-arrow">→</span>
                        </div>

                        <h3>Recommendations</h3>

                        <p>
                            Discover personalized machinery
                            recommendations for your farm.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/tell-me-what-you-need')}
                        >
                            View Recommendations
                            <span>→</span>
                        </button>

                    </div>

                </div>

            </div>


            {/* ================= BOTTOM INFO ================= */}
            <div className="dashboard-info">

                <div className="info-content">

                    <span className="info-badge">
                        🌱 SMART FARMING
                    </span>

                    <h2>
                        Better machinery access,
                        <br />
                        better farming.
                    </h2>

                    <p>
                        Yantra Sanchay helps farmers access
                        agricultural machinery at the right time,
                        at affordable costs.
                    </p>

                </div>

                <div className="info-illustration">
                    🚜
                </div>

            </div>

        </div>
    );
};

export default FarmerDashboard;


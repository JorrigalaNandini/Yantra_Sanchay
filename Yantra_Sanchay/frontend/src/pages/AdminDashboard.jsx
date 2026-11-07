
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await adminService.getStatistics();

            if (response.data.success) {
                setStatistics(response.data.data || {});
            } else {
                setError('Unable to load dashboard statistics.');
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);

            setError(
                error.response?.data?.message ||
                'Unable to load dashboard statistics. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const getValue = (value) => {
        if (value === undefined || value === null) {
            return 0;
        }

        return value;
    };

    const getPercentage = (value, total) => {
        if (!total || total === 0) {
            return 0;
        }

        return Math.min(
            100,
            Math.round((value / total) * 100)
        );
    };

    /* =========================================
       LOADING
    ========================================= */

    if (loading) {
        return (
            <div className="admin-dashboard">

                <div className="admin-loading">

                    <div className="admin-spinner"></div>

                    <h2>Loading Admin Dashboard</h2>

                    <p>
                        Fetching the latest Yantra Sanchay statistics...
                    </p>

                </div>

            </div>
        );
    }


    /* =========================================
       ERROR
    ========================================= */

    if (error) {
        return (
            <div className="admin-dashboard">

                <div className="admin-error">

                    <div className="admin-state-icon">
                        ⚠️
                    </div>

                    <h2>Unable to Load Dashboard</h2>

                    <p>{error}</p>

                    <button
                        className="retry-button"
                        onClick={fetchStatistics}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="admin-dashboard">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="admin-header">

                <div className="admin-header-content">

                    <span className="admin-badge">
                        🏛️ GOVERNMENT ADMINISTRATION
                    </span>

                    <h1>
                        Yantra Sanchay Dashboard
                    </h1>

                    <p>
                        Monitor farmers, machinery, requests and
                        machinery pooling from one centralized dashboard.
                    </p>

                </div>

                <button
                    className="refresh-button"
                    onClick={fetchStatistics}
                >
                    ↻ Refresh Data
                </button>

            </div>


            {/* =========================================
                OVERVIEW
            ========================================= */}

            <div className="dashboard-title">

                <div>
                    <span>OVERVIEW</span>
                    <h2>Platform Statistics</h2>
                </div>

                <div className="live-indicator">
                    <span></span>
                    Live Data
                </div>

            </div>


            {/* =========================================
                STATISTICS GRID
            ========================================= */}

            <div className="stats-grid">

                {/* TOTAL USERS */}
                <div className="stat-card users-stat">

                    <div className="stat-top">
                        <div className="stat-icon">
                            👥
                        </div>

                        <span className="stat-label">
                            USERS
                        </span>
                    </div>

                    <h3>Total Users</h3>

                    <p className="stat-value">
                        {getValue(statistics?.totalUsers)}
                    </p>

                    <p className="stat-description">
                        Registered users on the platform
                    </p>

                </div>


                {/* FARMERS */}
                <div className="stat-card farmer-stat">

                    <div className="stat-top">
                        <div className="stat-icon">
                            👨‍🌾
                        </div>

                        <span className="stat-label">
                            FARMERS
                        </span>
                    </div>

                    <h3>Total Farmers</h3>

                    <p className="stat-value">
                        {getValue(statistics?.totalFarmers)}
                    </p>

                    <p className="stat-description">
                        Farmers using Yantra Sanchay
                    </p>

                </div>


                {/* PROVIDERS */}
                <div className="stat-card provider-stat">

                    <div className="stat-top">
                        <div className="stat-icon">
                            🏢
                        </div>

                        <span className="stat-label">
                            PROVIDERS
                        </span>
                    </div>

                    <h3>Total Providers</h3>

                    <p className="stat-value">
                        {getValue(statistics?.totalProviders)}
                    </p>

                    <p className="stat-description">
                        Registered machinery providers
                    </p>

                </div>


                {/* MACHINERY */}
                <div className="stat-card machinery-stat">

                    <div className="stat-top">
                        <div className="stat-icon">
                            🚜
                        </div>

                        <span className="stat-label">
                            MACHINERY
                        </span>
                    </div>

                    <h3>Total Machinery</h3>

                    <p className="stat-value">
                        {getValue(statistics?.totalMachinery)}
                    </p>

                    <p className="stat-description">
                        Machinery listed on the platform
                    </p>

                </div>


                {/* VERIFIED */}
                <div className="stat-card verified-stat">

                    <div className="stat-top">
                        <div className="stat-icon">
                            ✓
                        </div>

                        <span className="stat-label">
                            VERIFIED
                        </span>
                    </div>

                    <h3>Verified Machinery</h3>

                    <p className="stat-value">
                        {getValue(statistics?.verifiedMachinery)}
                    </p>

                    <p className="stat-description">
                        Approved and verified machinery
                    </p>

                </div>


                {/* PENDING */}
                <div className="stat-card pending-stat">

                    <div className="stat-top">
                        <div className="stat-icon">
                            ⏳
                        </div>

                        <span className="stat-label">
                            PENDING
                        </span>
                    </div>

                    <h3>Pending Verification</h3>

                    <p className="stat-value">
                        {getValue(statistics?.pendingMachinery)}
                    </p>

                    <p className="stat-description">
                        Machinery awaiting verification
                    </p>

                </div>


                {/* REQUESTS */}
                <div className="stat-card request-stat">

                    <div className="stat-top">
                        <div className="stat-icon">
                            📋
                        </div>

                        <span className="stat-label">
                            REQUESTS
                        </span>
                    </div>

                    <h3>Total Requests</h3>

                    <p className="stat-value">
                        {getValue(statistics?.totalRequests)}
                    </p>

                    <p className="stat-description">
                        Machinery requests submitted
                    </p>

                </div>


                {/* POOLS */}
                <div className="stat-card pool-stat">

                    <div className="stat-top">
                        <div className="stat-icon">
                            🤝
                        </div>

                        <span className="stat-label">
                            POOLING
                        </span>
                    </div>

                    <h3>Active Pools</h3>

                    <p className="stat-value">
                        {getValue(statistics?.activePools)}
                    </p>

                    <p className="stat-description">
                        Active machinery pooling groups
                    </p>

                </div>

            </div>


            {/* =========================================
                VERIFICATION + REQUEST OVERVIEW
            ========================================= */}

            <div className="admin-overview-grid">

                {/* VERIFICATION */}
                <div className="overview-card">

                    <div className="overview-header">

                        <div>
                            <span className="overview-label">
                                MACHINERY VERIFICATION
                            </span>

                            <h2>Verification Status</h2>
                        </div>

                        <span className="overview-icon">
                            🔍
                        </span>

                    </div>


                    <div className="verification-stats">

                        <div className="verification-row">

                            <div className="verification-info">
                                <span>
                                    Verified Machinery
                                </span>

                                <strong>
                                    {getValue(
                                        statistics?.verifiedMachinery
                                    )}
                                </strong>
                            </div>

                            <div className="progress-container">

                                <div
                                    className="progress-bar verified-progress"
                                    style={{
                                        width: `${getPercentage(
                                            getValue(
                                                statistics?.verifiedMachinery
                                            ),
                                            getValue(
                                                statistics?.totalMachinery
                                            )
                                        )}%`
                                    }}
                                ></div>

                            </div>

                        </div>


                        <div className="verification-row">

                            <div className="verification-info">
                                <span>
                                    Pending Verification
                                </span>

                                <strong>
                                    {getValue(
                                        statistics?.pendingMachinery
                                    )}
                                </strong>
                            </div>

                            <div className="progress-container">

                                <div
                                    className="progress-bar pending-progress"
                                    style={{
                                        width: `${getPercentage(
                                            getValue(
                                                statistics?.pendingMachinery
                                            ),
                                            getValue(
                                                statistics?.totalMachinery
                                            )
                                        )}%`
                                    }}
                                ></div>

                            </div>

                        </div>

                    </div>


                    <button
                        className="overview-button"
                        onClick={() =>
                            navigate('/admin/machinery')
                        }
                    >
                        Manage Machinery →
                    </button>

                </div>


                {/* REQUESTS */}
                <div className="overview-card">

                    <div className="overview-header">

                        <div>
                            <span className="overview-label">
                                MACHINERY REQUESTS
                            </span>

                            <h2>Request Management</h2>
                        </div>

                        <span className="overview-icon">
                            📋
                        </span>

                    </div>


                    <div className="request-overview">

                        <div className="request-big-number">
                            {getValue(statistics?.totalRequests)}
                        </div>

                        <div>
                            <strong>
                                Total Machinery Requests
                            </strong>

                            <p>
                                Review and manage requests
                                submitted by farmers.
                            </p>
                        </div>

                    </div>


                    <div className="request-actions">

                        <button
                            onClick={() =>
                                navigate('/admin/requests')
                            }
                        >
                            📋 View Requests
                        </button>

                        <button
                            onClick={() =>
                                navigate('/admin/farmers')
                            }
                        >
                            👨‍🌾 View Farmers
                        </button>

                    </div>

                </div>

            </div>


            {/* =========================================
                QUICK ACTIONS
            ========================================= */}

            <section className="quick-actions">

                <div className="quick-heading">

                    <span>ADMINISTRATION</span>

                    <h2>Quick Actions</h2>

                    <p>
                        Frequently used administrative operations.
                    </p>

                </div>


                <div className="quick-actions-grid">

                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate('/admin/machinery')
                        }
                    >
                        <div className="quick-icon">
                            🚜
                        </div>

                        <div>
                            <h3>Manage Machinery</h3>
                            <p>
                                Verify, approve and manage machinery
                                listings.
                            </p>
                        </div>

                        <span>→</span>
                    </button>


                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate('/admin/requests')
                        }
                    >
                        <div className="quick-icon">
                            📋
                        </div>

                        <div>
                            <h3>Manage Requests</h3>
                            <p>
                                Review farmer machinery requests.
                            </p>
                        </div>

                        <span>→</span>
                    </button>


                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate('/admin/users')
                        }
                    >
                        <div className="quick-icon">
                            👥
                        </div>

                        <div>
                            <h3>Manage Users</h3>
                            <p>
                                View and manage registered users.
                            </p>
                        </div>

                        <span>→</span>
                    </button>


                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate('/admin/providers')
                        }
                    >
                        <div className="quick-icon">
                            🏢
                        </div>

                        <div>
                            <h3>Manage Providers</h3>
                            <p>
                                Monitor registered machinery providers.
                            </p>
                        </div>

                        <span>→</span>
                    </button>


                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate('/admin/pooling')
                        }
                    >
                        <div className="quick-icon">
                            🤝
                        </div>

                        <div>
                            <h3>Machinery Pools</h3>
                            <p>
                                Monitor active machinery pooling.
                            </p>
                        </div>

                        <span>→</span>
                    </button>


                    <button
                        className="quick-action"
                        onClick={() =>
                            navigate('/admin/reports')
                        }
                    >
                        <div className="quick-icon">
                            📊
                        </div>

                        <div>
                            <h3>Reports & Analytics</h3>
                            <p>
                                View platform reports and insights.
                            </p>
                        </div>

                        <span>→</span>
                    </button>

                </div>

            </section>


            {/* =========================================
                GOVERNMENT NOTICE
            ========================================= */}

            <section className="admin-notice">

                <div className="notice-icon">
                    🏛️
                </div>

                <div className="notice-content">

                    <span>
                        GOVERNMENT DIGITAL AGRICULTURE PLATFORM
                    </span>

                    <h2>
                        Yantra Sanchay Administration
                    </h2>

                    <p>
                        Use this dashboard to monitor machinery
                        availability, verify listings, manage farmer
                        requests and ensure transparent access to
                        agricultural machinery.
                    </p>

                </div>

                <div className="notice-status">
                    <span className="status-dot"></span>
                    System Operational
                </div>

            </section>

        </div>
    );
};

export default AdminDashboard;

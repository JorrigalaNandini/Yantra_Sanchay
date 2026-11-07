
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MachineryDetailsPage.css';

const MachineryDetailsPage = () => {
    const navigate = useNavigate();

    // Sample machinery data
    // Later, this can be replaced with data fetched from your backend
    const machinery = {
        name: 'Mahindra 575 DI Tractor',
        category: 'Tractor',
        manufacturer: 'Mahindra',
        model: '575 DI',
        horsepower: '45 HP',
        fuelType: 'Diesel',
        year: '2024',
        condition: 'Excellent',
        location: 'Warangal, Telangana',
        availability: 'Available',
        hourlyRate: '₹650 / hour',
        dailyRate: '₹4,000 / day',
        image:
            'https://images.unsplash.com/photo-1592982537447-6f2a6a0a2a3e?auto=format&fit=crop&w=1200&q=80'
    };

    return (
        <div className="machinery-details-page">

            {/* Page Header */}
            <div className="details-header">
                <div>
                    <span className="page-badge">YANTRA SANCHAY</span>
                    <h1>Machinery Details</h1>
                    <p>
                        View complete information about agricultural machinery
                        available through the government machinery pool.
                    </p>
                </div>

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>

            <div className="details-container">

                {/* Main Machinery Section */}
                <div className="machinery-main-card">

                    <div className="machinery-image-section">
                        <img
                            src={machinery.image}
                            alt={machinery.name}
                            className="machinery-detail-image"
                        />

                        <span className="availability-badge">
                            ● {machinery.availability}
                        </span>
                    </div>

                    <div className="machinery-info">

                        <span className="category-label">
                            {machinery.category}
                        </span>

                        <h2>{machinery.name}</h2>

                        <p className="manufacturer">
                            Manufacturer: <strong>{machinery.manufacturer}</strong>
                        </p>

                        <div className="location-info">
                            📍 {machinery.location}
                        </div>

                        <div className="price-section">
                            <div>
                                <span>Hourly Rate</span>
                                <strong>{machinery.hourlyRate}</strong>
                            </div>

                            <div>
                                <span>Daily Rate</span>
                                <strong>{machinery.dailyRate}</strong>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button
                                className="request-btn"
                                onClick={() => navigate('/request-machinery')}
                            >
                                Request Machinery
                            </button>

                            <button
                                className="availability-btn"
                                onClick={() => alert('Machinery availability checked successfully!')}
                            >
                                Check Availability
                            </button>
                        </div>
                    </div>
                </div>

                {/* Specifications */}
                <div className="details-section">
                    <div className="section-title">
                        <span>⚙️</span>
                        <div>
                            <h2>Machinery Specifications</h2>
                            <p>Technical details of the selected machinery</p>
                        </div>
                    </div>

                    <div className="specifications-grid">

                        <div className="spec-item">
                            <span>Model</span>
                            <strong>{machinery.model}</strong>
                        </div>

                        <div className="spec-item">
                            <span>Horsepower</span>
                            <strong>{machinery.horsepower}</strong>
                        </div>

                        <div className="spec-item">
                            <span>Fuel Type</span>
                            <strong>{machinery.fuelType}</strong>
                        </div>

                        <div className="spec-item">
                            <span>Manufacturing Year</span>
                            <strong>{machinery.year}</strong>
                        </div>

                        <div className="spec-item">
                            <span>Condition</span>
                            <strong>{machinery.condition}</strong>
                        </div>

                        <div className="spec-item">
                            <span>Current Location</span>
                            <strong>{machinery.location}</strong>
                        </div>

                    </div>
                </div>

                {/* Government Support */}
                <div className="government-support">

                    <div className="support-icon">
                        🏛️
                    </div>

                    <div className="support-content">
                        <h2>Government Machinery Support</h2>

                        <p>
                            This machinery is listed under the agricultural
                            machinery access program. Eligible farmers and
                            Farmer Producer Organizations (FPOs) may receive
                            benefits according to applicable government schemes.
                        </p>

                        <div className="support-points">
                            <span>✓ Transparent pricing</span>
                            <span>✓ Verified machinery</span>
                            <span>✓ Government-supported access</span>
                            <span>✓ Digital request tracking</span>
                        </div>
                    </div>

                </div>

                {/* Availability Information */}
                <div className="details-section">

                    <div className="section-title">
                        <span>📅</span>

                        <div>
                            <h2>Availability Information</h2>
                            <p>Plan your machinery usage in advance</p>
                        </div>
                    </div>

                    <div className="availability-grid">

                        <div className="availability-card">
                            <span className="availability-icon">🟢</span>
                            <div>
                                <strong>Currently Available</strong>
                                <p>This machinery can be requested now.</p>
                            </div>
                        </div>

                        <div className="availability-card">
                            <span className="availability-icon">📍</span>
                            <div>
                                <strong>Pickup Location</strong>
                                <p>{machinery.location}</p>
                            </div>
                        </div>

                        <div className="availability-card">
                            <span className="availability-icon">📋</span>
                            <div>
                                <strong>Request Status</strong>
                                <p>No active request for this machinery.</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* How It Works */}
                <div className="how-it-works">

                    <div className="section-title">
                        <span>📌</span>

                        <div>
                            <h2>How to Request</h2>
                            <p>Follow these simple steps</p>
                        </div>
                    </div>

                    <div className="steps">

                        <div className="step">
                            <div className="step-number">1</div>
                            <div>
                                <h3>Select Machinery</h3>
                                <p>Choose the machinery required for your farm.</p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <div>
                                <h3>Submit Request</h3>
                                <p>Select your required date and duration.</p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">3</div>
                            <div>
                                <h3>Get Confirmation</h3>
                                <p>Track your request through Yantra Sanchay.</p>
                            </div>
                        </div>

                    </div>

                    <button
                        className="bottom-request-btn"
                        onClick={() => navigate('/request-machinery')}
                    >
                        Request This Machinery →
                    </button>

                </div>

            </div>
        </div>
    );
};

export default MachineryDetailsPage;


import React, { useState, useEffect } from 'react';
import { requestService } from '../services';
import './MyRequestsPage.css';

const MyRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await requestService.getUserRequests();

            if (response.data.success) {
                setRequests(response.data.data || []);
            } else {
                setError('Unable to load your machinery requests.');
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError(
                error.response?.data?.message ||
                'Unable to load your requests. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Format date safely
    const formatDate = (date) => {
        if (!date) return 'Not specified';

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return 'Not specified';
        }

        return parsedDate.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null || amount === '') {
            return 'Not specified';
        }

        return `₹${Number(amount).toLocaleString('en-IN')}`;
    };

    // Get status class
    const getStatusClass = (status) => {
        if (!status) return 'pending';

        switch (status.toLowerCase()) {
            case 'approved':
            case 'confirmed':
            case 'completed':
                return 'approved';

            case 'rejected':
            case 'cancelled':
            case 'canceled':
                return 'rejected';

            case 'pending':
            default:
                return 'pending';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        if (!status) return '⏳';

        switch (status.toLowerCase()) {
            case 'approved':
            case 'confirmed':
                return '✓';

            case 'completed':
                return '✓';

            case 'rejected':
            case 'cancelled':
            case 'canceled':
                return '✕';

            case 'pending':
            default:
                return '⏳';
        }
    };

    // Get machinery name from different possible backend structures
    const getMachineryName = (request) => {
        return (
            request.machinery?.name ||
            request.machineryName ||
            request.machine?.name ||
            request.machineName ||
            'Agricultural Machinery'
        );
    };

    // Get machinery category
    const getMachineryCategory = (request) => {
        return (
            request.machinery?.category ||
            request.category ||
            request.machine?.category ||
            'Agricultural Equipment'
        );
    };

    // Get machinery image
    const getMachineryImage = (request) => {
        return (
            request.machinery?.image ||
            request.machinery?.imageUrl ||
            request.image ||
            request.imageUrl ||
            null
        );
    };

    // Get request date
    const getRequestDate = (request) => {
        return (
            request.createdAt ||
            request.requestDate ||
            request.date
        );
    };

    // Get start date
    const getStartDate = (request) => {
        return (
            request.startDate ||
            request.fromDate ||
            request.bookingDate ||
            request.date
        );
    };

    // Get end date
    const getEndDate = (request) => {
        return (
            request.endDate ||
            request.toDate
        );
    };

    // Get location
    const getLocation = (request) => {
        return (
            request.location ||
            request.machinery?.location ||
            request.pickupLocation ||
            request.farmLocation ||
            'Location not specified'
        );
    };

    // Get duration
    const getDuration = (request) => {
        if (request.duration) {
            return `${request.duration} ${request.durationUnit || 'days'}`;
        }

        if (request.numberOfDays) {
            return `${request.numberOfDays} days`;
        }

        if (request.days) {
            return `${request.days} days`;
        }

        return 'Not specified';
    };

    // Get total cost
    const getTotalCost = (request) => {
        return (
            request.totalAmount ??
            request.totalCost ??
            request.amount ??
            request.price ??
            request.machinery?.dailyRate ??
            null
        );
    };
    console.log("Requets=", requests)
    return (
        <div className="my-requests-page">

            {/* =========================================
                PAGE HEADER
            ========================================= */}
            <div className="requests-header">

                <div className="header-content">
                    <span className="page-badge">
                        YANTRA SANCHAY
                    </span>

                    <h1>My Machinery Requests</h1>

                    <p>
                        View and track all your agricultural machinery
                        requests in one place.
                    </p>
                </div>

                <button
                    className="refresh-btn"
                    onClick={fetchRequests}
                    disabled={loading}
                >
                    ↻ {loading ? 'Refreshing...' : 'Refresh'}
                </button>

            </div>


            {/* =========================================
                SUMMARY
            ========================================= */}
            {!loading && !error && (
                <div className="request-summary">

                    <div className="summary-card">
                        <div className="summary-icon">📋</div>
                        <div>
                            <span>Total Requests</span>
                            <strong>{requests.length}</strong>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon">⏳</div>
                        <div>
                            <span>Pending</span>
                            <strong>
                                {
                                    requests.filter(
                                        r =>
                                            !r.status ||
                                            r.status.toLowerCase() === 'pending'
                                    ).length
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon">✓</div>
                        <div>
                            <span>Approved</span>
                            <strong>
                                {
                                    requests.filter(
                                        r =>
                                            r.status &&
                                            (
                                                r.status.toLowerCase() === 'approved' ||
                                                r.status.toLowerCase() === 'confirmed'
                                            )
                                    ).length
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon">✅</div>
                        <div>
                            <span>Completed</span>
                            <strong>
                                {
                                    requests.filter(
                                        r =>
                                            r.status &&
                                            r.status.toLowerCase() === 'completed'
                                    ).length
                                }
                            </strong>
                        </div>
                    </div>

                </div>
            )}


            {/* =========================================
                LOADING
            ========================================= */}
            {loading && (
                <div className="requests-state">
                    <div className="loading-spinner"></div>
                    <h2>Loading your requests...</h2>
                    <p>
                        Please wait while we retrieve your machinery
                        request history.
                    </p>
                </div>
            )}


            {/* =========================================
                ERROR
            ========================================= */}
            {!loading && error && (
                <div className="requests-state error-state">

                    <div className="state-icon">⚠️</div>

                    <h2>Unable to Load Requests</h2>

                    <p>{error}</p>

                    <button
                        className="retry-btn"
                        onClick={fetchRequests}
                    >
                        Try Again
                    </button>

                </div>
            )}


            {/* =========================================
                NO REQUESTS
            ========================================= */}
            {!loading && !error && requests.length === 0 && (
                <div className="requests-state empty-state">

                    <div className="state-icon">📋</div>

                    <h2>No Machinery Requests Yet</h2>

                    <p>
                        You haven't submitted any machinery requests.
                        Browse available agricultural machinery and
                        submit your first request.
                    </p>

                    <button
                        className="browse-btn"
                        onClick={() => {
                            window.location.href = '/machinery';
                        }}
                    >
                        Browse Machinery →
                    </button>

                </div>
            )}


            {/* =========================================
                REQUESTS LIST
            ========================================= */}
            {!loading && !error && requests.length > 0 && (

                <div className="requests-list">

                    <div className="list-heading">
                        <div>
                            <h2>Request History</h2>
                            <p>
                                {requests.length} request
                                {requests.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                    </div>


                    {requests.map((request, index) => {

                        const status =
                            request.status?.toLowerCase() || 'pending';

                        const machineryImage =
                            getMachineryImage(request);

                        return (

                            <div
                                className="request-card"
                                key={request._id || index}
                            >

                                {/* Machinery Image */}
                                <div className="request-image">

                                    {machineryImage ? (
                                        <img
                                            src={machineryImage}
                                            alt={getMachineryName(request)}
                                        />
                                    ) : (
                                        <div className="default-machinery-image">
                                            🚜
                                        </div>
                                    )}

                                    <span
                                        className={`status-badge ${getStatusClass(
                                            request.status
                                        )}`}
                                    >
                                        <span>
                                            {getStatusIcon(request.status)}
                                        </span>

                                        {request.status || 'Pending'}
                                    </span>

                                </div>


                                {/* Request Information */}
                                <div className="request-content">

                                    <div className="request-top">

                                        <div>

                                            <span className="machinery-category">
                                                {getMachineryCategory(request)}
                                            </span>

                                            <h3>
                                                {getMachineryName(request)}
                                            </h3>

                                        </div>

                                        <span className="request-id">
                                            Request ID:{' '}
                                            {request._id
                                                ? request._id.slice(-8).toUpperCase()
                                                : 'N/A'}
                                        </span>

                                    </div>


                                    {/* Details */}
                                    <div className="request-details">

                                        <div className="detail-item">
                                            <span className="detail-icon">
                                                📅
                                            </span>

                                            <div>
                                                <small>
                                                    Requested On
                                                </small>

                                                <strong>
                                                    {formatDate(
                                                        getRequestDate(request)
                                                    )}
                                                </strong>
                                            </div>
                                        </div>


                                        <div className="detail-item">
                                            <span className="detail-icon">
                                                🗓️
                                            </span>

                                            <div>
                                                <small>
                                                    Start Date
                                                </small>

                                                <strong>
                                                    {formatDate(
                                                        getStartDate(request)
                                                    )}
                                                </strong>
                                            </div>
                                        </div>


                                        <div className="detail-item">
                                            <span className="detail-icon">
                                                🏁
                                            </span>

                                            <div>
                                                <small>
                                                    End Date
                                                </small>

                                                <strong>
                                                    {formatDate(
                                                        getEndDate(request)
                                                    )}
                                                </strong>
                                            </div>
                                        </div>


                                        <div className="detail-item">
                                            <span className="detail-icon">
                                                ⏱️
                                            </span>

                                            <div>
                                                <small>
                                                    Duration
                                                </small>

                                                <strong>
                                                    {getDuration(request)}
                                                </strong>
                                            </div>
                                        </div>


                                        <div className="detail-item">
                                            <span className="detail-icon">
                                                📍
                                            </span>

                                            <div>
                                                <small>
                                                    Location
                                                </small>

                                                <strong>
                                                    {getLocation(request)}
                                                </strong>
                                            </div>
                                        </div>


                                        <div className="detail-item">
                                            <span className="detail-icon">
                                                💰
                                            </span>

                                            <div>
                                                <small>
                                                    Estimated Cost
                                                </small>

                                                <strong>
                                                    {formatCurrency(
                                                        getTotalCost(request)
                                                    )}
                                                </strong>
                                            </div>
                                        </div>

                                    </div>


                                    {/* Farmer Notes */}
                                    {request.notes && (
                                        <div className="request-notes">
                                            <strong>📝 Your Notes</strong>
                                            <p>{request.notes}</p>
                                        </div>
                                    )}


                                    {/* Rejection Reason */}
                                    {(
                                        status === 'rejected' ||
                                        status === 'cancelled' ||
                                        status === 'canceled'
                                    ) && request.rejectionReason && (

                                            <div className="rejection-message">
                                                <strong>
                                                    Reason:
                                                </strong>

                                                <span>
                                                    {request.rejectionReason}
                                                </span>
                                            </div>
                                        )}


                                    {/* Footer */}
                                    <div className="request-footer">

                                        <span className="request-date-text">
                                            Submitted on{' '}
                                            {formatDate(
                                                getRequestDate(request)
                                            )}
                                        </span>

                                        <button
                                            className="view-request-btn"
                                            onClick={() => {
                                                console.log(
                                                    'Selected request:',
                                                    request
                                                );
                                            }}
                                        >
                                            View Details →
                                        </button>

                                    </div>

                                </div>

                            </div>

                        );
                    })}

                </div>
            )}

        </div>
    );
};

export default MyRequestsPage;

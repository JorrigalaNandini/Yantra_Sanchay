
import React, { useEffect, useMemo, useState } from 'react';
import { poolingService } from '../services';
import './PoolingPage.css';

const PoolingPage = () => {

    const [pooling, setPooling] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    const [selectedPool, setSelectedPool] = useState(null);
    const [showDetails, setShowDetails] = useState(false);


    /* =========================================
       FETCH POOLING DATA
    ========================================= */

    useEffect(() => {
        fetchPooling();
    }, []);


    const fetchPooling = async () => {

        try {

            setLoading(true);
            setError('');

            const response = await poolingService.getAll();

            if (response?.data?.success) {

                setPooling(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : []
                );

            } else {

                setError(
                    response?.data?.message ||
                    'Unable to load machinery pools.'
                );

            }

        } catch (err) {

            console.error(
                'Error fetching pooling:',
                err
            );

            setError(
                err.response?.data?.message ||
                'Unable to connect to the server. Please try again.'
            );

        } finally {

            setLoading(false);

        }
    };


    /* =========================================
       HELPER FUNCTIONS
    ========================================= */

    const getPoolTitle = (pool) => {

        return (
            pool.title ||
            pool.machineryName ||
            pool.machinery?.machineryName ||
            'Machinery Pool'
        );
    };


    const getCategory = (pool) => {

        return (
            pool.category ||
            pool.machinery?.category ||
            'Agricultural Machinery'
        );
    };


    const getLocation = (pool) => {

        if (typeof pool.location === 'string') {
            return pool.location;
        }

        if (pool.location?.address) {
            return pool.location.address;
        }

        if (pool.location?.village) {
            return pool.location.village;
        }

        return 'Location not specified';
    };


    const getCreator = (pool) => {

        return (
            pool.createdBy?.name ||
            pool.user?.name ||
            pool.farmer?.name ||
            pool.owner?.name ||
            'Farmer'
        );
    };


    const getParticipants = (pool) => {

        if (Array.isArray(pool.participants)) {
            return pool.participants.length;
        }

        if (Array.isArray(pool.members)) {
            return pool.members.length;
        }

        if (typeof pool.participantsCount === 'number') {
            return pool.participantsCount;
        }

        if (typeof pool.membersCount === 'number') {
            return pool.membersCount;
        }

        return 0;
    };


    const getCapacity = (pool) => {

        return (
            pool.maxParticipants ||
            pool.maxMembers ||
            pool.capacity ||
            5
        );
    };


    const getStatus = (pool) => {

        const status = (
            pool.status ||
            pool.poolStatus ||
            'active'
        ).toString().toLowerCase();

        if (
            status === 'closed' ||
            status === 'completed' ||
            status === 'full'
        ) {
            return 'Closed';
        }

        if (status === 'pending') {
            return 'Pending';
        }

        return 'Active';
    };


    const getDate = (pool) => {

        const date =
            pool.date ||
            pool.startDate ||
            pool.requiredDate ||
            pool.createdAt;

        if (!date) {
            return 'Date not specified';
        }

        try {

            return new Date(date).toLocaleDateString(
                'en-IN',
                {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }
            );

        } catch {
            return 'Date not specified';
        }
    };


    const getInitial = (name) => {

        if (!name) {
            return 'F';
        }

        return name.charAt(0).toUpperCase();
    };


    /* =========================================
       CATEGORIES
    ========================================= */

    const categories = useMemo(() => {

        const uniqueCategories = pooling
            .map(pool => getCategory(pool))
            .filter(Boolean);

        return [
            'All',
            ...Array.from(new Set(uniqueCategories))
        ];

    }, [pooling]);


    /* =========================================
       FILTER POOLS
    ========================================= */

    const filteredPooling = useMemo(() => {

        return pooling.filter((pool) => {

            const title = getPoolTitle(pool).toLowerCase();
            const poolCategory = getCategory(pool).toLowerCase();
            const location = getLocation(pool).toLowerCase();

            const searchValue = search
                .trim()
                .toLowerCase();

            const matchesSearch =
                !searchValue ||
                title.includes(searchValue) ||
                poolCategory.includes(searchValue) ||
                location.includes(searchValue);

            const matchesCategory =
                category === 'All' ||
                poolCategory === category.toLowerCase();

            return matchesSearch && matchesCategory;
        });

    }, [pooling, search, category]);


    /* =========================================
       OPEN DETAILS
    ========================================= */

    const handleViewDetails = (pool) => {

        setSelectedPool(pool);
        setShowDetails(true);
    };


    /* =========================================
       CLOSE DETAILS
    ========================================= */

    const handleCloseDetails = () => {

        setSelectedPool(null);
        setShowDetails(false);
    };


    /* =========================================
       JOIN POOL
    ========================================= */

    const handleJoinPool = (pool) => {

        /*
         * Your current poolingService only exposes getAll()
         * in the code provided.
         *
         * Once the backend has a join endpoint, connect it here:
         *
         * await poolingService.join(pool._id);
         */

        alert(
            `Join request for "${getPoolTitle(pool)}" can be connected to your pooling API.`
        );
    };


    /* =========================================
       LOADING
    ========================================= */

    if (loading) {

        return (

            <div className="pooling-page">

                <div className="pooling-loading">

                    <div className="pooling-spinner"></div>

                    <h2>
                        Loading Machinery Pools
                    </h2>

                    <p>
                        Finding available pooling opportunities...
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="pooling-page">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="pooling-header">

                <div className="pooling-header-content">

                    <span className="pooling-label">
                        COMMUNITY MACHINERY SHARING
                    </span>

                    <h1>
                        Machinery Pooling
                    </h1>

                    <p>
                        Coordinate with nearby farmers to
                        share agricultural machinery and
                        reduce individual equipment costs.
                    </p>

                </div>

                <div className="pooling-header-icon">
                    🤝
                </div>

            </div>


            {/* =========================================
                INFORMATION CARDS
            ========================================= */}

            <div className="pooling-info-grid">

                <div className="pooling-info-card">

                    <div className="info-icon">
                        🤝
                    </div>

                    <div>
                        <strong>
                            Share Costs
                        </strong>

                        <span>
                            Reduce machinery expenses
                        </span>
                    </div>

                </div>


                <div className="pooling-info-card">

                    <div className="info-icon">
                        🌾
                    </div>

                    <div>
                        <strong>
                            Help Farmers
                        </strong>

                        <span>
                            Work together locally
                        </span>
                    </div>

                </div>


                <div className="pooling-info-card">

                    <div className="info-icon">
                        🚜
                    </div>

                    <div>
                        <strong>
                            Better Access
                        </strong>

                        <span>
                            Access equipment when needed
                        </span>
                    </div>

                </div>

            </div>


            {/* =========================================
                ERROR
            ========================================= */}

            {error && (

                <div className="pooling-error">

                    <span>⚠️</span>

                    <div>

                        <strong>
                            Unable to load pools
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={fetchPooling}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =========================================
                TOOLBAR
            ========================================= */}

            <div className="pooling-toolbar">

                <div className="pooling-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search machinery, category or location..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (

                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="clear-search"
                        >
                            ✕
                        </button>

                    )}

                </div>


                <div className="pooling-filters">

                    {categories.map((item) => (

                        <button
                            key={item}
                            type="button"
                            className={
                                category === item
                                    ? 'active'
                                    : ''
                            }
                            onClick={() =>
                                setCategory(item)
                            }
                        >
                            {item}
                        </button>

                    ))}

                </div>

            </div>


            {/* =========================================
                RESULTS HEADER
            ========================================= */}

            <div className="pooling-results-header">

                <div>

                    <h2>
                        Available Pooling Opportunities
                    </h2>

                    <p>
                        {filteredPooling.length}{' '}
                        {filteredPooling.length === 1
                            ? 'pool'
                            : 'pools'}{' '}
                        available
                    </p>

                </div>

                <button
                    type="button"
                    className="refresh-button"
                    onClick={fetchPooling}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* =========================================
                EMPTY STATE
            ========================================= */}

            {filteredPooling.length === 0 ? (

                <div className="pooling-empty">

                    <div className="empty-icon">
                        🚜
                    </div>

                    <h2>
                        No pooling opportunities found
                    </h2>

                    <p>
                        There are currently no machinery
                        pools matching your search.
                    </p>

                    {(search || category !== 'All') && (

                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setCategory('All');
                            }}
                        >
                            Clear Filters
                        </button>

                    )}

                </div>

            ) : (

                /* =========================================
                   POOL CARDS
                ========================================= */

                <div className="pooling-list">

                    {filteredPooling.map((pool) => {

                        const title =
                            getPoolTitle(pool);

                        const participants =
                            getParticipants(pool);

                        const capacity =
                            getCapacity(pool);

                        const status =
                            getStatus(pool);

                        const availableSlots =
                            Math.max(
                                capacity - participants,
                                0
                            );

                        return (

                            <div
                                className="pool-card"
                                key={pool._id}
                            >

                                {/* CARD TOP */}

                                <div className="pool-card-top">

                                    <div className="pool-machinery-icon">
                                        🚜
                                    </div>

                                    <div className="pool-title-section">

                                        <div className="pool-category">
                                            {getCategory(pool)}
                                        </div>

                                        <h3>
                                            {title}
                                        </h3>

                                    </div>

                                    <span
                                        className={`pool-status ${status.toLowerCase()}`}
                                    >
                                        {status}
                                    </span>

                                </div>


                                {/* DESCRIPTION */}

                                {pool.description && (

                                    <p className="pool-description">
                                        {pool.description}
                                    </p>

                                )}


                                {/* DETAILS */}

                                <div className="pool-details">

                                    <div className="pool-detail">

                                        <span>
                                            📍
                                        </span>

                                        <div>
                                            <small>
                                                Location
                                            </small>

                                            <strong>
                                                {getLocation(pool)}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="pool-detail">

                                        <span>
                                            📅
                                        </span>

                                        <div>
                                            <small>
                                                Required Date
                                            </small>

                                            <strong>
                                                {getDate(pool)}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="pool-detail">

                                        <span>
                                            👨‍🌾
                                        </span>

                                        <div>
                                            <small>
                                                Created By
                                            </small>

                                            <strong>
                                                {getCreator(pool)}
                                            </strong>
                                        </div>

                                    </div>

                                </div>


                                {/* PARTICIPANTS */}

                                <div className="pool-participation">

                                    <div className="participation-header">

                                        <span>
                                            Farmers Joined
                                        </span>

                                        <strong>
                                            {participants}/{capacity}
                                        </strong>

                                    </div>

                                    <div className="progress-bar">

                                        <div
                                            style={{
                                                width: `${Math.min(
                                                    (participants /
                                                        capacity) *
                                                    100,
                                                    100
                                                )}%`
                                            }}
                                        ></div>

                                    </div>

                                    <span className="slots-text">

                                        {availableSlots > 0
                                            ? `${availableSlots} slot${availableSlots === 1 ? '' : 's'} available`
                                            : 'Pool is full'}

                                    </span>

                                </div>


                                {/* ACTIONS */}

                                <div className="pool-actions">

                                    <button
                                        type="button"
                                        className="details-button"
                                        onClick={() =>
                                            handleViewDetails(pool)
                                        }
                                    >
                                        View Details
                                    </button>

                                    <button
                                        type="button"
                                        className="join-button"
                                        disabled={
                                            status !== 'Active' ||
                                            availableSlots === 0
                                        }
                                        onClick={() =>
                                            handleJoinPool(pool)
                                        }
                                    >
                                        {availableSlots === 0
                                            ? 'Pool Full'
                                            : 'Join Pool →'}
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>

            )}


            {/* =========================================
                DETAILS MODAL
            ========================================= */}

            {showDetails && selectedPool && (

                <div
                    className="pool-modal-overlay"
                    onClick={handleCloseDetails}
                >

                    <div
                        className="pool-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            type="button"
                            className="modal-close"
                            onClick={handleCloseDetails}
                        >
                            ✕
                        </button>


                        <div className="modal-icon">
                            🚜
                        </div>

                        <span className="modal-category">
                            {getCategory(selectedPool)}
                        </span>

                        <h2>
                            {getPoolTitle(selectedPool)}
                        </h2>


                        <div className="modal-details">

                            <div>
                                <span>📍</span>
                                <p>
                                    <small>Location</small>
                                    <strong>
                                        {getLocation(selectedPool)}
                                    </strong>
                                </p>
                            </div>


                            <div>
                                <span>📅</span>
                                <p>
                                    <small>Required Date</small>
                                    <strong>
                                        {getDate(selectedPool)}
                                    </strong>
                                </p>
                            </div>


                            <div>
                                <span>👨‍🌾</span>
                                <p>
                                    <small>Created By</small>
                                    <strong>
                                        {getCreator(selectedPool)}
                                    </strong>
                                </p>
                            </div>


                            <div>
                                <span>🤝</span>
                                <p>
                                    <small>Participants</small>
                                    <strong>
                                        {getParticipants(selectedPool)}
                                        /
                                        {getCapacity(selectedPool)}
                                    </strong>
                                </p>
                            </div>

                        </div>


                        {selectedPool.description && (

                            <div className="modal-description">

                                <h3>
                                    About This Pool
                                </h3>

                                <p>
                                    {selectedPool.description}
                                </p>

                            </div>

                        )}


                        <button
                            type="button"
                            className="modal-join-button"
                            disabled={
                                getStatus(selectedPool) !== 'Active' ||
                                getParticipants(selectedPool) >=
                                getCapacity(selectedPool)
                            }
                            onClick={() => {
                                handleJoinPool(selectedPool);
                                handleCloseDetails();
                            }}
                        >
                            Join Machinery Pool
                        </button>

                    </div>

                </div>

            )}


            {/* =========================================
                FOOTER
            ========================================= */}

            <div className="pooling-footer">

                <span>
                    🏛️
                </span>

                <p>
                    Yantra Sanchay • Community-Based
                    Agricultural Machinery Sharing
                </p>

            </div>

        </div>
    );
};

export default PoolingPage;

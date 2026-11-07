
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RequestMachinery.css';

const RequestMachinery = () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        farmerName: user.name || '',
        acresOfLand: '',
        purpose: '',
        machineryRequired: '',
        requiredDate: '',
        requiredTime: '',
        estimatedCompletionTime: ''
    });

    const [documentFile, setDocumentFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setDocumentFile(null);
            return;
        }

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'application/pdf'
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                'Please upload a JPG, PNG or PDF document.'
            );
            setDocumentFile(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(
                'Document size must be less than 5 MB.'
            );
            setDocumentFile(null);
            return;
        }

        setError('');
        setDocumentFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        /* ================= VALIDATION ================= */

        if (!documentFile) {
            setError(
                'Please upload your land ownership or cultivation proof.'
            );
            return;
        }

        if (!formData.farmerName.trim()) {
            setError('Farmer name is required.');
            return;
        }

        if (!formData.acresOfLand || Number(formData.acresOfLand) <= 0) {
            setError('Please enter a valid number of acres.');
            return;
        }

        if (!formData.purpose.trim()) {
            setError(
                'Please enter the purpose for using the machinery.'
            );
            return;
        }

        if (!formData.machineryRequired) {
            setError('Please select the required machinery.');
            return;
        }

        if (!formData.requiredDate) {
            setError('Please select the required date.');
            return;
        }

        if (!formData.requiredTime) {
            setError('Please select the required time.');
            return;
        }

        if (!formData.estimatedCompletionTime.trim()) {
            setError(
                'Please enter the estimated completion time.'
            );
            return;
        }

        try {
            setLoading(true);

            /* ================= GET FARMER ID ================= */

            const farmerId = user._id || user.id;

            /* ================= GET AUTH TOKEN ================= */

            const token =
                localStorage.getItem('token') ||
                localStorage.getItem('authToken') ||
                localStorage.getItem('accessToken');

            if (!farmerId) {
                setError(
                    'Farmer information not found. Please login again.'
                );
                setLoading(false);
                return;
            }

            if (!token) {
                setError(
                    'No token provided. Please login again.'
                );
                setLoading(false);
                return;
            }

            /* ================= FORM DATA ================= */

            const data = new FormData();

            data.append('farmerId', farmerId);
            data.append('farmerName', formData.farmerName);
            data.append('acresOfLand', formData.acresOfLand);
            data.append('purpose', formData.purpose);
            data.append(
                'machineryRequired',
                formData.machineryRequired
            );
            data.append(
                'requiredDate',
                formData.requiredDate
            );
            data.append(
                'requiredTime',
                formData.requiredTime
            );
            data.append(
                'estimatedCompletionTime',
                formData.estimatedCompletionTime
            );

            /* ================= DOCUMENT ================= */

            data.append('document', documentFile);

            /* ================= SEND REQUEST ================= */

            const response = await fetch(
                'http://localhost:5000/api/requests',
                {
                    method: 'POST',

                    headers: {
                        Authorization: `Bearer ${token} `
                    },

                    body: data
                }
            );

            /* ================= RESPONSE ================= */

            let result = {};

            try {
                result = await response.json();
            } catch (jsonError) {
                result = {};
            }

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Failed to submit machinery request.'
                );
            }

            /* ================= SUCCESS ================= */

            setMessage(
                'Machinery request submitted successfully!'
            );

            /*
             * The request has now been stored in the database.
             * My Requests page will fetch the updated data.
             */

            setTimeout(() => {
                navigate('/my-requests');
            }, 1200);

        } catch (err) {
            console.error(
                'Request submission error:',
                err
            );

            setError(
                err.message ||
                'Something went wrong while submitting your request.'
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="request-machinery-page">

            <div className="request-container">

                {/* ================= PAGE HEADER ================= */}

                <div className="request-header">

                    <button
                        type="button"
                        className="back-button"
                        onClick={() =>
                            navigate('/farmer-dashboard')
                        }
                    >
                        ← Back to Dashboard
                    </button>

                    <div className="request-title">

                        <span className="request-label">
                            MACHINERY ACCESS REQUEST
                        </span>

                        <h1>
                            Request Agricultural Machinery 🚜
                        </h1>

                        <p>
                            Provide your farming details and submit
                            your machinery requirement to the officer.
                        </p>

                    </div>

                </div>


                {/* ================= FORM CARD ================= */}

                <div className="request-form-card">

                    <div className="form-intro">

                        <div className="intro-icon">
                            📋
                        </div>

                        <div>

                            <h2>
                                Request Details
                            </h2>

                            <p>
                                Please provide accurate information
                                so the officer can process your request.
                            </p>

                        </div>

                    </div>


                    {/* ================= SUCCESS MESSAGE ================= */}

                    {message && (
                        <div className="success-message">
                            ✓ {message}
                        </div>
                    )}


                    {/* ================= ERROR MESSAGE ================= */}

                    {error && (
                        <div className="error-message">
                            ⚠ {error}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        {/* ================= FARMER DETAILS ================= */}

                        <div className="form-section">

                            <div className="section-title">

                                <span>01</span>

                                <div>

                                    <h3>
                                        Farmer Information
                                    </h3>

                                    <p>
                                        Basic information about the applicant
                                    </p>

                                </div>

                            </div>


                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        Farmer Name
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="farmerName"
                                        value={formData.farmerName}
                                        onChange={handleChange}
                                        placeholder="Enter farmer name"
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Number of Acres
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="number"
                                        name="acresOfLand"
                                        value={formData.acresOfLand}
                                        onChange={handleChange}
                                        placeholder="e.g. 5"
                                        min="0.1"
                                        step="0.1"
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* ================= DOCUMENT ================= */}

                        <div className="form-section">

                            <div className="section-title">

                                <span>02</span>

                                <div>

                                    <h3>
                                        Land Ownership / Cultivation Proof
                                    </h3>

                                    <p>
                                        Upload a document proving ownership
                                        or cultivation of the land.
                                    </p>

                                </div>

                            </div>


                            <div className="document-upload">

                                <div className="upload-icon">
                                    📄
                                </div>

                                <div className="upload-content">

                                    <h4>
                                        Upload Supporting Document
                                    </h4>

                                    <p>
                                        Land ownership document,
                                        cultivation proof or valid
                                        promissory/supporting document.
                                    </p>

                                    <span>
                                        JPG, PNG or PDF • Maximum 5 MB
                                    </span>

                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={handleFileChange}
                                    />

                                    {documentFile && (
                                        <div className="selected-file">
                                            ✓ {documentFile.name}
                                        </div>
                                    )}

                                </div>

                            </div>

                        </div>


                        {/* ================= MACHINERY REQUIREMENT ================= */}

                        <div className="form-section">

                            <div className="section-title">

                                <span>03</span>

                                <div>

                                    <h3>
                                        Machinery Requirement
                                    </h3>

                                    <p>
                                        Tell us what machinery you need
                                        and why you need it.
                                    </p>

                                </div>

                            </div>


                            <div className="form-group">

                                <label>
                                    Purpose of Using Machinery
                                    <span>*</span>
                                </label>

                                <textarea
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    placeholder="Explain what farming work you need the machinery for..."
                                    rows="4"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Machinery Required
                                    <span>*</span>
                                </label>

                                <select
                                    name="machineryRequired"
                                    value={formData.machineryRequired}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select machinery
                                    </option>

                                    <option value="Tractor">
                                        Tractor
                                    </option>

                                    <option value="Rotavator">
                                        Rotavator
                                    </option>

                                    <option value="Cultivator">
                                        Cultivator
                                    </option>

                                    <option value="Plough">
                                        Plough
                                    </option>

                                    <option value="Seed Drill">
                                        Seed Drill
                                    </option>

                                    <option value="Harvester">
                                        Harvester
                                    </option>

                                    <option value="Thresher">
                                        Thresher
                                    </option>

                                    <option value="Sprayer">
                                        Sprayer
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* ================= SCHEDULE ================= */}

                        <div className="form-section">

                            <div className="section-title">

                                <span>04</span>

                                <div>

                                    <h3>
                                        Required Schedule
                                    </h3>

                                    <p>
                                        Tell the officer when you need
                                        the machinery.
                                    </p>

                                </div>

                            </div>


                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        Required Date
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="date"
                                        name="requiredDate"
                                        value={formData.requiredDate}
                                        onChange={handleChange}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Required Time
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="time"
                                        name="requiredTime"
                                        value={formData.requiredTime}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Estimated Completion Time
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="estimatedCompletionTime"
                                        value={
                                            formData.estimatedCompletionTime
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. 4 hours"
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* ================= SUBMIT ================= */}

                        <div className="form-footer">

                            <div className="footer-note">

                                <span>🔒</span>

                                <p>
                                    Your information and uploaded document
                                    will be securely submitted for officer
                                    verification.
                                </p>

                            </div>


                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        navigate('/farmer-dashboard')
                                    }
                                    disabled={loading}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={loading}
                                >
                                    {loading
                                        ? 'Submitting...'
                                        : 'Submit Request →'}
                                </button>

                            </div>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default RequestMachinery;


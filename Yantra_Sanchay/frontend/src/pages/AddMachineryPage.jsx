
import React, { useState } from 'react';
import { machineryService } from '../services';
import './AddMachineryPage.css';

const AddMachineryPage = () => {

    const [formData, setFormData] = useState({
        machineryName: '',
        category: '',
        brand: '',
        model: '',
        description: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({
        type: '',
        text: '',
    });


    /* =========================================
       HANDLE INPUT CHANGE
    ========================================= */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        // Remove previous message when user edits the form
        if (message.text) {
            setMessage({
                type: '',
                text: '',
            });
        }
    };


    /* =========================================
       VALIDATE FORM
    ========================================= */

    const validateForm = () => {

        if (!formData.machineryName.trim()) {
            return 'Please enter the machinery name.';
        }

        if (!formData.category) {
            return 'Please select a machinery category.';
        }

        if (!formData.brand.trim()) {
            return 'Please enter the machinery brand.';
        }

        if (!formData.model.trim()) {
            return 'Please enter the machinery model.';
        }

        if (!formData.description.trim()) {
            return 'Please provide a short description.';
        }

        if (formData.description.trim().length < 10) {
            return 'Description should contain at least 10 characters.';
        }

        return '';
    };


    /* =========================================
       RESET FORM
    ========================================= */

    const resetForm = () => {

        setFormData({
            machineryName: '',
            category: '',
            brand: '',
            model: '',
            description: '',
        });
    };


    /* =========================================
       SUBMIT
    ========================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage({
            type: '',
            text: '',
        });


        const validationError = validateForm();

        if (validationError) {

            setMessage({
                type: 'error',
                text: validationError,
            });

            return;
        }


        try {

            setLoading(true);

            const response = await machineryService.create({
                machineryName: formData.machineryName.trim(),
                category: formData.category,
                brand: formData.brand.trim(),
                model: formData.model.trim(),
                description: formData.description.trim(),
            });


            if (response.data.success) {

                setMessage({
                    type: 'success',
                    text: 'Machinery has been added successfully.',
                });

                resetForm();

            } else {

                setMessage({
                    type: 'error',
                    text:
                        response.data.message ||
                        'Unable to add machinery.',
                });
            }

        } catch (error) {

            console.error(
                'Error adding machinery:',
                error
            );

            setMessage({
                type: 'error',
                text:
                    error.response?.data?.message ||
                    'Unable to add machinery. Please try again.',
            });

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="add-machinery-page">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="add-machinery-header">

                <div>

                    <span className="page-label">
                        MACHINERY MANAGEMENT
                    </span>

                    <h1>
                        Add Agricultural Machinery
                    </h1>

                    <p>
                        Register agricultural machinery on
                        Yantra Sanchay for farmers to discover
                        and access.
                    </p>

                </div>

                <div className="header-machinery-icon">
                    🚜
                </div>

            </div>


            {/* =========================================
                FORM CARD
            ========================================= */}

            <div className="machinery-form-card">

                <div className="form-heading">

                    <div className="form-heading-icon">
                        🚜
                    </div>

                    <div>

                        <h2>
                            Machinery Information
                        </h2>

                        <p>
                            Enter the basic details of the
                            agricultural machinery.
                        </p>

                    </div>

                </div>


                {/* =========================================
                    MESSAGE
                ========================================= */}

                {message.text && (

                    <div
                        className={`form-message ${message.type}`}
                    >

                        <span>
                            {message.type === 'success'
                                ? '✓'
                                : '⚠'}
                        </span>

                        <p>
                            {message.text}
                        </p>

                    </div>

                )}


                {/* =========================================
                    FORM
                ========================================= */}

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">


                        {/* MACHINERY NAME */}

                        <div className="form-group full-width">

                            <label htmlFor="machineryName">
                                Machinery Name
                                <span>*</span>
                            </label>

                            <input
                                id="machineryName"
                                name="machineryName"
                                type="text"
                                value={formData.machineryName}
                                placeholder="e.g. Mahindra Tractor 575 DI"
                                onChange={handleChange}
                                maxLength={100}
                                disabled={loading}
                            />

                            <small>
                                Enter the commonly used name of
                                the machinery.
                            </small>

                        </div>


                        {/* CATEGORY */}

                        <div className="form-group">

                            <label htmlFor="category">
                                Category
                                <span>*</span>
                            </label>

                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                disabled={loading}
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="Tractor">
                                    Tractor
                                </option>

                                <option value="Harvester">
                                    Harvester
                                </option>

                                <option value="Rotavator">
                                    Rotavator
                                </option>

                                <option value="Cultivator">
                                    Cultivator
                                </option>

                                <option value="Seed Drill">
                                    Seed Drill
                                </option>

                                <option value="Plough">
                                    Plough
                                </option>

                                <option value="Sprayer">
                                    Sprayer
                                </option>

                                <option value="Thresher">
                                    Thresher
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* BRAND */}

                        <div className="form-group">

                            <label htmlFor="brand">
                                Brand
                                <span>*</span>
                            </label>

                            <input
                                id="brand"
                                name="brand"
                                type="text"
                                value={formData.brand}
                                placeholder="e.g. Mahindra"
                                onChange={handleChange}
                                maxLength={50}
                                disabled={loading}
                            />

                        </div>


                        {/* MODEL */}

                        <div className="form-group">

                            <label htmlFor="model">
                                Model
                                <span>*</span>
                            </label>

                            <input
                                id="model"
                                name="model"
                                type="text"
                                value={formData.model}
                                placeholder="e.g. 575 DI"
                                onChange={handleChange}
                                maxLength={50}
                                disabled={loading}
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="form-group full-width">

                            <label htmlFor="description">
                                Description
                                <span>*</span>
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                placeholder="Describe the machinery, its use, condition, capacity, or any other important information..."
                                onChange={handleChange}
                                rows="5"
                                maxLength={500}
                                disabled={loading}
                            />

                            <div className="textarea-footer">

                                <small>
                                    Provide useful information
                                    for farmers.
                                </small>

                                <span>
                                    {formData.description.length}/500
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =========================================
                        INFORMATION NOTICE
                    ========================================= */}

                    <div className="verification-notice">

                        <div className="notice-icon">
                            ℹ️
                        </div>

                        <div>

                            <strong>
                                Verification Notice
                            </strong>

                            <p>
                                Submitted machinery may require
                                verification by the authorized
                                administrator before it becomes
                                available to farmers.
                            </p>

                        </div>

                    </div>


                    {/* =========================================
                        BUTTONS
                    ========================================= */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={resetForm}
                            disabled={loading}
                        >
                            Clear Form
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary add-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="button-spinner"></span>
                                    Adding Machinery...
                                </>
                            ) : (
                                <>
                                    🚜 Add Machinery
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>


            {/* =========================================
                FOOTER INFORMATION
            ========================================= */}

            <div className="add-machinery-footer">

                <span>🏛️</span>

                <p>
                    Yantra Sanchay — Digital Agricultural
                    Machinery Access Platform
                </p>

            </div>

        </div>
    );
};

export default AddMachineryPage;

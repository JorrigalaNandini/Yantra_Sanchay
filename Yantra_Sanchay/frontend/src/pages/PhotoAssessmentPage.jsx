
import React, { useState } from 'react';
import './PhotoAssessmentPage.css';

const PhotoAssessmentPage = () => {

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);

    const [assessment, setAssessment] = useState(null);

    const [error, setError] = useState('');

    /* =========================================
       IMAGE CHANGE
    ========================================= */

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        setError('');
        setAssessment(null);

        if (!file) {
            return;
        }

        // Check image type
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }

        // Maximum file size: 5 MB
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5 MB.');
            return;
        }

        setImage(file);

        const reader = new FileReader();

        reader.onloadend = () => {
            setPreview(reader.result);
        };

        reader.readAsDataURL(file);
    };


    /* =========================================
       REMOVE IMAGE
    ========================================= */

    const handleRemoveImage = () => {

        setImage(null);
        setPreview(null);
        setAssessment(null);
        setError('');

        // Reset file input
        const fileInput = document.getElementById(
            'farm-image-input'
        );

        if (fileInput) {
            fileInput.value = '';
        }
    };


    /* =========================================
       SUBMIT IMAGE
    ========================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');
        setAssessment(null);

        if (!image) {
            setError(
                'Please upload a farm image before starting the assessment.'
            );
            return;
        }

        try {

            setLoading(true);

            /*
             * -----------------------------------------
             * AI BACKEND CONNECTION
             * -----------------------------------------
             *
             * Later you can replace this section with:
             *
             * const formData = new FormData();
             * formData.append('image', image);
             *
             * const response = await photoAssessmentService
             *     .assess(formData);
             *
             * setAssessment(response.data.data);
             *
             * -----------------------------------------
             */

            // Temporary assessment simulation
            await new Promise(resolve =>
                setTimeout(resolve, 1800)
            );

            setAssessment({
                title: 'Farm Assessment Complete',
                summary:
                    'Your farm image has been analyzed successfully.',
                recommendations: [
                    'Tractor',
                    'Rotavator',
                    'Seed Drill'
                ],
                message:
                    'These machinery types may be suitable for your farm requirements. You can explore available machinery from the machinery section.'
            });

        } catch (err) {

            console.error(
                'Photo assessment error:',
                err
            );

            setError(
                'Unable to process the image. Please try again.'
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="photo-assessment-page">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="assessment-header">

                <div className="assessment-header-content">

                    <span className="assessment-label">
                        AI-ASSISTED FARM SUPPORT
                    </span>

                    <h1>
                        Farm Photo Assessment
                    </h1>

                    <p>
                        Upload a clear photo of your farm and
                        get intelligent agricultural machinery
                        recommendations.
                    </p>

                </div>

                <div className="assessment-header-icon">
                    📸
                </div>

            </div>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <div className="assessment-container">


                {/* =========================================
                    UPLOAD CARD
                ========================================= */}

                <div className="assessment-card">

                    <div className="assessment-card-heading">

                        <div className="heading-icon">
                            🌾
                        </div>

                        <div>

                            <h2>
                                Upload Farm Photo
                            </h2>

                            <p>
                                Choose a clear image of your
                                agricultural field.
                            </p>

                        </div>

                    </div>


                    {/* =========================================
                        ERROR
                    ========================================= */}

                    {error && (

                        <div className="assessment-error">

                            <span>⚠️</span>

                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* =========================================
                        IMAGE PREVIEW
                    ========================================= */}

                    {preview ? (

                        <div className="image-preview-container">

                            <div className="preview-header">

                                <div>

                                    <strong>
                                        Selected Farm Image
                                    </strong>

                                    <span>
                                        {image?.name}
                                    </span>

                                </div>

                                <button
                                    type="button"
                                    className="remove-image"
                                    onClick={handleRemoveImage}
                                    disabled={loading}
                                >
                                    ✕ Remove
                                </button>

                            </div>

                            <img
                                src={preview}
                                alt="Selected farm"
                                className="preview"
                            />

                        </div>

                    ) : (

                        /* =========================================
                           UPLOAD AREA
                        ========================================= */

                        <label
                            htmlFor="farm-image-input"
                            className="upload-area"
                        >

                            <div className="upload-icon">
                                📷
                            </div>

                            <h3>
                                Upload a farm photo
                            </h3>

                            <p>
                                Click here to select an image
                                from your device
                            </p>

                            <span>
                                JPG, JPEG or PNG • Maximum 5 MB
                            </span>

                            <div className="choose-image-button">
                                Choose Image
                            </div>

                        </label>

                    )}


                    {/* =========================================
                        FORM
                    ========================================= */}

                    <form onSubmit={handleSubmit}>

                        <input
                            id="farm-image-input"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageChange}
                            hidden
                        />


                        {/* =========================================
                            IMAGE GUIDELINES
                        ========================================= */}

                        {!preview && (

                            <div className="image-guidelines">

                                <div>
                                    <span>✓</span>
                                    Take a clear photo
                                </div>

                                <div>
                                    <span>✓</span>
                                    Include the field area
                                </div>

                                <div>
                                    <span>✓</span>
                                    Avoid blurry images
                                </div>

                            </div>

                        )}


                        {/* =========================================
                            SUBMIT BUTTON
                        ========================================= */}

                        <button
                            type="submit"
                            className="btn btn-primary assessment-button"
                            disabled={!image || loading}
                        >

                            {loading ? (

                                <>
                                    <span className="assessment-spinner"></span>
                                    Analyzing Farm...
                                </>

                            ) : (

                                <>
                                    🔍 Get Farm Assessment
                                </>

                            )}

                        </button>

                    </form>

                </div>


                {/* =========================================
                    RESULT
                ========================================= */}

                {assessment && (

                    <div className="assessment-result">

                        <div className="result-header">

                            <div className="result-success-icon">
                                ✓
                            </div>

                            <div>

                                <span>
                                    ASSESSMENT RESULT
                                </span>

                                <h2>
                                    {assessment.title}
                                </h2>

                            </div>

                        </div>


                        <p className="result-summary">
                            {assessment.summary}
                        </p>


                        <div className="recommendation-section">

                            <h3>
                                Recommended Machinery
                            </h3>

                            <div className="recommendation-list">

                                {assessment.recommendations.map(
                                    (item, index) => (

                                        <div
                                            className="recommendation-item"
                                            key={index}
                                        >

                                            <span className="recommendation-icon">
                                                🚜
                                            </span>

                                            <span>
                                                {item}
                                            </span>

                                            <span className="recommendation-arrow">
                                                →
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        <div className="result-message">

                            <span>💡</span>

                            <p>
                                {assessment.message}
                            </p>

                        </div>

                    </div>

                )}

            </div>


            {/* =========================================
                INFORMATION FOOTER
            ========================================= */}

            <div className="assessment-footer">

                <span>🏛️</span>

                <p>
                    Yantra Sanchay • Smart Agricultural
                    Machinery Assistance
                </p>

            </div>

        </div>
    );
};

export default PhotoAssessmentPage;


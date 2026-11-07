
import React, { useEffect, useRef, useState } from 'react';
import './TellMeWhatYouNeedPage.css';

const TellMeWhatYouNeedPage = () => {

    const [query, setQuery] = useState('');

    const [isListening, setIsListening] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);

    const [error, setError] = useState('');

    const [message, setMessage] = useState('');

    const [language, setLanguage] = useState('en-IN');

    const [speechSupported, setSpeechSupported] = useState(true);

    const recognitionRef = useRef(null);


    /* =========================================
       SPEECH RECOGNITION SETUP
    ========================================= */

    useEffect(() => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            setSpeechSupported(false);

            return;
        }


        const recognition = new SpeechRecognition();

        recognition.continuous = false;

        recognition.interimResults = true;

        recognition.lang = language;


        recognition.onstart = () => {

            setIsListening(true);

            setError('');

            setMessage('Listening... Please speak clearly.');
        };


        recognition.onresult = (event) => {

            let finalText = '';
            let interimText = '';


            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                const transcript =
                    event.results[i][0].transcript;


                if (event.results[i].isFinal) {

                    finalText += transcript;

                } else {

                    interimText += transcript;

                }

            }


            if (finalText) {

                setQuery((previous) => {

                    const separator =
                        previous.trim() ? ' ' : '';

                    return (
                        previous.trim() +
                        separator +
                        finalText.trim()
                    );
                });

                setMessage(
                    'Voice input added successfully.'
                );
            }


            if (interimText) {

                setMessage(
                    `Listening: ${interimText}`
                );
            }

        };


        recognition.onerror = (event) => {

            console.error(
                'Speech recognition error:',
                event.error
            );


            setIsListening(false);


            if (event.error === 'not-allowed') {

                setError(
                    'Microphone permission was denied. Please allow microphone access in your browser.'
                );

            } else if (event.error === 'no-speech') {

                setError(
                    'No speech detected. Please try speaking again.'
                );

            } else if (event.error === 'network') {

                setError(
                    'Speech recognition needs an internet connection in this browser.'
                );

            } else {

                setError(
                    'Unable to recognize your voice. Please try again.'
                );
            }

            setMessage('');
        };


        recognition.onend = () => {

            setIsListening(false);

        };


        recognitionRef.current = recognition;


        return () => {

            try {

                recognition.stop();

            } catch {
                // Recognition may already be stopped.
            }

        };

    }, [language]);


    /* =========================================
       START / STOP VOICE INPUT
    ========================================= */

    const toggleListening = () => {

        if (!speechSupported) {

            setError(
                'Voice input is not supported by this browser. Please use Google Chrome or Microsoft Edge.'
            );

            return;
        }


        if (!recognitionRef.current) {

            setError(
                'Voice recognition is not available.'
            );

            return;
        }


        setError('');

        setMessage('');


        if (isListening) {

            recognitionRef.current.stop();

            setIsListening(false);

            return;
        }


        try {

            recognitionRef.current.lang = language;

            recognitionRef.current.start();

        } catch (err) {

            console.error(err);

            setError(
                'Could not start the microphone. Please try again.'
            );
        }

    };


    /* =========================================
       CHANGE LANGUAGE
    ========================================= */

    const handleLanguageChange = (e) => {

        const selectedLanguage =
            e.target.value;

        setLanguage(selectedLanguage);

        setError('');

        setMessage(
            'Language changed. Tap the microphone and speak.'
        );


        if (isListening) {

            try {

                recognitionRef.current.stop();

            } catch {
                // Ignore stop errors.
            }

        }

    };


    /* =========================================
       TEXT INPUT
    ========================================= */

    const handleQueryChange = (e) => {

        setQuery(e.target.value);

        setError('');

        setMessage('');
    };


    /* =========================================
       CLEAR INPUT
    ========================================= */

    const clearQuery = () => {

        setQuery('');

        setError('');

        setMessage('');
    };


    /* =========================================
       EXAMPLE QUERY
    ========================================= */

    const useExample = (text) => {

        setQuery(text);

        setError('');

        setMessage(
            'Example added. You can edit it or submit it.'
        );
    };


    /* =========================================
       SUBMIT REQUEST
    ========================================= */

    const handleSearch = async (e) => {

        e.preventDefault();


        const cleanedQuery =
            query.trim();


        if (!cleanedQuery) {

            setError(
                'Please tell us what machinery you need.'
            );

            return;
        }


        if (cleanedQuery.length < 5) {

            setError(
                'Please provide a little more information about your requirement.'
            );

            return;
        }


        setError('');

        setMessage('');

        setIsProcessing(true);


        try {

            /*
             * IMPORTANT:
             *
             * At this point the farmer's spoken/typed
             * requirement is ready to be sent to your
             * AI/NLP backend.
             *
             * Example backend request:
             *
             * POST /api/recommendations
             *
             * {
             *     query: cleanedQuery,
             *     language: language
             * }
             *
             * Connect your existing recommendation
             * service here when it is available.
             */


            console.log(
                'Machinery requirement:',
                cleanedQuery
            );

            console.log(
                'Selected language:',
                language
            );


            /*
             * Temporary processing delay so the UI
             * behaves like a real recommendation system.
             */

            await new Promise(
                resolve => setTimeout(resolve, 700)
            );


            setMessage(
                'Your requirement has been understood. Machinery recommendations are ready to be connected to your AI recommendation service.'
            );

        } catch (err) {

            console.error(
                'Recommendation error:',
                err
            );

            setError(
                'Unable to process your requirement. Please try again.'
            );

        } finally {

            setIsProcessing(false);

        }

    };


    /* =========================================
       LANGUAGE NAME
    ========================================= */

    const getLanguageName = () => {

        const languages = {
            'en-IN': 'English',
            'te-IN': 'తెలుగు',
            'hi-IN': 'हिन्दी',
            'kn-IN': 'ಕನ್ನಡ',
            'ta-IN': 'தமிழ்',
            'mr-IN': 'मराठी'
        };

        return languages[language] || 'English';
    };


    return (

        <div className="tell-me-page">


            {/* =========================================
                HERO
            ========================================= */}

            <section className="tell-me-hero">

                <div className="hero-content">

                    <span className="hero-label">
                        🌾 SMART FARMER ASSISTANT
                    </span>

                    <h1>
                        Tell Me What You Need
                    </h1>

                    <p>
                        You don't need to know the name of
                        the machine. Just tell us what you
                        want to do on your farm.
                    </p>

                </div>


                <div className="hero-illustration">
                    🚜
                </div>

            </section>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <div className="tell-me-content">


                {/* =========================================
                    VOICE CARD
                ========================================= */}

                <section className="voice-card">

                    <div className="voice-card-top">

                        <div className="voice-icon">
                            🎙️
                        </div>

                        <div>

                            <h2>
                                Speak Your Requirement
                            </h2>

                            <p>
                                Not comfortable typing?
                                No problem. Just speak.
                            </p>

                        </div>

                    </div>


                    <div className="voice-controls">

                        <button
                            type="button"
                            className={
                                isListening
                                    ? 'mic-button listening'
                                    : 'mic-button'
                            }
                            onClick={toggleListening}
                            disabled={isProcessing}
                        >

                            <span className="mic-symbol">
                                {isListening
                                    ? '⏹'
                                    : '🎙️'}
                            </span>

                            <span>
                                {isListening
                                    ? 'Stop Listening'
                                    : 'Tap to Speak'}
                            </span>

                        </button>


                        <div className="language-control">

                            <label htmlFor="language">
                                Language
                            </label>

                            <select
                                id="language"
                                value={language}
                                onChange={
                                    handleLanguageChange
                                }
                                disabled={
                                    isListening ||
                                    isProcessing
                                }
                            >

                                <option value="en-IN">
                                    English
                                </option>

                                <option value="te-IN">
                                    తెలుగు (Telugu)
                                </option>

                                <option value="hi-IN">
                                    हिन्दी (Hindi)
                                </option>

                                <option value="kn-IN">
                                    ಕನ್ನಡ (Kannada)
                                </option>

                                <option value="ta-IN">
                                    தமிழ் (Tamil)
                                </option>

                                <option value="mr-IN">
                                    मराठी (Marathi)
                                </option>

                            </select>

                        </div>

                    </div>


                    {isListening && (

                        <div className="listening-indicator">

                            <span className="sound-wave">
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                            </span>

                            <span>
                                Listening in{' '}
                                {getLanguageName()}...
                            </span>

                        </div>

                    )}


                    {!speechSupported && (

                        <div className="browser-warning">

                            ⚠️ Voice input is not supported
                            by this browser. Please use
                            Google Chrome or Microsoft Edge.

                        </div>

                    )}

                </section>


                {/* =========================================
                    REQUEST FORM
                ========================================= */}

                <section className="request-card">

                    <div className="request-heading">

                        <div>

                            <span className="step-number">
                                1
                            </span>

                            <div>

                                <h2>
                                    Describe Your Requirement
                                </h2>

                                <p>
                                    Type your requirement or
                                    use the microphone above.
                                </p>

                            </div>

                        </div>


                        {query && (

                            <button
                                type="button"
                                className="clear-button"
                                onClick={clearQuery}
                            >
                                Clear
                            </button>

                        )}

                    </div>


                    <form onSubmit={handleSearch}>

                        <div className="textarea-wrapper">

                            <textarea
                                value={query}
                                onChange={handleQueryChange}
                                placeholder="Example: I need a tractor for preparing 5 acres of paddy field next week..."
                                rows="6"
                                disabled={isProcessing}
                                aria-label="Describe your machinery requirement"
                            />

                            <div className="character-count">
                                {query.length} characters
                            </div>

                        </div>


                        {/* =====================================
                            EXAMPLES
                        ===================================== */}

                        <div className="examples">

                            <span>
                                Try saying:
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    useExample(
                                        'I need a tractor for preparing my 5 acre paddy field.'
                                    )
                                }
                            >
                                🚜 Need a tractor
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    useExample(
                                        'I need a harvester for harvesting paddy next week.'
                                    )
                                }
                            >
                                🌾 Need a harvester
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    useExample(
                                        'I need a rotavator for preparing my field.'
                                    )
                                }
                            >
                                🌱 Need a rotavator
                            </button>

                        </div>


                        {/* =====================================
                            ERROR / SUCCESS
                        ===================================== */}

                        {error && (

                            <div className="form-message error">

                                <span>
                                    ⚠️
                                </span>

                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        {message && !error && (

                            <div className="form-message success">

                                <span>
                                    ✓
                                </span>

                                <p>
                                    {message}
                                </p>

                            </div>

                        )}


                        {/* =====================================
                            SUBMIT
                        ===================================== */}

                        <button
                            type="submit"
                            className="find-machinery-button"
                            disabled={
                                isProcessing ||
                                !query.trim()
                            }
                        >

                            {isProcessing ? (

                                <>
                                    <span className="button-spinner"></span>

                                    Understanding Your
                                    Requirement...
                                </>

                            ) : (

                                <>
                                    🔎 Find Suitable Machinery
                                </>

                            )}

                        </button>

                    </form>

                </section>


                {/* =========================================
                    HOW IT WORKS
                ========================================= */}

                <section className="how-it-works">

                    <div className="section-heading">

                        <span>
                            SIMPLE FOR EVERY FARMER
                        </span>

                        <h2>
                            How It Works
                        </h2>

                    </div>


                    <div className="steps">

                        <div className="step">

                            <div className="step-icon">
                                🎙️
                            </div>

                            <span className="step-number-small">
                                01
                            </span>

                            <h3>
                                Speak
                            </h3>

                            <p>
                                Tell us what you need in
                                your own language.
                            </p>

                        </div>


                        <div className="step-line"></div>


                        <div className="step">

                            <div className="step-icon">
                                🧠
                            </div>

                            <span className="step-number-small">
                                02
                            </span>

                            <h3>
                                We Understand
                            </h3>

                            <p>
                                The system understands your
                                farming requirement.
                            </p>

                        </div>


                        <div className="step-line"></div>


                        <div className="step">

                            <div className="step-icon">
                                🚜
                            </div>

                            <span className="step-number-small">
                                03
                            </span>

                            <h3>
                                Get Machinery
                            </h3>

                            <p>
                                Receive suitable machinery
                                recommendations.
                            </p>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    ACCESSIBILITY NOTE
                ========================================= */}

                <div className="accessibility-note">

                    <span>
                        🏛️
                    </span>

                    <div>

                        <strong>
                            Designed for Every Farmer
                        </strong>

                        <p>
                            You can speak instead of typing.
                            Choose your preferred Indian
                            language and describe your
                            requirement naturally.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default TellMeWhatYouNeedPage;


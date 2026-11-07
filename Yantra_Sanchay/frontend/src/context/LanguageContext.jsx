import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
    english: {
        home: 'Home',
        login: 'Login',
        register: 'Register',
        dashboard: 'Dashboard',
        findMachinery: 'Find Machinery',
        tellMeWhatYouNeed: 'Tell Me What You Need',
        photoAssessment: 'Photo Assessment',
        pooling: 'Machinery Pooling',
        myRequests: 'My Requests',
        addMachinery: 'Add Machinery',
        manageMachinery: 'Manage Machinery',
        adminDashboard: 'Admin Dashboard',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        phone: 'Phone',
        name: 'Name',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        offline: 'Offline Mode',
        online: 'Online',
        syncing: 'Syncing...',
        allChangesSynced: 'All changes synchronized',
    },
    telugu: {
        home: 'హోమ్',
        login: 'లాగిన్',
        register: 'నమోదు',
        dashboard: 'డ్యాష్‌బోర్డ్',
        findMachinery: 'యంత్రాలను కనుగొనండి',
        tellMeWhatYouNeed: 'మీకు ఏమి కావాలో చెప్పండి',
        photoAssessment: 'ఫోటో మూల్యాంకనం',
        pooling: 'యంత్రం పూలింగ్',
        myRequests: 'నా అభ్యర్థనలు',
        addMachinery: 'యంత్రం జోడించండి',
        manageMachinery: 'యంత్రాలను నిర్వహించండి',
        adminDashboard: 'నిర్వాహక డ్యాష్‌బోర్డ్',
        logout: 'లాగ్ అవుట్',
        email: 'ఇమెయిల్',
        password: 'పాస్‌వర్డ్',
        phone: 'ఫోన్',
        name: 'పేరు',
    },
    hindi: {
        home: 'घर',
        login: 'लॉगिन',
        register: 'पंजीकरण',
        dashboard: 'डैशबोर्ड',
        findMachinery: 'कृषि यंत्र खोजें',
        tellMeWhatYouNeed: 'बताएं आपको क्या चाहिए',
        photoAssessment: 'फोटो आकलन',
        pooling: 'यंत्र पूलिंग',
        myRequests: 'मेरे अनुरोध',
        addMachinery: 'यंत्र जोड़ें',
        manageMachinery: 'यंत्र प्रबंधित करें',
        adminDashboard: 'व्यवस्थापक डैशबोर्ड',
        logout: 'लॉग आउट',
        email: 'ईमेल',
        password: 'पासवर्ड',
        phone: 'फोन',
        name: 'नाम',
    },
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'english');

    const translate = (key) => {
        return translations[language]?.[key] || translations['english'][key] || key;
    };

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    return (
        <LanguageContext.Provider value={{ language, translate, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

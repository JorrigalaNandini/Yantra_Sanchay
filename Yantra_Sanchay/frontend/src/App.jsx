
import React, { useEffect, useState, useCallback } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation
} from 'react-router-dom';

import { LanguageProvider } from './context/LanguageContext';
import { useOnlineStatus } from './hooks/useOnlineStatus';

// =========================================
// PUBLIC PAGES
// =========================================

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import RequestMachinery from './pages/RequestMachinery';

// =========================================
// FARMER PAGES
// =========================================

import FarmerDashboard from './pages/FarmerDashboard';
import FindMachineryPage from './pages/FindMachineryPage';
import MachineryDetailsPage from './pages/MachineryDetailsPage';
import TellMeWhatYouNeedPage from './pages/TellMeWhatYouNeedPage';
import PhotoAssessmentPage from './pages/PhotoAssessmentPage';
import PoolingPage from './pages/PoolingPage';
import MyRequestsPage from './pages/MyRequestsPage';

// =========================================
// PROVIDER PAGES
// =========================================

import OfficerDashboard from "./pages/OfficerDashboard";
import AddMachineryPage from './pages/AddMachineryPage';

// =========================================
// ADMIN PAGES
// =========================================

import AdminDashboard from './pages/AdminDashboard';

// =========================================
// COMPONENTS
// =========================================

import ProtectedRoute, { getDashboardPath } from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';

import './App.css';


// =====================================================
// AUTHENTICATION HELPERS
// =====================================================

const getStoredUser = () => {

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
        return null;
    }

    try {

        const parsedUser = JSON.parse(storedUser);

        if (!parsedUser || typeof parsedUser !== 'object') {
            return null;
        }

        return parsedUser;

    } catch (error) {

        console.error(
            'Error parsing stored user:',
            error
        );

        localStorage.removeItem('user');

        return null;
    }
};


// =====================================================
// AUTH REDIRECT
// Prevent logged-in users from opening login/register
// =====================================================

const PublicOnlyRoute = ({ user, children }) => {

    if (user) {

        return (
            <Navigate
                to={getDashboardPath(user)}
                replace
            />
        );
    }

    return children;
};


// =====================================================
// ROLE LANDING ROUTE
// =====================================================

const DashboardRedirect = ({ user }) => {

    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return (
        <Navigate
            to={getDashboardPath(user)}
            replace
        />
    );
};


// =====================================================
// APP CONTENT
// =====================================================

const AppContent = ({ user, setUser }) => {

    const location = useLocation();

    const {
        isOnline,
        isSyncing
    } = useOnlineStatus();


    // =========================================
    // LOGOUT HANDLER
    // =========================================

    const handleLogout = useCallback(() => {

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Remove possible authentication/session
        // related data if present.
        localStorage.removeItem('authUser');

        setUser(null);

        window.location.href = '/login';

    }, [setUser]);


    // =========================================
    // KEEP USER STATE IN SYNC
    // =========================================

    useEffect(() => {

        const handleStorageChange = () => {

            const updatedUser = getStoredUser();

            setUser(updatedUser);
        };


        window.addEventListener(
            'storage',
            handleStorageChange
        );


        return () => {

            window.removeEventListener(
                'storage',
                handleStorageChange
            );

        };

    }, [setUser]);


    // =========================================
    // AUTH EVENTS
    // Useful when login updates localStorage
    // =========================================

    useEffect(() => {

        const handleAuthChange = () => {

            const updatedUser = getStoredUser();

            setUser(updatedUser);

        };


        window.addEventListener(
            'authChange',
            handleAuthChange
        );


        return () => {

            window.removeEventListener(
                'authChange',
                handleAuthChange
            );

        };

    }, [setUser]);


    // =========================================
    // PUBLIC AUTH PAGES
    // =========================================

    const isAuthPage =
        location.pathname === '/login' ||
        location.pathname === '/register' ||
        location.pathname === '/role-selection';


    return (

        <div className="app">


            {/* =========================================
                HEADER
            ========================================= */}

            <Header
                user={user}
                setUser={setUser}
                onLogout={handleLogout}
            />


            {/* =========================================
                ONLINE / OFFLINE STATUS
            ========================================= */}

            <div
                className={`status-indicator ${isOnline
                    ? 'online'
                    : 'offline'
                    }`}
                role="status"
                aria-live="polite"
            >

                {isSyncing
                    ? '⟳ Syncing...'
                    : isOnline
                        ? '✓ Online'
                        : '✗ Offline Mode'}

            </div>


            {/* =========================================
                OFFLINE INFORMATION
            ========================================= */}

            {!isOnline && !isAuthPage && (

                <div className="offline-banner">

                    <span>
                        📡
                    </span>

                    <div>

                        <strong>
                            You are offline
                        </strong>

                        <p>
                            You can continue using
                            available offline features.
                            Your changes will sync when
                            internet connection returns.
                        </p>

                    </div>

                </div>

            )}


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <main className="main-content">

                <Routes>


                    {/* =================================================
                        PUBLIC ROUTES
                    ================================================= */}


                    <Route
                        path="/"
                        element={
                            <HomePage />
                        }
                    />


                    <Route
                        path="/login"
                        element={
                            <PublicOnlyRoute user={user}>
                                <LoginPage
                                    setUser={setUser}
                                />
                            </PublicOnlyRoute>
                        }
                    />


                    <Route
                        path="/register"
                        element={
                            <PublicOnlyRoute user={user}>
                                <RegisterPage />
                            </PublicOnlyRoute>
                        }
                    />


                    <Route
                        path="/role-selection"
                        element={
                            <PublicOnlyRoute user={user}>
                                <RoleSelectionPage />
                            </PublicOnlyRoute>
                        }
                    />


                    {/* =================================================
                        DASHBOARD REDIRECT
                    ================================================= */}

                    <Route
                        path="/dashboard"
                        element={
                            <DashboardRedirect
                                user={user}
                            />
                        }
                    />


                    {/* =================================================
                        FARMER ROUTES
                    ================================================= */}


                    <Route
                        path="/farmer/dashboard"
                        element={
                            <ProtectedRoute
                                role="farmer"
                                element={
                                    <FarmerDashboard />
                                }
                            />
                        }
                    />
                    <Route
                        path="/request-machinery"
                        element={<RequestMachinery />}
                    />


                    <Route
                        path="/find-machinery"
                        element={
                            <ProtectedRoute
                                role="farmer"
                                element={
                                    <FindMachineryPage />
                                }
                            />
                        }
                    />


                    <Route
                        path="/machinery/:id"
                        element={
                            <ProtectedRoute
                                role="farmer"
                                element={
                                    <MachineryDetailsPage />
                                }
                            />
                        }
                    />


                    <Route
                        path="/tell-me-what-you-need"
                        element={
                            <ProtectedRoute
                                role="farmer"
                                element={
                                    <TellMeWhatYouNeedPage />
                                }
                            />
                        }
                    />


                    <Route
                        path="/farm-assessment"
                        element={
                            <ProtectedRoute
                                role="farmer"
                                element={
                                    <PhotoAssessmentPage />
                                }
                            />
                        }
                    />


                    <Route
                        path="/pooling"
                        element={
                            <ProtectedRoute
                                role="farmer"
                                element={
                                    <PoolingPage />
                                }
                            />
                        }
                    />


                    <Route
                        path="/my-requests"
                        element={
                            <ProtectedRoute
                                role="farmer"
                                element={
                                    <MyRequestsPage />
                                }
                            />
                        }
                    />


                    {/* =================================================
                        MACHINERY PROVIDER ROUTES
                    ================================================= */}


                    <Route
                        path="/provider/dashboard"
                        element={
                            <ProtectedRoute
                                role="machinery_provider"
                                element={
                                    <OfficerDashboard />
                                }
                            />
                        }
                    />


                    <Route
                        path="/add-machinery"
                        element={
                            <ProtectedRoute
                                role="machinery_provider"
                                element={
                                    <AddMachineryPage />
                                }
                            />
                        }
                    />


                    <Route
                        path="/machinery/edit/:id"
                        element={
                            <ProtectedRoute
                                role="machinery_provider"
                                element={
                                    <AddMachineryPage />
                                }
                            />
                        }
                    />


                    {/* =================================================
                        ADMIN ROUTES
                    ================================================= */}


                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute
                                role="admin"
                                element={
                                    <AdminDashboard />
                                }
                            />
                        }
                    />


                    {/* =================================================
                        UNKNOWN ROUTES
                    ================================================= */}

                    <Route
                        path="*"
                        element={
                            user ? (
                                <DashboardRedirect
                                    user={user}
                                />
                            ) : (
                                <Navigate
                                    to="/"
                                    replace
                                />
                            )
                        }
                    />

                </Routes>

            </main>


            {/* =========================================
                FOOTER
            ========================================= */}

            <Footer />

        </div>
    );
};


// =====================================================
// MAIN APP
// =====================================================

function App() {

    const [user, setUser] = useState(
        getStoredUser
    );


    /*
     * Listen for login/logout changes from
     * other parts of the application.
     */

    useEffect(() => {

        const checkAuthentication = () => {

            setUser(
                getStoredUser()
            );

        };


        window.addEventListener(
            'authChange',
            checkAuthentication
        );


        return () => {

            window.removeEventListener(
                'authChange',
                checkAuthentication
            );

        };

    }, []);


    return (

        <LanguageProvider>

            <BrowserRouter>

                <AppContent
                    user={user}
                    setUser={setUser}
                />

            </BrowserRouter>

        </LanguageProvider>
    );
}


export default App;


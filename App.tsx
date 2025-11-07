import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WardrobeProvider, useWardrobe } from './context/WardrobeContext';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import WardrobePage from './pages/WardrobePage';
import AddItemPage from './pages/AddItemPage';
import StylistPage from './pages/StylistPage';
import OutfitResultsPage from './pages/OutfitResultsPage';
import ChatPage from './pages/ChatPage';
import RateOutfitPage from './pages/RateOutfitPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LoadingSpinner from './components/LoadingSpinner';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner message="Loading..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

// Public route wrapper (redirect to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner message="Loading..." />;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

// A small component to render the main layout and consume context
const AppLayout: React.FC = () => {
    const { loading } = useWardrobe();

    return (
        <div className="min-h-screen flex flex-col">
            {loading && <LoadingSpinner message="Working..." />}
            <Header />
            <main className="flex-grow">
                <Routes>
                    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/wardrobe" element={<ProtectedRoute><WardrobePage /></ProtectedRoute>} />
                    <Route path="/wardrobe/new" element={<ProtectedRoute><AddItemPage /></ProtectedRoute>} />
                    <Route path="/stylist" element={<ProtectedRoute><StylistPage /></ProtectedRoute>} />
                    <Route path="/stylist/results" element={<ProtectedRoute><OutfitResultsPage /></ProtectedRoute>} />
                    <Route path="/rate-outfit" element={<ProtectedRoute><RateOutfitPage /></ProtectedRoute>} />
                    <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>
        </div>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
        <WardrobeProvider>
            <HashRouter>
                <AppLayout />
            </HashRouter>
        </WardrobeProvider>
    </AuthProvider>
  );
};

export default App;
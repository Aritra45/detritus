import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Registration from './Registration';
import Login from './Login';
import Home from './Home';
import YourProducts from './YourProducts';
import Profile from './Profile';
import ProductCard from './ProductCard';
import AboutUs from './AboutUs';
import YourInterest from './YourInterest';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from './LandingPage';  // Import the LandingPage component

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Route to the landing page at the root URL */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Other existing routes */}
                    <Route path="/register" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<ProtectedRoute element={Home} />} />
                    <Route path="/interest" element={<ProtectedRoute element={YourInterest} />} />
                    <Route path="/products" element={<ProtectedRoute element={YourProducts} />} />
                    <Route path="/productCard" element={<ProtectedRoute element={ProductCard} />} />
                    <Route path="/about" element={<ProtectedRoute element={AboutUs} />} />
                    <Route path="/profile" element={<ProtectedRoute element={Profile} />} />

                    {/* Default redirect to /home */}
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;

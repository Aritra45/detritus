import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './LandingPage.css';
import logo from './images/logo.png';
import heroImage from './images/landingimage.png'; // Replace with your image
import Footer from './Footer';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Function to handle the Get Started button click
    const handleGetStarted = () => {
        navigate('/login'); // Navigate to the login page
    };

    return (
        <div className="landing-page-wrapper"> {/* Added this wrapper */}
            <div className="navbar-container">
                <nav className="navbar">
                    <div className="logo">
                        <img src={logo} alt="Logo" />
                    </div>
                    <div className="menu-notification">
                        <div className="menu-icon" onClick={toggleMenu}>
                            ☰
                        </div>
                    </div>
                    <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                        <li><a href="/login">Sign In</a></li>
                        <li><a href="/registration">Sign Up</a></li>
                    </ul>
                </nav>
            </div>
            <div className="landing-page">
                <div className="content-left">
                    <header className="hero-section">
                        <h1>Welcome to <span>DETRITUS</span></h1>
                        <p>At Detritus, we believe in giving new life to old treasures.
                            Our platform connects sellers who want to part with their pre-loved items 
                            with buyers who see the value in second-hand goods.
                            Whether you’re looking to declutter your home or find a unique item at a great price, 
                            Detritus is here to make the process easy and enjoyable.
                        </p>
                        <button className="hero-button" onClick={handleGetStarted}>Explore Now ➜</button>
                    </header>
                </div>
                <div className="image-right">
                    <img src={heroImage} alt="Hero" className="hero-image" />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LandingPage;

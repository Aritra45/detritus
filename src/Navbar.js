import React, { useState } from 'react';
import './Navbar.css';
import logo from './images/logo.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
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
                    <li><a href="/home">Home</a></li>
                    <li><a href="/interest">Your Interest</a></li>
                    <li><a href="/products">Your Products</a></li>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/profile">Profile</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;

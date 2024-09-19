import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          Copyright &copy; {new Date().getFullYear()} All rights reserved | This Website is made by 
          <a href="/home" rel="noopener noreferrer">DETRITUS</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

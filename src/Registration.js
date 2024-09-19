import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from './firebaseConfig'; // Import Firestore
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import countryCodes from './countryCodes'; // Import country codes
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
const Registration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [otpSent, setOtpSent] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isVerified, setIsVerified] = useState(false); // Verification status
    const [showModal, setShowModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const auth = getAuth();
    const [generatedOtp, setGeneratedOtp] = useState('');

    // Function to generate OTP
    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
    };

    // Function to handle sending OTP to email
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (email) {
            const otp = generateOtp(); // Generate OTP
            setGeneratedOtp(otp); // Store the generated OTP
            setOtpSent(true);
            setEnteredOtp(''); // Clear the entered OTP field
            setIsVerified(false); // Reset verification status

            // Here you will send the OTP via email using your backend API
            try {
                await fetch('http://localhost:3000/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        otp: otp,
                    }),
                });
                
                alert('OTP sent to your email!');
            } catch (error) {
                console.error('Error sending email:', error);
            }
        } else {
            alert('Please enter a valid email.');
        }
    };

    // Function to handle OTP verification
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (enteredOtp === generatedOtp) {
            alert('OTP verified!');
            setIsVerified(true); // Set verified status to true
        } else {
            alert('Incorrect OTP. Please try again.');
        }
    };

    // Function to handle form submission
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!isVerified) {
            alert("Please verify your email by entering the OTP.");
            return;
        }
        if (password !== retypePassword) {
            alert("Passwords don't match.");
            return;
        }
        if (!termsAccepted) {
            alert("You must accept the Terms and Conditions.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user information in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email,
                phone: `${countryCode}${phone}`, // Combine country code and phone
                // Optionally, you can add other fields here
            });

            alert('User registered successfully!');
            navigate('/login');
            // Additional logic (e.g., redirecting the user) can go here
        } catch (error) {
            console.error("Error registering user:", error);
            alert(error.message);
        }
    };

    return (
        <div className="registration-container">
            <h2>Registration For DETRITUS</h2>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <div className="input-container">
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="button" id='otp' onClick={handleSendOtp} className="otp-button">Send OTP</button>
                    </div>
                </div>

                {otpSent && (
                    <div className="form-group otp-verification">
                        <label htmlFor="otp">Enter OTP</label>
                        <input
                            id="otpv"
                            type="text"
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            required
                            disabled={isVerified} // Disable input if verified
                        />
                        <button
                            type="button"
                            className="otp-button"
                            id='otp'
                            onClick={handleVerifyOtp}
                            disabled={isVerified} // Disable button if verified
                        >
                            {isVerified ? 'Verified' : 'Verify OTP'}
                        </button>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input" style={{ position: 'relative' }}>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                        <i 
                            className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} 
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                        </div>
                </div>

                <div className="form-group">
                    <label htmlFor="retypePassword">Retype Password</label>
                    <div className="password-input" style={{ position: 'relative' }}>
                    <input
                        id="retypePassword"
                        type={showPassword ? "text" : "password"}
                        value={retypePassword}
                        onChange={(e) => setRetypePassword(e.target.value)}
                        required
                    />
                        <i 
                            className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} 
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                        </div>
                </div>

                <div className="form-group phone-input">
                    <label htmlFor="phone">Phone</label>
                    <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                    >
                        {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>{country.name} ({country.code})</option>
                        ))}
                    </select>
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        required
                    />
                        <span>
                        I agree to the{' '}
                        <a className="terms-button" onClick={() => setShowModal(true)}>
                            Terms and Conditions
                        </a>
                    </span>
                </div>

                <button type="submit" id='but' className='register-but'>Register</button>
            </form>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Terms and Conditions for Detritus</h2>
                        <p>1. Introduction: Welcome to Detritus! These terms outline the rules and regulations for using our website.</p>
                        <p>2. Acceptance of Terms: By accessing this website, we assume you accept these terms. Do not continue to use Detritus if you do not agree to all the terms and conditions stated here.</p>
                        <p>3. User Accounts: Users must create an account to sell or buy products. Users are responsible for maintaining the confidentiality of their account information.</p>
                        <p>4. Listing Products: Sellers must ensure that the products listed are accurately described. Detritus reserves the right to remove any listings that violate our policies.</p>
                        <p>5. Buying Products: Buyers are responsible for reading the full item listing before making a purchase. All sales are final unless otherwise stated by the seller.</p>
                        <p>6. Payments: Payments are processed through secure third-party payment gateways. Detritus is not responsible for any payment issues.</p>
                        <p>7. User Conduct: Users must not engage in harmful, fraudulent, or illegal activities. Misuse may result in account suspension or termination.</p>
                        <p>8. Intellectual Property: All content on Detritus is the property of Detritus or its content suppliers. Users may not use any content without written permission.</p>
                        <p>9. Limitation of Liability: Detritus is not liable for any damages arising from the use of the website.</p>
                        <p>10. Changes to Terms: Detritus reserves the right to modify these terms at any time. Users will be notified, and continued use of the site constitutes acceptance.</p>
                        <p>11. Contact Us: If you have any questions, please contact us at debaritra45@gmail.com.</p>
                    </div>
                </div>
            )}
            <p>
                Already have an account? <Link to="/login">Login now</Link>
            </p>
        </div>
    );
};

export default Registration;

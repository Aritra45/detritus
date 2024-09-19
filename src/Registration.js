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
    const [isSendingOtp, setIsSendingOtp] = useState(false); // For handling OTP button state
    const [generatedOtp, setGeneratedOtp] = useState(''); // Store generated OTP
    const navigate = useNavigate();

    const auth = getAuth();

    // Function to generate OTP
    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
    };

    // Function to handle sending OTP to email
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsSendingOtp(true);  // Disable button during OTP send
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
            } finally {
                setIsSendingOtp(false);  // Re-enable button
            }
        } else {
            alert('Please enter a valid email.');
            setIsSendingOtp(false);  // Re-enable button if invalid email
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
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            className="otp-button"
                            disabled={isSendingOtp} // Disable button while sending OTP
                        >
                            {isSendingOtp ? "Sending..." : "Send OTP"}
                        </button>
                    </div>
                </div>

                {otpSent && (
                    <div className="form-group otp-verification">
                        <label htmlFor="otp">Enter OTP</label>
                        <input
                            id="otp"
                            type="text"
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            required
                            disabled={isVerified} // Disable input if verified
                        />
                        <button
                            type="button"
                            className="otp-button"
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
                            aria-label={showPassword ? "Hide password" : "Show password"}
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
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        required
                    >
                        {countryCodes.map((code) => (
                            <option key={code.value} value={code.value}>
                                {code.label} ({code.value})
                            </option>
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

                <div className="form-group terms-conditions">
                    <label>
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        I accept the <Link to="/terms">Terms and Conditions</Link>
                    </label>
                </div>

                <button type="submit" disabled={!isVerified}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default Registration;

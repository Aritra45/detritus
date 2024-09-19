import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig'; // Ensure this is correctly set up
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth to check authentication state
import './App.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(''); // State for error message
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Get the current user from the AuthContext

    // Redirect logged-in users away from the login page
    useEffect(() => {
        if (currentUser) {
            navigate('/home'); // Redirect to home if user is already logged in
        }
    }, [currentUser, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear any existing errors
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home');
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="registration-container">
            <h2>DETRITUS Login</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <div className="password-input" style={{ position: 'relative' }}>
                        <input
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
                {error && <p className="error-message">{error}</p>} {/* Display error message */}
                <button type="submit" id='but' className='register-but'>Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register now</Link>
            </p>
        </div>
    );
};

export default Login;

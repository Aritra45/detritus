import React, { useEffect, useState } from 'react';
import { getAuth, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import eye icons

const Profile = () => {
    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false); 
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // State to manage password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    } else {
                        setError('No such user!');
                    }
                } catch (err) {
                    setError('Failed to fetch user data. Please try again later.');
                    console.error(err);
                }
            } else {
                setError('No user is logged in.');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert('Logged out successfully!');
            navigate('/login');  // Redirect to login page after logout
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    

    const reauthenticateUser = async (currentPassword) => {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        try {
            await reauthenticateWithCredential(user, credential);
            console.log('Re-authentication successful');
        } catch (error) {
            console.error('Error re-authenticating user:', error);
            alert('Current password is incorrect.');
            throw new Error('Re-authentication failed');
        }
    };

    const handleChangePassword = async () => {
        const user = auth.currentUser;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        try {
            await reauthenticateUser(currentPassword); 
            await updatePassword(user, newPassword);
            alert('Password changed successfully!');
            setShowPopup(false);
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Error changing password. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="profile-container">
                {loading ? (
                    <p>Loading user data...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : userData ? (
                    <>
                        <h2>User Profile</h2>
                        <div className="profile-info">
                            <div className="profile-details">
                               <p><h3>{userData.name}</h3></p>
                                <p>Email: {userData.email}</p>
                                <p>Phone: {userData.phone}</p>
                            </div>
                        </div>

                        <div className="change-password">
                            <button onClick={() => setShowPopup(true)} id='b1'>Change Password</button>
                        </div>

                        <button onClick={handleLogout} id='b2'>Logout</button>
                    </>
                ) : (
                    <p>No user data available.</p>
                )}
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <b className="close-button" onClick={() => setShowPopup(false)}>&times;</b>
                        <h3>Change Password</h3>
                        <form>
                            <div className="password-input">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                                <a type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                    <FontAwesomeIcon icon={showCurrentPassword ? faEye : faEyeSlash} />
                                </a>
                            </div>
                            <div className="password-input">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <a type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                                    <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
                                </a>
                            </div>
                            <div className="password-input">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Retype New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <a type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                                </a>
                            </div>

                            <div className="form-buttons">
                                <button type="button" id="change-password" onClick={handleChangePassword}>Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};

export default Profile;

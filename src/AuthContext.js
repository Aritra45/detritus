import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);

            if (user) {
                // Example API call to fetch user profile data
                axios.get(`${process.env.REACT_APP_API_URL}/user-profile`, {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}` // or whatever token method you're using
                    }
                })
                .then(response => {
                    console.log('User profile data:', response.data);
                })
                .catch(error => {
                    console.error('Error fetching user profile data:', error);
                });
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

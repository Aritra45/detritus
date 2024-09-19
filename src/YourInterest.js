import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; // Import Firebase Firestore instance
import { getAuth } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import ProductDetailsModal from './ProductDetailsModal'; // Import the ProductDetailsModal component
import './YourInterest.css'; // Add CSS for styling
import Footer from './Footer';
import Navbar from './Navbar';

const YourInterest = () => {
    const [interestedProducts, setInterestedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null); // For displaying the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const auth = getAuth(); // Initialize Firebase Authentication

    // Function to fetch the interested products
    const fetchInterestedProducts = async (email) => {
        try {
            const interestsQuery = query(
                collection(db, 'interests'),
                where('email', '==', email)
            );
            const querySnapshot = await getDocs(interestsQuery);

            if (querySnapshot.empty) {
                console.log('No interested products found.');
            } else {
                console.log('Fetched interested products:', querySnapshot.docs);
            }

            const products = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setInterestedProducts(products);
        } catch (error) {
            console.error('Error fetching interested products:', error);
        }
    };

    // Listen to the Firebase Auth state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('User is logged in:', user.email);
                fetchInterestedProducts(user.email);
            } else {
                console.log('No user logged in');
                setInterestedProducts([]);
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    // Function to handle opening product details modal
    const handleDetailsClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Function to handle interest toggle
    const handleInterestClick = async (product) => {
        const user = auth.currentUser;

        if (user) {
            try {
                // Remove product from interest list
                await deleteDoc(doc(db, 'interests', product.id));
                setInterestedProducts((prev) =>
                    prev.filter((p) => p.id !== product.id)
                );
                alert('Product interest removed.');
            } catch (error) {
                console.error('Error removing interest from Firestore:', error);
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="interest-page">
                <h2>Your Interested Products</h2>

                {interestedProducts.length === 0 ? (
                    <p>You have no interested products.</p>
                ) : (
                    <div className="product-grid">
                        {interestedProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                <img
                                    src={product.imageUrls[0]} // Display the first image of the product
                                    alt={product.productName}
                                    className="product-image"
                                />
                                <h3>{product.productName}</h3>
                                <p>Price: ₹{product.price}</p>

                                <div className="product-actions">
                                    <button
                                        className="details-button"
                                        onClick={() => handleDetailsClick(product)}
                                    >
                                        Details
                                    </button>
                                    <button
                                        className="interested-button"
                                        onClick={() => handleInterestClick(product)}
                                    >
                                        Remove Interest
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isModalOpen && selectedProduct && (
                    <ProductDetailsModal
                        product={selectedProduct}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default YourInterest;

import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; // Import your Firebase Firestore instance
import { getAuth } from 'firebase/auth';
import { collection, addDoc, deleteDoc, query, where, getDocs, doc } from 'firebase/firestore';
import './ProductDetailsModal.css';

const ProductDetailsModal = ({ product, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isInterested, setIsInterested] = useState(false); // Track interest status
    const [interestDocId, setInterestDocId] = useState(null); // Store Firestore document ID for deletion
    const auth = getAuth(); // Initialize Firebase Authentication

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % product.imageUrls.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
    };

    // Check if the user has already marked this product as interested
    useEffect(() => {
        const checkInterestStatus = async () => {
            const user = auth.currentUser;

            if (user) {
                try {
                    const interestsQuery = query(
                        collection(db, 'interests'),
                        where('email', '==', user.email),
                        where('productName', '==', product.productName)
                    );

                    const querySnapshot = await getDocs(interestsQuery);

                    if (!querySnapshot.empty) {
                        setIsInterested(true); // User has already shown interest
                        setInterestDocId(querySnapshot.docs[0].id); // Store document ID for removal
                    } else {
                        setIsInterested(false);
                    }
                } catch (error) {
                    console.error('Error checking interest status:', error);
                }
            }
        };

        checkInterestStatus();
    }, [auth.currentUser, product.productName]);

    // Function to handle interest button click
    const handleInterestClick = async () => {
        const user = auth.currentUser;

        if (user) {
            if (isInterested) {
                // If already interested, remove from Firestore
                try {
                    await deleteDoc(doc(db, 'interests', interestDocId));
                    setIsInterested(false);
                    setInterestDocId(null);
                    alert('Product interest removed.');
                } catch (error) {
                    console.error('Error removing interest from Firestore:', error);
                }
            } else {
                // Add product to Firestore, including images
                try {
                    const docRef = await addDoc(collection(db, 'interests'), {
                        email: user.email,  // Store email
                        productName: product.productName,
                        price: product.price,
                        usage: product.usage,
                        details: product.details,
                        address: product.address,
                        pincode: product.pincode,
                        phoneNumber: product.phoneNumber,
                        imageUrls: product.imageUrls,  // Store product images
                        timestamp: new Date(), // Optional: Add a timestamp
                    });
                    setIsInterested(true);
                    setInterestDocId(docRef.id); // Store document ID for removal
                    alert('Product marked as interested!');
                } catch (error) {
                    console.error('Error storing interest in Firestore:', error);
                }
            }
        } else {
            alert('You need to be logged in to show interest in a product.');
        }
    };

    return (
        <div className="modal-overlaydetail">
            <div className="modal-contentdetail">
                <b className="close-buttondetail" onClick={onClose}>×</b>
                <h2>{product.productName}</h2>
                <div className="slideshow-containerdetail">
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                        <>
                            <div className="slidedetail" style={{ display: 'block' }}>
                                <img
                                    src={product.imageUrls[currentSlide]}
                                    alt={`Product ${currentSlide + 1}`}
                                    className="product-image"
                                />
                            </div>
                            <b className="prevdetail" onClick={prevSlide}>❮</b>
                            <b className="nextdetail" onClick={nextSlide}>❯</b>
                        </>
                    ) : (
                        <p>No images available for this product.</p>
                    )}
                </div>

                <p>Price: ₹{product.price}</p>
                <p>Usage: {product.YMD} {product.usage}</p>
                <p>Product Details: {product.details}</p>
                <p>Pickup Address: {product.address}</p>
                <p>Pincode: {product.pincode}</p>
                <p>Phone Number: {product.phoneNumber}</p>

                <button 
                    className={`interest-buttondetail ${isInterested ? 'interested' : ''}`} 
                    onClick={handleInterestClick}
                >
                    {isInterested ? 'Interested' : 'Interest'}
                </button>
            </div>
        </div>
    );
};

export default ProductDetailsModal;

import React, { useState, useEffect } from 'react';
import './YourProducts.css';
import Navbar from './Navbar';
import ProductModal from './ProductModal';
import ProductCard from './ProductCard';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Footer from './Footer';

const YourProducts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // Function to fetch products for the logged-in user
    const fetchProducts = async (userEmail) => {
        const db = getFirestore();
        const productsRef = collection(db, 'products');

        try {
            const querySnapshot = await getDocs(productsRef);
            const productList = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(product => product.id.startsWith(userEmail)); // Filter products based on user email

            console.log('Fetched products:', productList);
            setProducts(productList);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchProducts(user.email); // Fetch products on user login
            } else {
                console.error('No user logged in');
                setUser(null);
                setProducts([]); // Clear products if no user
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
        <Navbar />
        <div className="your-products-container">
            <div className="create-product-button">
                <button onClick={() => setIsModalOpen(true)}>+ Create New Selling Product</button>
            </div>
            <h2>Your Products</h2>
            {isModalOpen && <ProductModal onClose={handleModalClose} fetchProducts={() => fetchProducts(user.email)} />} {/* Pass fetchProducts */}
            <div className="products-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
        <p></p><p></p><p></p>
        <Footer/>
        </>
    );
};

export default YourProducts;

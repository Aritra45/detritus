import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import ProductDetailsModal from './ProductDetailsModal'; // Import the modal
import Navbar from './Navbar';
import Footer from './Footer';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
    const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility

    const fetchProducts = async () => {
        setLoading(true);
        const db = getFirestore();

        try {
            // Query to get products ordered by updatedAt in descending order
            const productsCollection = collection(db, 'products');
            const q = query(productsCollection, orderBy('updatedAt', 'desc'));
            const productSnapshot = await getDocs(q);

            const productList = productSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setProducts(productList);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []); // Empty dependency array ensures this runs only on mount

    const handleDetailsClick = (product) => {
        setSelectedProduct(product); // Set the selected product
        setIsModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <>
            <Navbar />
            <div className="home-container">
                <h2>Available Products</h2>
                <div className="product-list">
                    {loading ? (
                        // Display a skeleton loader or placeholders while products are loading
                        Array.from({ length: 4 }).map((_, index) => (
                            <div className="product-card placeholder" key={index}>
                                <div className="placeholder-image"></div>
                                <div className="placeholder-title"></div>
                                <div className="placeholder-price"></div>
                            </div>
                        ))
                    ) : (
                        products.length === 0 ? (
                            <p>No products available</p>
                        ) : (
                            products.map((product) => (
                                <div className="product-card" key={product.id}>
                                    {product.imageUrls?.[0] && (
                                        <img
                                            className="product-image"
                                            src={product.imageUrls[0]}
                                            alt={product.productName}
                                        />
                                    )}
                                    <h3>{product.productName}</h3>
                                    <p>Price: ₹{product.price}</p>
                                    <button
                                        className="details-button"
                                        onClick={() => handleDetailsClick(product)}
                                    >
                                        Details
                                    </button>
                                </div>
                            ))
                        )
                    )}
                </div>

                {isModalOpen && (
                    <ProductDetailsModal
                        product={selectedProduct}
                        onClose={closeModal}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default Home;

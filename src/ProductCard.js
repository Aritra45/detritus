import React, { useState } from 'react';
import EditProductModal from './EditProductModal';
import { getFirestore, doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import './ProductCard.css';

const ProductCard = ({ product, fetchProducts }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isResponsesModalOpen, setIsResponsesModalOpen] = useState(false);
    const [interestedUsers, setInterestedUsers] = useState([]);

    const handleDelete = async () => {
        const db = getFirestore();
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteDoc(doc(db, 'products', product.id));
                alert('Product deleted successfully!');
                fetchProducts(); // Fetch updated products list after deletion
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleResponsesClick = async () => {
        const db = getFirestore();
        try {
            const interestsQuery = query(
                collection(db, 'interests'),
                where('productName', '==', product.productName)
            );
            const querySnapshot = await getDocs(interestsQuery);
            const users = querySnapshot.docs.map(doc => doc.data());
            setInterestedUsers(users);
            setIsResponsesModalOpen(true);
        } catch (error) {
            console.error('Error fetching interested users:', error);
        }
    };

    return (
        <div className="product-card">
            <img src={product.imageUrls[0]} alt={product.productName} className="product-image" />
            <div className="product-info">
                <h3>{product.productName}</h3>
                <p>Price: ₹{product.price}</p>
            </div>
            <div className="product-actions">
                <button 
                    className="edit-button" 
                    style={{ background: 'green' }} 
                    onClick={() => setIsModalOpen(true)} 
                >
                    Edit
                </button>
                <button 
                    className="delete-button" 
                    style={{ background: 'red' }} 
                    onClick={handleDelete}
                >
                    Delete
                </button>
                <button 
                    className="responses-button" 
                    onClick={handleResponsesClick}
                >
                    Responses
                </button>
            </div>

            {isModalOpen && (
                <EditProductModal
                    onClose={() => setIsModalOpen(false)}
                    fetchProducts={fetchProducts}
                    productId={product.id} 
                    existingProduct={product}
                />
            )}

            {isResponsesModalOpen && (
                <ResponsesModal 
                    onClose={() => setIsResponsesModalOpen(false)} 
                    interestedUsers={interestedUsers}
                />
            )}
        </div>
    );
};

// Modal Component to Display Interested Users
const ResponsesModal = ({ onClose, interestedUsers }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <b className="close-button2" onClick={onClose}>×</b>
                <h2>Interested Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interestedUsers.length > 0 ? (
                            interestedUsers.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber || 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No users have shown interest yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductCard;

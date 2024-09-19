import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import './EditProductModal.css'; // Add your custom CSS for styling the modal

const EditProductModal = ({ onClose, fetchProducts, productId, existingProduct }) => {
    const [productName, setProductName] = useState(existingProduct.productName);
    const [price, setPrice] = useState(existingProduct.price);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [usage, setUsage] = useState(existingProduct.usage);
    const [YMD, setYMD] = useState(existingProduct.YMD);
    const [details, setDetails] = useState(existingProduct.details);
    const [address, setAddress] = useState(existingProduct.address);
    const [pincode, setPincode] = useState(existingProduct.pincode);
    const db = getFirestore();

    useEffect(() => {
        const fetchUserPhoneNumber = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                console.error('No user is logged in!');
                setLoading(false);
                return;
            }

            const userEmail = user.email;

            try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('email', '==', userEmail));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(doc => {
                        setPhoneNumber(doc.data().phone);
                    });
                } else {
                    console.error('No user found with this email!');
                }
            } catch (error) {
                console.error('Error fetching user phone number:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserPhoneNumber();
    }, [db]); // Add db to the dependency array to avoid missing dependencies warning

    const handleUpdate = async () => {
        const productRef = doc(db, 'products', productId);
        try {
            await updateDoc(productRef, {
                productName,
                price,
                YMD,
                usage,
                phoneNumber,
                details,
                address,
                pincode,
                updatedAt: new Date(),  // Update timestamp
            });
            alert('Product updated successfully!');
            window.location.reload();

            fetchProducts(); // Refresh product list after update
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };
    
    return (
        <div className="modal-overlayedit">
            <div className="modal-contentedit">
                <h2>Edit Product</h2>
                <label>Product Name:</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
                <div className="form-group">
                    <label>Price (₹):</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phone:</label>
                    <span>{loading ? 'Loading...' : phoneNumber}</span>
                </div>
                <div className="form-group">
                    <label>Usage:</label>
                    <select
                        value={usage}
                        onChange={(e) => setUsage(e.target.value)}
                        required
                    >
                        <option value="Year">Year</option>
                        <option value="Month">Month</option>
                        <option value="Day">Day</option>
                    </select>
                    <input
                        type="number"
                        value={YMD}
                        onChange={(e) => setYMD(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Product Details:</label>
                    <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Pickup Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Pincode:</label>
                    <input
                        type="number"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        required
                    />
                </div>

                <button onClick={handleUpdate}>Update</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default EditProductModal;

import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './ProductModal.css';

const ProductModal = ({ onClose, fetchProducts, productId = null, existingProduct = null }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([null, null, null, null]);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [usage, setUsage] = useState('Year');
    const [YMD, setYMD] = useState('');
    const [details, setDetails] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [imageFiles, setImageFiles] = useState([null, null, null, null]);

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
            const db = getFirestore();

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

        // Pre-fill form if editing an existing product
        if (existingProduct) {
            setProductName(existingProduct.productName);
            setPrice(existingProduct.price);
            setUsage(existingProduct.usage);
            setYMD(existingProduct.YMD);
            setDetails(existingProduct.details);
            setAddress(existingProduct.address);
            setPincode(existingProduct.pincode);
            setImages(existingProduct.imageUrls || [null, null, null, null]);
        }

        fetchUserPhoneNumber();
    }, [existingProduct]);

    const handleImageUpload = (index, event) => {
        const newImages = [...images];
        const newImageFiles = [...imageFiles];
        const file = event.target.files[0];

        if (file) {
            newImages[index] = URL.createObjectURL(file);
            newImageFiles[index] = file;
        }

        setImages(newImages);
        setImageFiles(newImageFiles);
    };

    const handlePublish = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const auth = getAuth();
        const user = auth.currentUser;
        const db = getFirestore();
        const storage = getStorage();
        const userEmail = user.email;
    
        if (!productName || !price || !address || !pincode || !details) {
            alert('Please fill in all required fields.');
            return;
        }
    
        try {
            const imageUrls = await Promise.all(imageFiles.map(async (file, index) => {
                if (file) {
                    const uniquePath = `products/${userEmail}/${productName}_${Date.now()}_image${index + 1}`;
                    const storageRef = ref(storage, uniquePath);
                    await uploadBytes(storageRef, file);
                    return await getDownloadURL(storageRef);
                }
                return images[index];  // Use existing image if no new file is uploaded
            }));
    
            // Construct productData with only defined fields
            const productData = {
                productName: productName || null,
                price: price || null,
                phoneNumber: phoneNumber || null,
                usage: usage || null,
                YMD: YMD || null,
                details: details || null,
                address: address || null,
                pincode: pincode || null,
                imageUrls: imageUrls.filter(url => url !== null), // Store only non-null image URLs
                updatedAt: new Date(),  // Update timestamp
            };
    
            // Remove any undefined or null fields from productData
            Object.keys(productData).forEach(key => {
                if (productData[key] === null || productData[key] === undefined) {
                    delete productData[key];
                }
            });
    
            if (productId) {
                // If editing, update the existing product
                const productDocRef = doc(db, 'products', productId);
                await updateDoc(productDocRef, productData);
                alert('Product updated successfully!');
            } else {
                // If creating a new product
                const newProductDocRef = doc(db, 'products', `${userEmail}_${new Date().getTime()}`);
                await setDoc(newProductDocRef, productData);
                alert('Product created successfully!');
            }
    
            onClose();
    
            // Refetch products without full page reload
            if (fetchProducts) {
                fetchProducts();
            }
    
        } catch (error) {
            console.error('Error publishing product:', error);
            alert('Failed to publish product. Please try again.');
        }
    };
    
    

    return (
        <div className="modal-overlaymodal">
            <div className="modal-contentmodal">
                <h2>{productId ? 'Edit Product' : 'Create New Selling Product'}</h2>

                <form onSubmit={handlePublish}> {/* Wrap in form to handle submission */}
                    <div className="form-group">
                        <label>Product Name:</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                        />
                    </div>
                    
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

                    <div className="form-group">
                        <label>Upload Product Images:</label>
                        <div className="image-grid">
                            {images.map((image, index) => (
                                <div className="image-box" key={index}>
                                    {image ? (
                                        <img src={image} alt={`Upload ${index}`} />
                                    ) : (
                                        <label className="image-upload-label" htmlFor={`imageUpload${index}`}>
                                            <span>+</span>
                                        </label>
                                    )}
                                    <input
                                        type="file"
                                        id={`imageUpload${index}`}
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleImageUpload(index, e)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="button-container">
                        <button type="submit" id='pub'>Publish</button>
                        <button type='button' onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;

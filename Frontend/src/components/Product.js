import React, { useState, useEffect } from 'react';
import '../styles/Product.css'; 
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Product = ({ onShowPopup }) => {
  const [products, setProducts] = useState([
    { id: 1, name: '', code: '', price: 0, quantity: 0 },
  ]);
  const location = useLocation();
  const email = location.state?.email; // Retrieve the email from the location state

  console.log(email)

  // Log products and email whenever they change
  useEffect(() => {
    console.log('Products state changed:', products);
    console.log('Email state:', email);  // Log the email state
  }, [products, email]);

  // Add product
  const handleAdd = () => {
    const allFieldsFilled = products.every(product =>
      product.name && product.code && product.price > 0 && product.quantity > 0
    );

    if (allFieldsFilled) {
      const newProduct = {
        id: products.length + 1,
        name: '',
        code: '',
        price: 0,
        quantity: 0,
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      console.log('Added new product:', newProduct);  // Log the newly added product
    } else {
      onShowPopup(); // Show popup if fields are incomplete
    }
  };

  // Update product fields dynamically
  const handleUpdate = (id, field, value) => {
    setProducts(products.map(product =>
      product.id === id ? { 
        ...product, 
        [field]: field === 'price' || field === 'quantity' ? parseFloat(value) || 0 : value 
      } : product
    ));
    console.log(`Updated product ${id}:`, products.find(product => product.id === id)); // Log updated product
  };

  // Delete product
  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id));
    console.log('Deleted product with id:', id); // Log deleted product ID
  };

  // Save products to the backend
  // Save products to the backend
  const handleSave = async () => {
    if (!email) {
      console.error('Email is not defined or invalid');
      alert('User email is missing. Cannot save products.');
      return;
    }

    try {
      console.log('Sending request to update or add products...');
      const payload = {
        email,  // Ensure email is sent
        products,
      };
      console.log('Payload:', payload);  // Log the request payload

      const response = await axios.post('http://localhost:5000/update-product', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // If your backend requires session cookies/auth
      });

      console.log('Server response:', response.data);
      alert('Products updated successfully');
    } catch (error) {
      console.error('Error updating products:', error.response?.data || error.message);
      alert(`Error updating products: ${error.response?.data?.message || error.message}`);
    }
  };


  return (
    <div className="product-table">
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Product Name</th>
            <th>Product Code</th>
            <th>Price</th>
            <th>No. of Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleUpdate(product.id, 'name', e.target.value)}
                  required
                />
              </td>
              <td>
                <input
                  type="text"
                  value={product.code}
                  onChange={(e) => handleUpdate(product.id, 'code', e.target.value)}
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => handleUpdate(product.id, 'price', e.target.value)}
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleUpdate(product.id, 'quantity', e.target.value)}
                  required
                />
              </td>
              <td>
                <button className="Add" onClick={() => handleUpdate(product.id, 'quantity', product.quantity + 1)}>+</button>
                <button className="Subtract" onClick={() => handleUpdate(product.id, 'quantity', product.quantity - 1)}>-</button>
                <button className="Delete" onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttons">
        <button className="AddProductButton" onClick={handleAdd}>Add Product</button>
        <button className="SaveButton" onClick={handleSave}>Save Products</button>
      </div>
    </div>
  );
};

export default Product;

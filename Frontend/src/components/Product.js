import React, { useState, useEffect } from 'react';
import '../styles/Product.css'; 
import axios from 'axios';

const Product = ({ onShowPopup, email }) => {
  const [products, setProducts] = useState([
    { id: 1, name: '', code: '', price: 0, quantity: 0 },
  ]);

  useEffect(() => {
    console.log('Products state changed:', products);
  }, [products]);

  const handleAdd = () => {
    const allFieldsFilled = products.every(product =>
      product.name && product.code && product.price && product.quantity
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
    } else {
      onShowPopup();
    }
  };

  const handleUpdate = (id, field, value) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handleSave = async () => {
    try {
      console.log('Sending request to update products...');
      const payload = {
        email,
        products
      };
      console.log('Payload:', payload);
  
      const response = await axios.post('http://localhost:5000/update-product', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
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

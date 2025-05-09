import React, { useState, useEffect } from 'react';
import '../styles/ProductList.css'
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ProductList = ({ onShowPopup }) => {
  const [productlist, setProductList] = useState([
    { name: '', code: ''},
  ]);
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const email = location.state?.email || localStorage.getItem('userEmail');
 
  console.log(email);

useEffect(() => {
  const fetchProductList = async () => { //fetchProducts
    if (!email) return;

    try {
      const response = await axios.get(`http://localhost:5000/product-list?email=${email}`, { //user-products
        withCredentials: true,
      });
      setProductList(response.data.productlist|| []); 
      setIsLoaded(true);
      console.log('Fetched products:', response.data.productlist); 
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
    }
  };

  fetchProductList();
}, [email]); 

  const handleAdd = () => {
    const allFieldsFilled = productlist.every(product =>
      product.name && product.code && product.code.length > 0
    );

    if (allFieldsFilled) {
      const newProduct = {
        id: productlist.length + 1,
        name: '',
        code: ''
      };
      const updatedProducts = [...productlist, newProduct];
      setProductList(updatedProducts);
      console.log('Added new product:', newProduct);  // Log the newly added product
    } else {
      onShowPopup(); // Show popup if fields are incomplete
    }
  };

  // Update product fields dynamically
  const handleUpdate = (id, field, value) => {
    setProductList(productlist.map(product =>
      product.id === id ? { 
        ...product, 
        [field]: field === 'price' || field === 'quantity' ? parseFloat(value) || 0 : value 
      } : product
    ));

    console.log(`Updated product ${id}:`, productlist.find(product => product.id === id)); 
  };

  const handleDelete = async (productCode) => {
    if (!email) {
      console.error('Email is not defined or invalid');
      alert('User email is missing. Cannot delete product.');
      return;
    }
  
    try {
      console.log(`Sending request to delete product with code: ${productCode}`);
  
      const response = await axios.delete('http://localhost:5000/delete-productname', { //delete-product
        data: { email, code: productCode },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
  
      console.log('Server response:', response.data);
      alert('Product deleted successfully');
      setProductList(productlist.filter(product => product.code !== productCode)); // Update state after deletion
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
      alert(`Error deleting product: ${error.response?.data?.message || error.message}`);
    }
  };
  
  // Save products to the backend
  const handleSave = async () => {
    if (!email) {
      console.error('Email is not defined or invalid');
      alert('User email is missing. Cannot save products.');
      return;
    }

    // Validate all products only when saving
    for (const product of productlist) {
      if (product.code.length !== 8) {
        alert(`Product code for ${product.name} must be exactly 8 characters long.`);
        return;
      }
      const isDuplicate = productlist.some(p => p.code === product.code && p.id !== product.id);
      if (isDuplicate) {
        alert(`Product code ${product.code} must be unique.`);
        return;
      }
    }

    try {
      console.log('Sending request to update or add products...');
      const payload = {
        email,  // Ensure email is sent
        productlist,
      };
      console.log('Payload:', payload);  // Log the request payload

      const response = await axios.post('http://localhost:5000/update-productname', payload, {
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
    <div className={`product-table ${isLoaded ? 'loaded' : ''}`}>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Product Name</th>
            <th>Product Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productlist.map((product, index) => (
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
                <button className="Delete" onClick={() => handleDelete(product.code)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-row-container"></div>
      <div className="buttons-productlist">
        <button className="AddProductButton" onClick={handleAdd}>Add Product</button>
        <button className="SaveButton" onClick={handleSave}>Save Products</button>
      </div>
      </div>
  );
};

export default ProductList;

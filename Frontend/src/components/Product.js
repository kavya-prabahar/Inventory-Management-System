import React, { useState, useEffect } from 'react';
import '../styles/Product.css'
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Product = ({ onShowPopup }) => {
  const [products, setProducts] = useState([
    { id: 1, name:'', code: '', price: 0, quantity: 0, nameUpdated: false },
  ]);
  const location = useLocation();
  const [productlist, setProductlist] = useState([]);
  const [minQuantity, setMinQuantity] = useState(10);
  const email = location.state?.email || localStorage.getItem('userEmail');
  const [isLoaded, setIsLoaded] = useState(false);
  // Retrieve the email from the location state

  console.log(email);

  // Fetch user products when the email changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!email) return;

      try {
        const response = await axios.get(`http://localhost:5000/user-products?email=${email}`, {
          withCredentials: true,
        });
        
        // Set productList with the fetched list
        setProductlist(response.data.productlist || []);
        
        // Update products with name from productList using the code
        const updatedProducts = response.data.products.map(product => ({
          ...product,
          name: response.data.productlist.find(p => p.code === product.code)?.name || '',
          nameUpdated: false,  // Initially not updated
        }));

        setProducts(updatedProducts);
        setIsLoaded(true);
        console.log("Updated products state:", updatedProducts);
        console.log("Fetched productlist:", response.data.productlist);

        
        console.log('Fetched products:', response.data.products); // Log fetched products
      } catch (error) {
        console.error('Error fetching products:', error.response?.data || error.message);
      }
    };

    fetchProducts();
  }, [email]); // Dependency array only includes email, avoiding infinite loop

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
        nameUpdated: false,
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

  const handleDelete = async (productCode) => {
    if (!email) {
      console.error('Email is not defined or invalid');
      alert('User email is missing. Cannot delete product.');
      return;
    }

    try {
      console.log(`Sending request to delete product with code: ${productCode}`);

      const response = await axios.delete('http://localhost:5000/delete-product', {
        data: { email, code: productCode },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log('Server response:', response.data);
      alert('Product deleted successfully');
      setProducts(products.filter(product => product.code !== productCode)); // Update state after deletion
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
  
    // Validate essential fields
    for (const product of products) {
      if (!product.code || product.code.length !== 8) {
        alert(`Product code must be exactly 8 characters long.`);
        return;
      }
      if (product.price <= 0 || product.quantity <= 0) {
        alert(`Price and quantity must be greater than 0.`);
        return;
      }
      const isDuplicate = products.some(p => p.code === product.code && p.id !== product.id);
      if (isDuplicate) {
        alert(`Product code ${product.code} must be unique.`);
        return;
      }
    }
  
    // Update names using productList (only if name is missing or placeholder)
    const updatedProducts = products.map(product => {
      const isNameMissing = !product.name || product.name === 'whatever';
      if (isNameMissing) {
        const matchedProduct = productlist.find(p => p.code === product.code);
        return {
          ...product,
          name: matchedProduct ? matchedProduct.name : '', // leave blank if not found
          nameUpdated: true,
        };
      }
      return product;
    });
  
    // Final check after name assignment
    for (const product of updatedProducts) {
      if (!product.name) {
        const availableCodes = productlist.map(p => p.code).join(', ');
        alert(`Product name for code ${product.code} not found in the database.\nAvailable codes: ${availableCodes}`);
        return;
      }
    }
    
  
    try {
      console.log('Sending request to update or add products...');
      const payload = {
        email,
        products: updatedProducts,
      };
      console.log('Payload:', payload);
  
      const response = await axios.post('http://localhost:5000/update-product', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
  
      setProducts(updatedProducts); // Keep updated names in the UI
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
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id} className={product.quantity < minQuantity ? 'low-stock' : ''}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleUpdate(product.id, 'name', e.target.value)}
                  disabled={!product.nameUpdated} // Initially disabled, then can be edited after saving
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
                <button className="Subtract" onClick={() => handleUpdate(product.id, 'quantity', Math.max(product.quantity - 1, 0))}>-</button>
                <button className="Delete" onClick={() => handleDelete(product.code)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-row-container">
        <div className="buttons-product">
          <button className="AddProductButton" onClick={handleAdd}>Add Product</button>
          <button className="SaveButton" onClick={handleSave}>Save Products</button>
        </div>

        <div className="min-quantity">
          <label htmlFor="minQuantity">Low Stock Threshold </label>
          <input
            id="minQuantity"
            className="min-value"
            type="number"
            min="1"
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setMinQuantity(isNaN(val) ? 10 : val);
            }}
            value={minQuantity}
            onBlur={() => {
              if (minQuantity === '' || minQuantity === 0) setMinQuantity(10);
            }}
          />
        </div>
      </div>
    </div>

  );
};

export default Product;

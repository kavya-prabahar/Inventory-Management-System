import React, { useState } from 'react';
import '../styles/Product.css'; 

const Product = ({ onShowPopup }) => {
  const [products, setProducts] = useState([
    { id: 1, name: '', code: '', price: 0, quantity: 0 },
  ]);

  const handleAdd = () => {
    // Check if all fields are filled
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
      setProducts([...products, newProduct]);
    } else {
      onShowPopup(); // Show the popup if fields are not filled
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
                <button className="Minus" onClick={() => handleUpdate(product.id, 'quantity', product.quantity - 1)}>-</button>
                <button className="Delete" onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-div">
        <button type="button" className="AddProduct" onClick={handleAdd}>Add Product</button>
      </div>
    </div>
  );
};

export default Product;

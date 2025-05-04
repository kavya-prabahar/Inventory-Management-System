import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Product.css'
import '../styles/sales.css'

function Sales({ userEmail }) {
  const [productList, setProductList] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([
    { id: 1, name: '', code: '', price: 0, quantity: 0, total: 0 }
  ]);
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const fetchData = async () => {
      try {
        const res = await axios.post('http://localhost:5000/get-user-data', {email},{
            withCredentials: true,
          });
        setProductList(res.data.productlist);
        setProducts(res.data.products);
        setIsLoaded(true);
      } catch (err) {
        console.error('Error fetching product data:', err);
      }
    };
    if (email) {
        fetchData(); // Only fetch data if the email exists
      }
    }, []);

  const handleChange = (index, field, value) => {
    const updatedSales = [...sales];
    updatedSales[index][field] = value;

    // Auto-fill name and price from productList/products
    if (field === 'code') {
      const match = productList.find(p => p.code === value);
      const productDetails = products.find(p => p.code === value);
      if (match && productDetails) {
        updatedSales[index].name = match.name;
        updatedSales[index].price = productDetails.price;
        updatedSales[index].total = productDetails.price * updatedSales[index].quantity;
      }
    }

    if (field === 'quantity') {
      const price = updatedSales[index].price || 0;
      updatedSales[index].total = price * value;
    }

    setSales(updatedSales);
  };

  const handleAddRow = () => {
    setSales(prev => [
      ...prev,
      { id: prev.length + 1, name: '', code: '', price: 0, quantity: 0, total: 0 }
    ]);
  };

  const handleSaveSales = async () => {
    const salesList = sales.map(sale => ({
      ...sale,
      id: sale.id,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    }));

    try {
      const email = localStorage.getItem('userEmail');
      const res = await axios.post('http://localhost:5000/add-sales', {
        email: email,
        salesList
      });

      alert(res.data.message);

      // Reset with last 5 entries shown
      setSales([salesList[salesList.length - 1]]);
    } catch (err) {
      console.error('Error saving sales:', err);
      alert('Failed to save sales');
    }
  };

  return (
    <div className={`product-table ${isLoaded ? 'loaded' : ''}`}>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Product Name</th>
            <th>Code</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td><input type="text" value={sale.name} disabled /></td>
              <td>
                <input
                  type="text"
                  value={sale.code}
                  onChange={(e) => handleChange(index, 'code', e.target.value)}
                />
              </td>
              <td><input type="number" value={sale.price} disabled /></td>
              <td>
                <input
                  type="number"
                  value={sale.quantity}
                  onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value))}
                />
              </td>
              <td><input type="number" value={sale.total} disabled /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="buttons">
        <button className = "AddSalesButton" onClick={handleAddRow}>Add Sales</button>
        <button className = "SaveSalesButton" onClick={handleSaveSales}>Save Sales</button>
      </div>
    </div>
  );
}

export default Sales;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/sales.css';

function Sales({ userEmail }) {
  const [productList, setProductList] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('add');
  const [salesData, setSalesData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  const [sales, setSales] = useState([
    { id: 1, name: '', code: '', price: 0, quantity: 0, total: 0 }
  ]);
  const [isLoaded, setIsLoaded] = useState(false);

  const email = localStorage.getItem('userEmail');
    const fetchData = async () => {
      try {
        const res = await axios.post('http://localhost:5000/get-user-data', { email }, {
          withCredentials: true,
        });
        setProductList(res.data.productlist);
        setProducts(res.data.products);
        setIsLoaded(true);
      } catch (err) {
        console.error('Error fetching product data:', err);
      }
    };

  useEffect(() => {
  const handleFetch = () => {
    fetchData();
  };
  window.addEventListener('triggerFetchProducts', handleFetch);

  return () => {
    window.removeEventListener('triggerFetchProducts', handleFetch);
  };
}, []);


  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (activeTab === 'view') {
      fetchSales();
    }
  }, [activeTab]);

  const fetchSales = async () => {
    const email = localStorage.getItem('userEmail');
    try {
      const res = await axios.post('http://localhost:5000/get-sales-by-date', { email });
      setSalesData(res.data);
    } catch (err) {
      console.error('Error fetching sales data:', err);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedSales = [...sales];
    updatedSales[index][field] = value;

    if (field === 'quantity' && value < 0) {
      updatedSales[index].quantity = 0;  // Set to 0 if negative value is entered
    }

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
      updatedSales[index].total = price * (parseInt(value) || 0);
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
      setSales([{ id: 1, name: '', code: '', price: 0, quantity: 0, total: 0 }]);
    } catch (err) {
      console.error('Error saving sales:', err);
      alert('Failed to save sales');
    }
  };

  const renderAddSales = () => (
    <div className="product-table">
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
              <td><input type="text" value={sale.code} onChange={(e) => handleChange(index, 'code', e.target.value)} /></td>
              <td><input type="number" value={sale.price} disabled /></td>
              <td><input type="number" value={sale.quantity} onChange={(e) => handleChange(index, 'quantity', e.target.value)} /></td>
              <td><input type="number" value={sale.total} disabled /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-row-container">
      <div className="buttons">
        <button className="AddSalesButton" onClick={handleAddRow}>Add Sales</button>
        <button className="SaveSalesButton" onClick={handleSaveSales}>Save Sales</button>
      </div>
      </div>
    </div>
  );

  const renderSalesTable = () => {
    const salesForDate = salesData[selectedDate] || [];
    const totalForDate = salesForDate.reduce((sum, s) => sum + s.total, 0);

    return (
      <div className="product-table">
        <h3 className="sales-date-heading">Sales on {selectedDate}</h3>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Code</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {salesForDate.map((sale, idx) => (
              <tr key={idx}>
                <td>{sale.name}</td>
                <td>{sale.code}</td>
                <td>{sale.price}</td>
                <td>{sale.quantity}</td>
                <td>{sale.total}</td>
                <td>{sale.time}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: 'bold' }}>
              <td colSpan="4">Total</td>
              <td>{totalForDate}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderViewSales = () => (
    <div className="view-sales-container">
      <h4 className="date-selection">Choose the date for which sales have to be viewed</h4>
      <div className="date-buttons">
        {Object.keys(salesData).map(date => (
          <button key={date} onClick={() => setSelectedDate(date)} className="date-btn">
            {date}
          </button>
        ))}
      </div>
      {selectedDate && renderSalesTable()}
    </div>
  );

  return (
    <div className="sales-wrapper">
      <div className="tab-buttons">
        <button 
          onClick={() => setActiveTab('add')} 
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
        >
          Add Sales
        </button>
        <button 
          onClick={() => setActiveTab('view')} 
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
        >
          View Sales
        </button>
      </div>
      {activeTab === 'add' ? renderAddSales() : renderViewSales()}
    </div>
  );
}

export default Sales;

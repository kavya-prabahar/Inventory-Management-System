# InvenTrack – Inventory Management System (IMS)

A full-stack web application to manage products, sales, and stock efficiently, built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).

## 🔍 Features

- **Authentication** using JWT (Login & Register)
- **Product Management**
  - Add new products with code, name, price, and initial stock
  - View inventory and stock levels
- **Sales Management**
  - Add and view sales by date
  - Auto-fill product details when code is entered
  - Updates stock in real time
- **Sales Reports**
  - View past sales by date
  - See total sales amount and individual transactions
- **Routing with Protection**
  - Protected routes for product, sales, and inventory pages
  - Token expiration handling with user redirection

## 🛠️ Tech Stack

**Frontend:**  
- React.js  
- React Router DOM 

**Backend:**  
- Node.js  
- Express.js  
- MongoDB with Mongoose  
- JSON Web Token (JWT) for authentication  

## 🚀 How to Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm start
```

## Environment Variables
Create a .env file in the backend folder:
JWT_SECRET=your_secret_key

##  Future Improvements

- Dashboard with charts for sales and inventory
- Role-based access (Admin vs Staff)
- Email alerts for low stock
- Export sales/inventory reports (PDF/Excel)


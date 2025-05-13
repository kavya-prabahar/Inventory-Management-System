# InvenTrack – Inventory Management System (IMS)

A full-stack web application to manage products, sales, and stock efficiently, built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).

## 🔍 Features

- Authentication using JWT (Login & Register)
- Manage product inventory by adding and viewing items.
- Record and review sales by date, with real-time stock updates.
- Auto-fetch product details (code, name, price) when adding sales or inventory.
- View daily sales summary including total value.

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


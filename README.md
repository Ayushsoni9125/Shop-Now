# ShopNow - Full-Stack MERN E-Commerce

Welcome to **ShopNow**, a modern, fully-functional e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). 

## 🌐 Live Demo
- **Frontend (Vercel):** [https://frontend-liart-phi-53.vercel.app](https://frontend-liart-phi-53.vercel.app)
- **Backend API (Render):** `https://shop-now-5has.onrender.com/api`

---

## ✨ Key Features

- **User Authentication:** Secure login and registration with JWT.
- **Product Management:** Browse categories, view detailed product pages, and search for items.
- **Shopping Cart & Checkout:** Seamless add-to-cart functionality and order placement.
- **Admin Dashboard:** Dedicated interface for admins to manage products and track user orders.
- **Dynamic Theme:** Built-in Light/Dark Mode toggle to suit user preferences.
- **Smart Recommendations:** "You Might Also Like" section suggesting related products based on category.
- **Fully Responsive:** Sleek and modern design built with Tailwind CSS that works beautifully on desktop and mobile.

---

## 🛠️ Technology Stack

**Frontend**
- React 19 (via Vite)
- Tailwind CSS (Styling & Dark Mode)
- React Router (Routing)
- React Context API (State Management for Cart, Auth & Theme)
- Axios (HTTP client)

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose (Database & ORM)
- JSON Web Tokens (JWT Authentication)
- bcryptjs (Password Hashing)

---

## 🚀 Running Locally

Follow these steps to set up the project on your local machine.

### 1. Clone the repository
```bash
git clone https://github.com/Ayushsoni9125/Shop-Now.git
cd Shop-Now
```

### 2. Setup the Backend
```bash
cd backened
npm install
```
Create a `.env` file in the `backened` directory with the following variables:
```env
PORT=3200
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../frontened/frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```
The application will be running at `http://localhost:5173`.

---

## 👨‍💻 Author
Built with ❤️ by [Ayush Soni](https://github.com/Ayushsoni9125).

# 🛍️ ShopNow — Full-Stack E-Commerce App

A production-ready, full-stack e-commerce application built with the **MERN** stack (MongoDB, Express, React, Node.js), deployed on **Render** (backend) and **Vercel** (frontend).

> **Live Demo:** [frontend-liart-phi-53.vercel.app](https://frontend-liart-phi-53.vercel.app) &nbsp;|&nbsp; **Backend API:** [shop-now-5has.onrender.com/api](https://shop-now-5has.onrender.com/api/products)

---

## 📸 Preview

| Home Page | Admin Dashboard | Product Management |
|---|---|---|
| Browse products, search & filter by category | Stats, quick actions, recent orders | Add, edit, delete with drag-and-drop image upload |

---

## ✨ Features

### 👤 User Features
- **Register / Login** — JWT-based authentication, choose account type (User or Admin) on sign-up
- **Browse Products** — search by keyword, filter by category, paginated product grid
- **Product Detail Page** — description, price, stock status, add to cart
- **Shopping Cart** — add/remove items, quantity controls, persistent across sessions
- **Checkout** — shipping address form, place order
- **Order History** — view all past orders with status tracking (Processing → Shipped → Delivered)
- **Profile Page** — view account info and order list
- **Dark / Light Mode** — system-aware theme toggle, saved to `localStorage`

### 🔐 Admin Features
- **Admin Panel** (only for admin accounts) — overview dashboard with stats
- **Product Management** — add, edit, delete products
- **Drag & Drop Image Upload** — drop or browse an image; auto-compressed to 800px / 80% JPEG via the Canvas API (no cloud storage needed)
- **Order Management** — view all orders, update payment and delivery status
- **Real-time Stats** — total revenue, total orders, total products, pending orders

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| **React 18** + Vite | UI framework and build tool |
| **React Router v6** | Client-side routing |
| **Tailwind CSS** | Utility-first styling |
| **Axios** | HTTP client |
| **Context API** | Auth, Cart, Theme global state |

### Backend
| Tech | Purpose |
|---|---|
| **Node.js** + **Express 5** | REST API server |
| **MongoDB** + **Mongoose** | Database and ODM |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT auth tokens |
| **dotenv** | Environment variable management |
| **nodemon** | Dev auto-restart |

### Deployment
| Service | What's hosted |
|---|---|
| **Vercel** | React frontend (SPA with rewrites) |
| **Render** | Node/Express backend |
| **MongoDB Atlas** | Cloud database |

---

## 📁 Project Structure

```
full-stack/
├── backened/                  # Express REST API
│   ├── config/                # Database connection
│   ├── controllers/           # Route handlers
│   │   ├── userController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect
│   │   └── adminMiddleware.js # Admin guard
│   ├── models/
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   └── orderModel.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── seedProducts.js        # Seed 34 demo products
│   ├── makeAdmin.js           # Utility: grant admin to all users
│   ├── index.js               # App entry point
│   └── .env                   # Environment variables (not committed)
│
├── frontened/frontend/        # React + Vite SPA
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProductCard.jsx
│       │   ├── SearchBar.jsx
│       │   ├── Pagination.jsx
│       │   ├── Loader.jsx
│       │   └── Toast.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── CartContext.jsx
│       │   └── ThemeContext.jsx
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── ProductPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── CheckoutPage.jsx
│       │   ├── OrderPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminProductList.jsx
│       │   └── AdminOrderList.jsx
│       └── App.jsx
│
├── vercel.json                # Vercel SPA rewrite config
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Ayushsoni9125/Shop-Now.git
cd Shop-Now/full-stack
```

### 2. Set up the Backend
```bash
cd backened
npm install
```

Create a `.env` file in `backened/`:
```env
PORT=3200
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:
```bash
npm start
```

The API runs at `http://localhost:3200`

### 3. Seed the Database (optional)
To populate 34 demo products:
```bash
node seedProducts.js
```

### 4. Set up the Frontend
```bash
cd ../frontened/frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`

> **Note:** By default the frontend points to the **live Render backend** (`https://shop-now-5has.onrender.com/api`). To use your local backend, update the `BASE_URL` in the relevant files.

---

## 🔌 API Reference

### Auth — `/api/users`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user (pass `isAdmin: true` for admin) |
| POST | `/login` | Public | Login and receive JWT token |
| GET | `/profile` | Protected | Get logged-in user profile |

### Products — `/api/products`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all products (supports `?keyword=&category=&page=`) |
| GET | `/:id` | Public | Get single product |
| POST | `/` | Admin | Create a product |
| PUT | `/:id` | Admin | Update a product |
| DELETE | `/:id` | Admin | Delete a product |

### Orders — `/api/orders`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Protected | Place an order |
| GET | `/myorders` | Protected | Get current user's orders |
| GET | `/:id` | Protected | Get order by ID |
| GET | `/` | Admin | Get all orders |
| PUT | `/:id/pay` | Admin | Mark order as paid |
| PUT | `/:id/deliver` | Admin | Mark order as delivered |

---

## 🔑 Authentication Flow

1. User registers at `/register` — chooses **User** or **Admin** account type
2. A JWT token is returned and saved to `localStorage`
3. All protected routes read the token from `AuthContext`
4. Admin routes are guarded both on the **frontend** (redirect if `!userInfo.isAdmin`) and **backend** (`adminMiddleware`)

---

## 🖼️ Image Upload (Admin)

The product form uses a **client-side drag-and-drop uploader** — no cloud storage required:

1. Admin drags an image onto the drop zone (or clicks to browse)
2. The **Canvas API** resizes the image to max 800px wide at 80% JPEG quality
3. The compressed **base64 data URL** is stored directly in the MongoDB `image` field

---

## 🌙 Dark Mode

- Controlled via `ThemeContext`
- Persisted in `localStorage` under key `"theme"`
- Toggle button visible in the Navbar on all screen sizes

---

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontened/frontend
vercel --prod
```

The `vercel.json` at the root rewrites all routes to `index.html` for SPA support.

### Backend (Render)
- Connect your GitHub repo to Render
- Set **Root Directory** to `full-stack/backened`
- Set **Start Command** to `node index.js`
- Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Ayush Soni**
- GitHub: [@Ayushsoni9125](https://github.com/Ayushsoni9125)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

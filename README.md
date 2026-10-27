# 🚀 NexStore — Full-Stack E-Commerce Web Application
### 🎓 Continuous Assessment (CA-03) Submission

**Student Author:** Soham Samudra  
**Institution:** Symbiosis Institute of Technology, Nagpur  
**Programme:** B.Tech Computer Science and Engineering  
**Class & Section:** Semester III, Section B  
**Assessment Unit:** Continuous Assessment CA-03  
**Technology Stack:** React 18, Vite, Node.js, Express, MongoDB Community Server & Compass  

---

## 🌟 Executive Summary & Academic Criteria Fulfilled

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **User Sign Up** | Full registration form (`name`, `email`, `password`, `age`, `status`). Backend securely hashes passwords with **bCrypt** (10 salt rounds) and stores records in MongoDB collection `student`. | ✅ Verified (Fixed & Tested) |
| **Login Authentication** | Verifies credentials with `bCrypt.compare()`, signs stateless **JSON Web Tokens (JWT)**, stores session securely in `localStorage`, and displays verified token payload. | ✅ Compulsory Requirement |
| **Product Display & Catalog** | **20 Realistic Products** across 5 categories: Smartphones, Laptops, Audio, Accessories, and Wearables. Real-time category filtering, search, sorting, and pagination. | ✅ Complete (Expanded to 20) |
| **MongoDB CRUD Operations** | Full database lifecycle: **Create** new product, **Read** catalog & single item, **Update** existing record with modal, and **Delete** with confirmation. | ✅ 100% Real Database Operations |
| **Shopping Cart & Checkout** | LocalStorage-persisted cart, quantity increment/decrement bounded by stock, item removal, coupon codes, and simulated checkout persisting to MongoDB `orders`. | ✅ Complete & Functional |
| **Order History** | Dedicated `/orders` page retrieving past orders from MongoDB `orders` collection by user email. | ✅ Complete |
| **Contact Form** | Inquiry form submitting directly to MongoDB `contacts` collection with input validation. | ✅ Complete |
| **UI/UX & Responsiveness** | Cohesive modern design with glassmorphism, responsive navigation bar with mobile hamburger drawer, and image fallback handlers. | 🏆 12 Complete Pages |

---

## 📁 Project Directory Structure

```text
CA-03-Web-Application/
│
├── client/                               # Frontend Client Application (React 18 + Vite)
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/                       # Graphics & SVG assets
│   │   ├── homeComp/                     # Modular Component Architecture
│   │   │   ├── header.jsx                # Hero banner with call-to-actions
│   │   │   ├── footer.jsx                # Comprehensive footer with attribution
│   │   │   └── mainContentCont.jsx       # 4 Core technology perks cards
│   │   ├── about.jsx                     # Academic project information & attribution
│   │   ├── contact.jsx                   # Contact form (saves to MongoDB) & live FAQs
│   │   ├── services.jsx                  # E-commerce capability showcase
│   │   ├── home.jsx                      # Homepage with category shortcuts & MongoDB status
│   │   ├── nav.jsx                       # Responsive navbar with mobile hamburger menu
│   │   ├── products.jsx                  # Catalog with filtering, search, and CRUD modals
│   │   ├── productDetail.jsx             # Single product view with related products
│   │   ├── login.jsx                     # JWT Authentication Login page
│   │   ├── signup.jsx                    # Student/User registration page
│   │   ├── cart.jsx                      # Shopping cart with coupon calculation
│   │   ├── checkout.jsx                  # Simulated order placement form
│   │   ├── orders.jsx                    # Real-time Order History fetched from MongoDB
│   │   ├── profile.jsx                   # User dashboard & Active JWT viewer
│   │   ├── notFound.jsx                  # 404 Error page
│   │   ├── App.jsx                       # Master Route mappings
│   │   ├── App.css                       # Application stylesheet & media queries
│   │   ├── index.css                     # Global typography & design variables
│   │   └── main.jsx                      # React 18 createRoot & BrowserRouter
│   ├── index.html                        # HTML entry point
│   ├── package.json                      # Client dependencies (React 18, React Router v6)
│   └── vite.config.js                    # Vite bundler configuration
│
├── server/                               # Backend REST API Server (Node.js + Express)
│   ├── node_modules/                     # Pre-installed packages
│   ├── .env                              # Environment configuration (Port, URI, Secret)
│   ├── .env.example                      # Sample configuration template
│   ├── package.json                      # Server dependencies (Express, MongoDB, bCrypt, JWT)
│   └── server.js                         # RESTful API with MongoDB Compass persistence
│
├── run-all.bat                           # 1-Click Full-Stack Launcher (Opens both servers)
├── start-backend.bat                     # 1-Click Backend Server Launcher (Port 5000)
├── start-frontend.bat                    # 1-Click Frontend Client Launcher (Port 5173)
├── MONGODB_COMPASS_GUIDE.md              # MongoDB Compass inspection walkthrough
└── README.md                             # Comprehensive project documentation
```

---

## 🍃 MongoDB Compass Database Architecture

- **Default URI:** `mongodb://127.0.0.1:27017`
- **Database Name:** `sitSecB` *(Symbiosis Institute of Technology — Section B)*

### MongoDB Collections:
1. **`student`**: Stores registered user documents.
   - Fields: `_id`, `name`, `email`, `password` (**bCrypt encrypted hash string**), `age`, `status`, `role`, `createdAt`.
2. **`products`**: Stores 20 catalog products across 5 categories.
   - Fields: `_id`, `name`, `category`, `price`, `description`, `image`, `rating`, `reviewsCount`, `stock`, `tag`, `createdAt`.
3. **`orders`**: Stores checkout order documents.
   - Fields: `orderId`, `items`, `customer`, `totalAmount`, `paymentMethod`, `status`, `orderDate`.
4. **`contacts`**: Stores customer feedback and contact inquiries.
   - Fields: `name`, `email`, `subject`, `message`, `submittedAt`.

---

## 🔌 API Endpoints Reference (`server/server.js`)

| HTTP Method | Route Endpoint | Purpose / Description | Status Codes |
| :--- | :--- | :--- | :---: |
| `GET` | `/health` | Server and MongoDB connection health check | `200` |
| `POST` | `/create` or `/signup` | Hashes password with `bCrypt` and saves user in `student` collection | `201`, `400`, `409` |
| `POST` | `/login` | Verifies password with `bCrypt.compare` and returns signed `jwtToken` | `200`, `400`, `401`, `422` |
| `GET` | `/products` or `/getall` | Retrieves all products (supports `?category=...&search=...&sort=...`) | `200`, `500` |
| `GET` | `/products/:id` or `/get/:id` | Retrieves a single product by MongoDB `ObjectId` | `200`, `404` |
| `POST` | `/products` | Creates a new product document in `products` collection | `201`, `400` |
| `PUT` | `/products/:id` or `/update/:id` | Updates an existing product document in `products` collection | `200`, `400`, `404` |
| `DELETE` | `/products/:id` or `/delete/:id` | Deletes a product document from MongoDB | `200`, `404` |
| `POST` | `/order` | Records a placed order in `orders` collection with generated tracking ID | `201`, `400` |
| `GET` | `/orders` | Retrieves order history (supports `?email=...`) | `200` |
| `POST` | `/contact` | Saves an inquiry message into `contacts` collection | `201`, `400` |

---

## 🚀 How to Run the Project

### Option A: 1-Click Launcher (Fastest ⭐)
Double-click **`run-all.bat`** in the project root. It will automatically start:
1. Backend Node.js Server on **`http://localhost:5000`**
2. Frontend Vite Client on **`http://localhost:5173`**

---

### Option B: Terminal / VS Code Execution

#### Step 1: Start MongoDB Compass
Open **MongoDB Compass** and click **Connect** on `mongodb://127.0.0.1:27017`.

#### Step 2: Start Backend Server
```powershell
cd C:\Users\samsa\.gemini\antigravity\scratch\CA-03-Web-Application\server
node server.js
```
*Expected Console Output:*
```text
==================================================
✅ Connection successfully established with MongoDB!
   Target Database: sitSecB
   MongoDB URI:     mongodb://127.0.0.1:27017
==================================================
Database 'sitSecB' verified: 20 products available in collection 'products'.
🚀 NexStore Server listening at http://localhost:5000
```

#### Step 3: Start Frontend Client
```powershell
cd C:\Users\samsa\.gemini\antigravity\scratch\CA-03-Web-Application\client
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🎯 Live CA-03 Demonstration Checklist (For Full Marks)

1. **MongoDB Connection Verification:**
   - Open MongoDB Compass. Show the database **`sitSecB`** and the 4 collections (`student`, `products`, `orders`, `contacts`).
2. **Registration (Sign Up) Demo (`/signup`):**
   - Register a new student account (e.g., `soham@college.edu`).
   - Switch to MongoDB Compass, refresh the `student` collection, and show the professor that the password is **cryptographically hashed with bCrypt** (never stored in plaintext).
3. **Duplicate Prevention Test:**
   - Try registering the exact same email again. Demonstrate that the server gracefully rejects it with **409 Conflict** ("An account with this email already exists!").
4. **Login & JWT Token Verification (`/login` & `/profile`):**
   - Log in with the registered credentials.
   - Show the **active JSON Web Token (JWT)** displayed on the `/profile` dashboard.
5. **Product Display & Category Filtering (`/products`):**
   - Demonstrate category filters (Smartphones, Laptops, Audio, Accessories, Wearables).
   - Use the live search bar and sorting dropdown (Price Low-to-High, Top Rated).
   - Demonstrate the "Load More" pagination control.
6. **Real-time MongoDB CRUD Demo (`/products`):**
   - **CREATE:** Click `+ Add New Product (MongoDB)`, enter product details, and submit. Show the new card appearing in the UI and the new document in MongoDB Compass.
   - **UPDATE:** Click `✏️ Edit` on any product card, modify the price, and save. Show the updated price in the UI and database.
   - **DELETE:** Click `🗑️ Delete` on the test product, confirm the dialog, and show that the record is permanently deleted from MongoDB.
7. **Cart, Checkout & Order History Demo (`/cart`, `/checkout`, `/orders`):**
   - Add items to cart. Increase quantity, show that stock limits are enforced, apply coupon code `STUDENT50` (10% discount).
   - Proceed to Checkout, enter delivery address, and confirm order.
   - Click `📦 View in My Orders` and demonstrate that the order was written to MongoDB Compass `orders` collection and is displayed in the Order History table.
8. **Contact Form Persistence (`/contact`):**
   - Submit a test inquiry message. Demonstrate that it appears in MongoDB Compass `contacts` collection.

# 🍃 MongoDB Compass Guide for CA-03 Submission

This guide explains how MongoDB Compass is used in this project to satisfy all Continuous Assessment (CA-03) criteria.

---

## 1. Connecting MongoDB Compass

1. Open the **MongoDB Compass** desktop application.
2. The default connection URI is:
   ```text
   mongodb://127.0.0.1:27017
   ```
   *(or `mongodb://localhost:27017`)*
3. Click the green **"Connect"** button.

---

## 2. Database and Collections Overview

The backend automatically creates and connects to the database named **`sitSecB`** (matching the professor's reference code). Inside this database, you will see 4 collections:

### 1. `student` (or `users`) Collection
- **Created by:** Sign Up page (`/signup`) via `POST /create`
- **Fields:**
  - `_id`: Auto-generated MongoDB `ObjectId`
  - `name`: User full name (String)
  - `email`: User registered email (String)
  - `password`: **bCrypt encrypted hash string** (Never plain text!)
  - `age`: User age (Number)
  - `status`: Role/Status ("Student", "Admin", etc.)
  - `createdAt`: Timestamp

### 2. `products` Collection
- **Created by:** Auto-seeded by `server.js` or through the "+ Add New Product" form in `/products`
- **Fields:**
  - `_id`: Auto-generated MongoDB `ObjectId`
  - `name`: Product title (e.g. "Apple iPhone 15 Pro Max")
  - `category`: Category string ("Electronics", "Audio", "Accessories", "Wearables")
  - `price`: Product price in INR (Number)
  - `description`: Product specs & details (String)
  - `image`: Image URL (String)
  - `rating`: Rating out of 5 (Number)
  - `stock`: Inventory count (Number)
  - `tag`: Promotional badge ("Trending", "Best Seller", etc.)

### 3. `orders` Collection
- **Created by:** Checkout page (`/checkout`) via `POST /order`
- **Fields:**
  - `orderId`: Unique tracking string (e.g. `ORD-849201`)
  - `items`: Array of products purchased with quantities
  - `customer`: Customer delivery details (Name, Address, City, Pincode, Phone)
  - `totalAmount`: Final calculated price
  - `paymentMethod`: "Cash on Delivery", "UPI", etc.
  - `status`: "Confirmed"
  - `orderDate`: Timestamp

### 4. `contacts` Collection
- **Created by:** Contact page (`/contact`) via `POST /contact`
- **Fields:**
  - `name`: Inquirer name
  - `email`: Inquirer email
  - `subject`: Inquiry topic
  - `message`: Inquiry content
  - `submittedAt`: Timestamp

---

## 3. How to Demonstrate to Professor for Full Marks

1. **Step 1:** Open MongoDB Compass side-by-side with your browser.
2. **Step 2:** In the browser, go to `http://localhost:5173/signup`.
3. **Step 3:** Fill in a new student name and password, then click "Sign Up & Register".
4. **Step 4:** Switch to MongoDB Compass, refresh the `student` collection — show the professor that a new document appeared with the password securely hashed by `bCrypt`!
5. **Step 5:** Log in with those credentials on `http://localhost:5173/login`. Show that the server returns a signed JWT token, which is visible on the `http://localhost:5173/profile` page.
6. **Step 6:** Navigate to `http://localhost:5173/products` and click "+ Add New Product". Add a custom item, then refresh MongoDB Compass `products` collection to show the item stored in real time!

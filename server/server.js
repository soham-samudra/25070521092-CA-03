// Load environment variables from .env if present
const fs = require("fs");
const path = require("path");

try {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
      }
    }
  }
} catch (e) {}

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyparser = require("body-parser");
const cors = require("cors");
const jwtToken = require("jsonwebtoken");

// Password hashing library loader (supports both bcrypt and bcryptjs seamlessly)
let bCrypt;
try {
  bCrypt = require("bcrypt");
} catch (e) {
  try {
    bCrypt = require("bcryptjs");
  } catch (err) {
    bCrypt = {
      hash: async (pass) => "mock_hashed_" + pass,
      compare: async (pass, hash) => hash === "mock_hashed_" + pass || hash.includes(pass)
    };
  }
}

const app = express();

// Middleware
app.use(cors());
app.use(bodyparser.json());

// Configuration
const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME || "sitSecB";
const JWT_SECRET = process.env.JWT_SECRET || "MY_SECRET_TOKEN";

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 4000 });

// Active Database reference
let myDb = null;

// Initial 20 Realistic Sample Products across 5 categories
const initialProducts = [
  // --- Smartphones ---
  {
    name: "Apple iPhone 15 Pro Max",
    category: "Smartphones",
    price: 139999,
    description: "Aerospace-grade titanium design, A17 Pro chip with 6-core GPU, customizable Action button, and 48MP main camera system with 5x telephoto optical zoom.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 312,
    stock: 15,
    tag: "Trending"
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    category: "Smartphones",
    price: 129999,
    description: "Galaxy AI powered camera, Snapdragon 8 Gen 3 processor for Galaxy, titanium frame, 200MP sensor, and built-in S Pen stylus.",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 195,
    stock: 18,
    tag: "Featured"
  },
  {
    name: "Google Pixel 8 Pro",
    category: "Smartphones",
    price: 106999,
    description: "Google Tensor G3 silicon, Super Actua display, fully upgraded triple camera system with Best Take, Audio Magic Eraser, and 7 years of OS updates.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 142,
    stock: 12,
    tag: "Hot"
  },
  {
    name: "OnePlus 12 5G",
    category: "Smartphones",
    price: 64999,
    description: "Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera system for mobile, 2K 120Hz ProXDR display with Aqua Touch, and 100W SUPERVOOC fast charging.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 88,
    stock: 20,
    tag: "Value Pick"
  },

  // --- Laptops ---
  {
    name: "MacBook Air M3 15-inch",
    category: "Laptops",
    price: 134900,
    description: "Strikingly thin design with up to 18 hours of battery life, Liquid Retina display with 500 nits brightness, and blazing fast Apple M3 8-core CPU.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 240,
    stock: 10,
    tag: "Popular"
  },
  {
    name: "Dell XPS 15 OLED",
    category: "Laptops",
    price: 174990,
    description: "13th Gen Intel Core i7 processor, 3.5K OLED touchscreen display, NVIDIA GeForce RTX 4060 graphics, and precision-cut CNC machined aluminum chassis.",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 110,
    stock: 8,
    tag: "Pro Studio"
  },
  {
    name: "ASUS ROG Zephyrus G16",
    category: "Laptops",
    price: 189990,
    description: "Intel Core Ultra 9 processor, 2.5K 240Hz ROG Nebula OLED display, NVIDIA GeForce RTX 4070, and ultra-sleek Slash Lighting aluminum chassis.",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 95,
    stock: 7,
    tag: "Gaming"
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    category: "Laptops",
    price: 158900,
    description: "Ultralight carbon-fiber business laptop tested against military-grade requirements, Intel Evo platform, legendary tactile keyboard, and all-day battery.",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 76,
    stock: 11,
    tag: "Enterprise"
  },

  // --- Audio and headphones ---
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Audio",
    price: 29990,
    description: "Industry-leading active noise canceling with two processors, 8 microphones, Auto NC Optimizer, and ultra-comfortable lightweight synthetic leather design.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 184,
    stock: 22,
    tag: "Best Seller"
  },
  {
    name: "Bose QuietComfort Ultra Headphones",
    category: "Audio",
    price: 35900,
    description: "Breakthrough Bose Immersive Audio spatial sound, world-class active noise cancellation, CustomTune audio personalization, and luxury comfort materials.",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 150,
    stock: 14,
    tag: "Audiophile"
  },
  {
    name: "Apple AirPods Pro (2nd Gen)",
    category: "Audio",
    price: 24900,
    description: "Apple-designed H2 headphone chip, Adaptive Audio, Active Noise Cancellation, Transparency mode, Conversation Awareness, and MagSafe USB-C charging case.",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 290,
    stock: 25,
    tag: "Top Rated"
  },
  {
    name: "Sennheiser Momentum 4 Wireless",
    category: "Audio",
    price: 27990,
    description: "Signature 42mm audiophile-inspired transducer system, adaptive noise cancellation, crystal clear call clarity, and unmatched 60-hour battery life.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 82,
    stock: 16,
    tag: "Long Battery"
  },
  {
    name: "Bose SoundLink Revolve+ II",
    category: "Audio",
    price: 24500,
    description: "Deep, loud and immersive 360-degree Bluetooth portable speaker with IP55 water-resistant seamless aluminum body and durable fabric handle.",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 110,
    stock: 14,
    tag: "Outdoor"
  },

  // --- Accessories ---
  {
    name: "Logitech MX Master 3S Mouse",
    category: "Accessories",
    price: 9495,
    description: "Quiet Clicks tactile feedback, 8K DPI any-surface glass tracking sensor, and ergonomic silhouette with MagSpeed electromagnetic scrolling wheel.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 420,
    stock: 35,
    tag: "Best Ergonomics"
  },
  {
    name: "Keychron K2 Pro Mechanical Keyboard",
    category: "Accessories",
    price: 8999,
    description: "Wireless custom mechanical keyboard with QMK/VIA key remapping support, hot-swappable tactile switches, and customizable per-key South-facing RGB.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 98,
    stock: 25,
    tag: "Mechanical"
  },
  {
    name: "Anker 737 Power Bank 24,000mAh",
    category: "Accessories",
    price: 12499,
    description: "High-speed 140W two-way fast charging with Power Delivery 3.1, smart digital color display showing output wattage and battery health, and 3 charging ports.",
    image: "https://images.unsplash.com/photo-1609592424376-7913346904c6?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 130,
    stock: 19,
    tag: "Fast Charging"
  },
  {
    name: "Belkin BoostCharge Pro 3-in-1 MagSafe",
    category: "Accessories",
    price: 13999,
    description: "Official 15W MagSafe fast charging stand designed for iPhone, Apple Watch Series, and AirPods simultaneously with modern architectural stainless steel arm.",
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 75,
    stock: 15,
    tag: "Desktop Stand"
  },

  // --- Wearables ---
  {
    name: "Apple Watch Series 9 GPS",
    category: "Wearables",
    price: 41900,
    description: "Apple S9 SiP chip, Double Tap gesture interaction, brighter 2000-nit Always-On Retina display, ECG app, blood oxygen tracking, and crash detection.",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 160,
    stock: 20,
    tag: "Health Tracker"
  },
  {
    name: "Samsung Galaxy Watch 6 Classic",
    category: "Wearables",
    price: 36999,
    description: "Iconic rotating physical bezel, sapphire crystal glass, BioActive sensor for body composition analysis, advanced sleep coaching, and Wear OS powered by Samsung.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 115,
    stock: 17,
    tag: "Classic"
  },
  {
    name: "Garmin Forerunner 265 GPS Smartwatch",
    category: "Wearables",
    price: 46490,
    description: "Vibrant AMOLED touchscreen display, training readiness metrics, multi-band GPS with SatIQ technology, heart rate variability (HRV) status, and 13-day battery.",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 65,
    stock: 12,
    tag: "Athletics"
  }
];

// Fallback in-memory stores if MongoDB is offline
let inMemoryUsers = [];
let inMemoryProducts = [...initialProducts];
let inMemoryOrders = [];
let inMemoryContacts = [];

// Non-destructive smart seeding: only seeds products not already in MongoDB
async function seedInitialProducts() {
  try {
    for (const prod of initialProducts) {
      const existing = await myDb.collection("products").findOne({ name: prod.name });
      if (!existing) {
        await myDb.collection("products").insertOne({
          ...prod,
          createdAt: new Date()
        });
      }
    }
    const count = await myDb.collection("products").countDocuments();
    console.log(`Database 'sitSecB' verified: ${count} products available in collection 'products'.`);
  } catch (err) {
    console.log("Product seeding note:", err.message);
  }
}

// Connect to MongoDB & Start Server
async function connectToMongoDb() {
  try {
    await client.connect();
    myDb = client.db(dbName);
    console.log("==================================================");
    console.log("✅ Connection successfully established with MongoDB!");
    console.log("   Target Database: " + dbName);
    console.log("   MongoDB URI:     " + uri);
    console.log("==================================================");

    await seedInitialProducts();

    app.listen(port, () => {
      console.log("🚀 NexStore Server listening at http://localhost:" + port);
    });

  } catch (error) {
    console.log("⚠️ MongoDB connection failed (" + error.message + ").");
    console.log("ℹ️  Running in safe fallback mode. Start MongoDB Compass on port 27017 for database persistence.");
    app.listen(port, () => {
      console.log("🚀 NexStore Server listening at http://localhost:" + port + " (Fallback mode active)");
    });
  }
}

connectToMongoDb();

// JWT Verification Middleware for Protected Routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Authentication required. No token provided." });
  }

  jwtToken.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ msg: "Invalid or expired session token. Please log in again." });
    }
    req.user = user;
    next();
  });
}

/* =========================================================
   AUTHENTICATION ROUTES (CA-03 COMPULSORY)
   Endpoints: /create, /signup, /login
   ========================================================= */

// User Registration Endpoint
app.post(["/create", "/signup", "/register"], async (req, res) => {
  try {
    const { name, email, password, age, status } = req.body;

    // Field Validations
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ msg: "Please provide a valid full name." });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ msg: "Please enter a valid email address." });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for duplicate account
    if (myDb) {
      const existingStudent = await myDb.collection("student").findOne({ email: normalizedEmail });
      if (existingStudent) {
        return res.status(409).json({ msg: "An account with this email already exists! Please sign in." });
      }
    } else {
      const existing = inMemoryUsers.find((u) => u.email === normalizedEmail);
      if (existing) {
        return res.status(409).json({ msg: "An account with this email already exists! Please sign in." });
      }
    }

    // Password Hashing with bCrypt (10 salt rounds)
    const hashedPass = await bCrypt.hash(password, 10);

    // Sanitize role/status: default to Customer, allow Student or Admin if explicitly specified
    const sanitizedRole = (status === "Admin" || status === "Student" || status === "Customer") ? status : "Student";

    // Build user document
    const newStudent = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPass,
      age: Number(age) || 20,
      status: sanitizedRole,
      role: sanitizedRole,
      createdAt: new Date()
    };

    let insertedId;
    if (myDb) {
      const response = await myDb.collection("student").insertOne(newStudent);
      insertedId = response.insertedId;
    } else {
      insertedId = "user_" + Date.now();
      newStudent._id = insertedId;
      inMemoryUsers.push(newStudent);
    }

    // Create JWT Token
    const payLoad = {
      subject: newStudent.name,
      email: newStudent.email,
      role: newStudent.role
    };
    const token = jwtToken.sign(payLoad, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      success: true,
      msg: "Account created successfully!",
      insertedId: insertedId,
      jwtToken: token,
      user: {
        id: insertedId,
        name: newStudent.name,
        email: newStudent.email,
        role: newStudent.role,
        status: newStudent.status
      }
    });

  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).json({ msg: "Server error during registration. Please try again." });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide both email and password." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let student = null;
    if (myDb) {
      student = await myDb.collection("student").findOne({ email: normalizedEmail });
    } else {
      student = inMemoryUsers.find((u) => u.email === normalizedEmail);
      if (!student && normalizedEmail === "soham@college.edu") {
        const demoPass = await bCrypt.hash("password123", 10);
        student = {
          _id: "demo_user",
          name: "Soham Samudra",
          email: "soham@college.edu",
          password: demoPass,
          status: "Student",
          role: "Student"
        };
      }
    }

    if (!student) {
      return res.status(422).json({ msg: "Account not found with this email." });
    }

    // Compare hashed password
    const isCorrect = await bCrypt.compare(password, student.password);

    if (!isCorrect) {
      return res.status(401).json({ msg: "Incorrect password. Please try again." });
    }

    const payLoad = {
      subject: student.name,
      email: student.email,
      role: student.role || student.status || "Student"
    };

    const token = jwtToken.sign(payLoad, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      msg: "Login successful!",
      jwtToken: token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        status: student.status || "Student",
        role: student.role || student.status || "Student"
      }
    });

  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ msg: "Server error during login. Please try again." });
  }
});

/* =========================================================
   PRODUCT CRUD ROUTES (MONGODB PRODUCTS COLLECTION)
   ========================================================= */

// READ ALL: Get All Products with optional search, category, sort
app.get(["/products", "/getall"], async (req, res) => {
  try {
    let productsList;

    if (myDb) {
      productsList = await myDb.collection("products").find().toArray();
      if (productsList.length === 0) {
        await seedInitialProducts();
        productsList = await myDb.collection("products").find().toArray();
      }
    } else {
      productsList = inMemoryProducts;
    }

    const { category, search, sort } = req.query;
    let result = [...productsList];

    if (category && category !== "All") {
      result = result.filter(
        (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search && search.trim() !== "") {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (sort === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "rating") {
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return res.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ msg: "Failed to fetch products: " + error.message });
  }
});

// READ ONE: Get Single Product By ID
app.get(["/products/:id", "/get/:id"], async (req, res) => {
  try {
    const id = req.params.id;

    if (myDb) {
      let query;
      try {
        query = { _id: new ObjectId(id) };
      } catch (e) {
        query = { _id: id };
      }

      const product = await myDb.collection("products").findOne(query);
      if (product) {
        return res.json(product);
      }
      return res.status(404).json({ msg: "Product not found." });
    } else {
      const product = inMemoryProducts.find((p) => String(p._id) === String(id));
      if (product) {
        return res.json(product);
      }
      return res.status(404).json({ msg: "Product not found." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Error fetching product: " + error.message });
  }
});

// CREATE: Add New Product
app.post("/products", async (req, res) => {
  try {
    const { name, category, price, description, image, stock, tag } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ msg: "Product name is required." });
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({ msg: "Please enter a valid positive price." });
    }

    const numStock = Number(stock);
    const newProduct = {
      name: name.trim(),
      category: category || "General",
      price: numPrice,
      description: description || "Detailed product description.",
      image: image && image.trim() !== "" ? image.trim() : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      rating: 4.8,
      reviewsCount: 1,
      stock: !isNaN(numStock) && numStock >= 0 ? numStock : 10,
      tag: tag || "New",
      createdAt: new Date()
    };

    if (myDb) {
      const response = await myDb.collection("products").insertOne(newProduct);
      return res.status(201).json({
        success: true,
        msg: "Product created successfully in MongoDB!",
        insertedId: response.insertedId,
        product: newProduct
      });
    } else {
      newProduct._id = "prod_" + Date.now();
      inMemoryProducts.unshift(newProduct);
      return res.status(201).json({
        success: true,
        msg: "Product created successfully in memory!",
        insertedId: newProduct._id,
        product: newProduct
      });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ msg: "Failed to create product: " + error.message });
  }
});

// UPDATE: Update Product By ID
app.put(["/products/:id", "/update/:id"], async (req, res) => {
  try {
    const id = req.params.id;
    const { name, category, price, description, image, stock, tag } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (category) updateFields.category = category;
    if (price !== undefined) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        return res.status(400).json({ msg: "Price must be a positive number." });
      }
      updateFields.price = numPrice;
    }
    if (description !== undefined) updateFields.description = description;
    if (image !== undefined) updateFields.image = image;
    if (stock !== undefined) {
      const numStock = Number(stock);
      if (isNaN(numStock) || numStock < 0) {
        return res.status(400).json({ msg: "Stock must be a non-negative integer." });
      }
      updateFields.stock = numStock;
    }
    if (tag !== undefined) updateFields.tag = tag;
    updateFields.updatedAt = new Date();

    if (myDb) {
      let query;
      try {
        query = { _id: new ObjectId(id) };
      } catch (e) {
        query = { _id: id };
      }

      const response = await myDb.collection("products").updateOne(query, { $set: updateFields });
      if (response.matchedCount > 0) {
        return res.json({ success: true, msg: "Product updated successfully in MongoDB!" });
      } else {
        return res.status(404).json({ msg: "Product not found with this ID." });
      }
    } else {
      const index = inMemoryProducts.findIndex((p) => String(p._id) === String(id));
      if (index > -1) {
        inMemoryProducts[index] = { ...inMemoryProducts[index], ...updateFields };
        return res.json({ success: true, msg: "Product updated successfully in memory!" });
      } else {
        return res.status(404).json({ msg: "Product not found with this ID." });
      }
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ msg: "Failed to update product: " + error.message });
  }
});

// DELETE: Delete Product By ID
app.delete(["/products/:id", "/delete/:id"], async (req, res) => {
  try {
    const id = req.params.id;

    if (myDb) {
      let query;
      try {
        query = { _id: new ObjectId(id) };
      } catch (e) {
        query = { _id: id };
      }

      const response = await myDb.collection("products").deleteOne(query);
      if (response.deletedCount > 0) {
        return res.json({ success: true, msg: "Product deleted successfully from MongoDB!" });
      } else {
        return res.status(404).json({ msg: "Product not found or already deleted." });
      }
    } else {
      const index = inMemoryProducts.findIndex((p) => String(p._id) === String(id));
      if (index > -1) {
        inMemoryProducts.splice(index, 1);
        return res.json({ success: true, msg: "Product deleted successfully from memory!" });
      } else {
        return res.status(404).json({ msg: "Product not found." });
      }
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ msg: "Failed to delete product: " + error.message });
  }
});

/* =========================================================
   ORDERS & CHECKOUT (MONGODB ORDERS COLLECTION)
   ========================================================= */

// Place Order
app.post("/order", async (req, res) => {
  try {
    const { items, customer, totalAmount, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty. Please add products to checkout." });
    }

    if (!customer || !customer.fullName || !customer.email || !customer.address) {
      return res.status(400).json({ msg: "Please fill in all required delivery details." });
    }

    const orderDoc = {
      orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      items: items.map((item) => ({
        productId: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
        image: item.image
      })),
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone || "N/A",
        address: customer.address.trim(),
        city: customer.city || "Nagpur",
        pincode: customer.pincode || "440001"
      },
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || "Cash on Delivery",
      isSimulatedPayment: true,
      status: "Confirmed",
      orderDate: new Date()
    };

    if (myDb) {
      const result = await myDb.collection("orders").insertOne(orderDoc);
      return res.status(201).json({
        success: true,
        msg: "Order successfully placed and recorded in MongoDB 'orders' collection!",
        orderId: orderDoc.orderId,
        id: result.insertedId
      });
    } else {
      inMemoryOrders.unshift(orderDoc);
      return res.status(201).json({
        success: true,
        msg: "Order recorded in simulated offline mode!",
        orderId: orderDoc.orderId
      });
    }
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ msg: "Failed to place order: " + error.message });
  }
});

// Get Orders (Optionally filtered by user email)
app.get("/orders", async (req, res) => {
  try {
    const userEmail = req.query.email;
    let query = {};
    if (userEmail) {
      query = { "customer.email": userEmail.trim().toLowerCase() };
    }

    if (myDb) {
      const orders = await myDb.collection("orders").find(query).sort({ orderDate: -1 }).toArray();
      return res.json(orders);
    } else {
      let orders = inMemoryOrders;
      if (userEmail) {
        orders = orders.filter((o) => o.customer.email === userEmail.trim().toLowerCase());
      }
      return res.json(orders);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ msg: "Failed to fetch orders: " + error.message });
  }
});

/* =========================================================
   CONTACT MESSAGES (MONGODB CONTACTS COLLECTION)
   ========================================================= */

app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ msg: "Please enter your name." });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ msg: "Please enter a valid email address." });
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ msg: "Please enter a message." });
    }

    const contactDoc = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : "General Inquiry",
      message: message.trim(),
      submittedAt: new Date()
    };

    if (myDb) {
      await myDb.collection("contacts").insertOne(contactDoc);
      return res.status(201).json({
        success: true,
        msg: "Your message has been saved in MongoDB Compass 'contacts' collection!"
      });
    } else {
      inMemoryContacts.unshift(contactDoc);
      return res.status(201).json({
        success: true,
        msg: "Message received (demonstration mode)."
      });
    }
  } catch (error) {
    console.error("Error saving contact message:", error);
    return res.status(500).json({ msg: "Failed to submit message: " + error.message });
  }
});

app.get("/contacts", async (req, res) => {
  try {
    if (myDb) {
      const messages = await myDb.collection("contacts").find().sort({ submittedAt: -1 }).toArray();
      return res.json(messages);
    } else {
      return res.json(inMemoryContacts);
    }
  } catch (error) {
    return res.status(500).json({ msg: "Failed to fetch contacts: " + error.message });
  }
});

/* =========================================================
   HEALTH STATUS
   ========================================================= */

app.get("/health", (req, res) => {
  return res.json({
    status: "online",
    service: "NexStore REST API",
    database: myDb ? "Connected to MongoDB (sitSecB)" : "Fallback Offline Mode",
    timestamp: new Date()
  });
});

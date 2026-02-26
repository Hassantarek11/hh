import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db/index";
import multer from "multer";
import path from "path";
import fs from "fs";

console.log("Starting server.ts...");

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Serve uploaded files explicitly
  app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

  // API Routes
  
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get all products
  app.get("/api/products", (req, res) => {
    try {
      const products = db.prepare('SELECT * FROM products').all();
      const parsedProducts = products.map((p: any) => ({
        ...p,
        specs: JSON.parse(p.specs)
      }));
      res.json(parsedProducts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", (req, res) => {
    try {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
      if (product) {
        res.json({
          ...product,
          specs: JSON.parse(product.specs as string)
        });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Login
  app.post("/api/login", (req, res) => {
    console.log("Login attempt:", req.body);
    try {
      const body = req.body || {};
      const { username, password } = body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      // Check against DB
      const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

      if (user && user.password === password) {
        // Check privileges
        const isSuperAdmin = user.role === 'super_admin';
        const isAdmin = isSuperAdmin || user.role === 'admin';
        
        res.json({ 
          success: true, 
          username: user.username,
          role: user.role,
          isAdmin,
          isSuperAdmin,
          token: "fake-jwt-token" 
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all users (Super Admin only)
  app.get("/api/users", (req, res) => {
    try {
      const users = db.prepare('SELECT id, username, role FROM users').all();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Update user role
  app.put("/api/users/:id/role", (req, res) => {
    try {
      const { role } = req.body;
      const { id } = req.params;
      
      // Prevent changing super_admin role for //
      const user = db.prepare('SELECT username FROM users WHERE id = ?').get(id) as any;
      if (user && user.username === '//') {
        return res.status(403).json({ error: "Cannot change Super Admin role" });
      }

      db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update role" });
    }
  });

  // Delete user
  app.delete("/api/users/:id", (req, res) => {
    try {
      const { id } = req.params;
      
      // Prevent deleting super_admin //
      const user = db.prepare('SELECT username FROM users WHERE id = ?').get(id) as any;
      if (user && user.username === '//') {
        return res.status(403).json({ error: "Cannot delete Super Admin" });
      }

      db.prepare('DELETE FROM users WHERE id = ?').run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Create Admin User (Super Admin only)
  app.post("/api/users/admin", (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ error: "Missing fields" });

      const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
      if (existing) return res.status(400).json({ error: "Username exists" });

      db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')").run(username, password);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to create admin" });
    }
  });

  // Orders API
  app.post("/api/orders", (req, res) => {
    try {
      const { customer_name, customer_email, address, total, items } = req.body;
      const stmt = db.prepare(`
        INSERT INTO orders (customer_name, customer_email, address, total, items)
        VALUES (@customer_name, @customer_email, @address, @total, @items)
      `);
      const info = stmt.run({
        customer_name,
        customer_email,
        address,
        total,
        items: JSON.stringify(items)
      });
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      console.error("Order error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", (req, res) => {
    try {
      const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
      const parsedOrders = orders.map((order: any) => ({
        ...order,
        items: JSON.parse(order.items)
      }));
      res.json(parsedOrders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Register
  app.post("/api/register", (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      // Check if user exists
      const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
      if (existing) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
      const info = stmt.run(username, password);
      
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // Add product
  app.post("/api/products", upload.single('image'), (req: any, res) => {
    try {
      const { name, category, price, rating, description, specs, imageUrl } = req.body;
      
      let finalImageUrl = imageUrl;
      if (req.file) {
        finalImageUrl = `/uploads/${req.file.filename}`;
      }

      const stmt = db.prepare(`
        INSERT INTO products (name, category, price, rating, image, description, specs)
        VALUES (@name, @category, @price, @rating, @image, @description, @specs)
      `);

      const info = stmt.run({
        name,
        category,
        price: parseFloat(price),
        rating: parseFloat(rating || '5.0'),
        image: finalImageUrl,
        description,
        specs: specs // Expecting JSON string from frontend
      });

      res.json({ id: info.lastInsertRowid, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add product" });
    }
  });

  // Delete product
  app.delete("/api/products/:id", (req, res) => {
    try {
      const info = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
      if (info.changes > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Catch-all for API routes not found
  app.all("/api/*", (req, res) => {
    console.log(`API 404: ${req.method} ${req.url}`);
    res.status(404).json({ error: "API route not found" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving would go here
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'store.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category TEXT,
    price REAL,
    rating REAL,
    image TEXT,
    description TEXT,
    specs TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    customer_email TEXT,
    address TEXT,
    total REAL,
    status TEXT DEFAULT 'pending',
    items TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Check if role column exists, if not add it (migration for existing db)
try {
  db.prepare('SELECT role FROM users LIMIT 1').get();
} catch (error) {
  db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
}

// Seed initial data if empty
const productCount = db.prepare('SELECT count(*) as count FROM products').get() as { count: number };

if (productCount.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (name, category, price, rating, image, description, specs)
    VALUES (@name, @category, @price, @rating, @image, @description, @specs)
  `);

  const initialProducts = [
    {
      name: 'آيفون 15 برو ماكس',
      category: 'هواتف ذكية',
      price: 1199,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
      description: 'الآيفون الأقوى بتصميم من التيتانيوم، شريحة A17 Pro، وأقوى نظام كاميرا حتى الآن.',
      specs: JSON.stringify({
        'الشاشة': '6.7" Super Retina XDR',
        'المعالج': 'شريحة A17 Pro',
        'الكاميرا': '48MP رئيسية | واسعة جداً | تيليفوتو',
        'البطارية': 'تصل إلى 29 ساعة تشغيل فيديو'
      })
    },
    {
      name: 'سامسونج جالكسي S24 ألترا',
      category: 'هواتف ذكية',
      price: 1299,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1706606991536-e32260d85869?auto=format&fit=crop&q=80&w=800',
      description: 'جالكسي AI هنا. مرحبًا بك في عصر الذكاء الاصطناعي للهواتف. مع أقوى معالج وكاميرا.',
      specs: JSON.stringify({
        'الشاشة': '6.8" QHD+ AMOLED',
        'المعالج': 'Snapdragon 8 Gen 3',
        'الكاميرا': '200MP رئيسية',
        'قلم S Pen': 'مرفق'
      })
    },
    {
      name: 'ماك بوك برو 16 إنش',
      category: 'لابتوبات',
      price: 2499,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800',
      description: 'مذهل. ملفت للنظر. أقوى ماك بوك برو على الإطلاق.',
      specs: JSON.stringify({
        'الشريحة': 'M3 Max',
        'الذاكرة': 'تصل إلى 128GB',
        'الشاشة': 'Liquid Retina XDR',
        'البطارية': 'تصل إلى 22 ساعة'
      })
    },
    {
      name: 'سوني WH-1000XM5',
      category: 'صوتيات',
      price: 349,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800',
      description: 'إلغاء ضوضاء رائد في الصناعة، جودة صوت استثنائية، ومكالمات واضحة تمامًا.',
      specs: JSON.stringify({
        'البطارية': '30 ساعة',
        'إلغاء الضوضاء': 'نعم',
        'الاتصال': 'بلوتوث 5.2',
        'الوزن': '250 جرام'
      })
    },
    {
      name: 'آيباد برو 12.9 إنش',
      category: 'أجهزة لوحية',
      price: 1099,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1544547976-de2b31989638?auto=format&fit=crop&q=80&w=800',
      description: 'تجربة الآيباد القصوى مع شريحة M2 الثورية.',
      specs: JSON.stringify({
        'الشاشة': 'Liquid Retina XDR',
        'الشريحة': 'M2',
        'الكاميرا': 'نظام كاميرا Pro',
        'الاتصال': '5G'
      })
    },
    {
      name: 'ساعة آبل ألترا 2',
      category: 'أجهزة قابلة للارتداء',
      price: 799,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?auto=format&fit=crop&q=80&w=800',
      description: 'ساعة آبل الأكثر صلابة وقدرة. مصممة للمغامرات الخارجية والتدريب على التحمل.',
      specs: JSON.stringify({
        'الهيكل': '49mm تيتانيوم',
        'مقاومة الماء': '100 متر',
        'البطارية': 'تصل إلى 36 ساعة',
        'الشاشة': 'Retina تعمل دائمًا'
      })
    }
  ];

  initialProducts.forEach(product => insertProduct.run(product));
  console.log('Database seeded with initial products');
}

// Seed admin user if not exists
const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('//');
if (!adminUser) {
  db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('//', '++', 'super_admin');
  console.log('Super Admin user created');
} else {
  // Ensure // is super_admin
  db.prepare("UPDATE users SET role = 'super_admin' WHERE username = '//'").run();
}

export default db;

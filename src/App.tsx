import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000);

  // Check if we are on dashboard or login pages to hide navbar/sidebar
  const isAdminRoute = window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/login');

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={
            <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
              <Navbar 
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                onSearch={setSearchQuery}
              />
              
              <Sidebar 
                isOpen={isSidebarOpen} 
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onClose={() => setIsSidebarOpen(false)}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
              />

              <CartSidebar />

              <main className={`pt-20 transition-all duration-300 ${isSidebarOpen ? 'lg:pr-64' : ''}`}>
                <div className="lg:hidden"></div>
                
                <Routes>
                  <Route path="/" element={<Home category={selectedCategory} searchQuery={searchQuery} maxPrice={maxPrice} />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                </Routes>

                <footer className="border-t border-white/10 mt-20 py-12 bg-[#050505]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <span className="font-bold text-white">ت</span>
                          </div>
                          <span className="text-xl font-bold text-white">تيك نوفا</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          إلكترونيات فاخرة لنمط الحياة الحديث. جودة، أداء، وأناقة.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-bold mb-4">التسوق</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li><a href="#" className="hover:text-purple-400 transition-colors">كل المنتجات</a></li>
                          <li><a href="#" className="hover:text-purple-400 transition-colors">وصل حديثاً</a></li>
                          <li><a href="#" className="hover:text-purple-400 transition-colors">المميزة</a></li>
                          <li><a href="#" className="hover:text-purple-400 transition-colors">العروض</a></li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-white font-bold mb-4">الدعم</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li><a href="#" className="hover:text-purple-400 transition-colors">اتصل بنا</a></li>
                          <li><a href="#" className="hover:text-purple-400 transition-colors">الأسئلة الشائعة</a></li>
                          <li><a href="#" className="hover:text-purple-400 transition-colors">الشحن والاسترجاع</a></li>
                          <li><a href="#" className="hover:text-purple-400 transition-colors">الضمان</a></li>
                          <li><a href="/login" className="hover:text-purple-400 transition-colors">تسجيل الدخول</a></li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-white font-bold mb-4">النشرة البريدية</h3>
                        <p className="text-gray-400 text-sm mb-4">اشترك للحصول على آخر الأخبار والعروض.</p>
                        <div className="flex gap-2">
                          <input 
                            type="email" 
                            placeholder="أدخل بريدك الإلكتروني" 
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 w-full"
                          />
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap">
                            اشترك
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-white/5 mt-12 pt-8 text-center text-gray-500 text-sm">
                      &copy; 2024 متجر تيك نوفا. جميع الحقوق محفوظة.
                    </div>
                  </div>
                </footer>
              </main>
            </div>
          } />
        </Routes>
      </Router>
    </CartProvider>
  );
}

import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
  onSearch: (query: string) => void;
}

export default function Navbar({ toggleSidebar, onSearch }: NavbarProps) {
  const { items, setIsOpen } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    };
    
    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    
    // Custom event listener for immediate updates
    window.addEventListener('auth-change', checkAdmin);

    return () => {
      window.removeEventListener('storage', checkAdmin);
      window.removeEventListener('auth-change', checkAdmin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    // Dispatch event to update UI
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu & Logo */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <span className="font-bold text-white">ت</span>
              </div>
              <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block">
                تيك نوفا
              </span>
            </Link>
          </div>

          {/* Center: Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="ابحث عن المنتجات..."
                onChange={(e) => onSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm transition-all text-right"
              />
            </div>
          </div>

          {/* Right: Cart & Profile & Mobile Search Toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors md:hidden"
            >
              <Search className="w-6 h-6 text-gray-300" />
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/dashboard"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-purple-400"
                  title="لوحة التحكم"
                >
                  <LayoutDashboard className="w-6 h-6" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-red-400"
                  title="تسجيل خروج"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                title="تسجيل الدخول"
              >
                <User className="w-6 h-6" />
              </Link>
            )}

            <button 
              onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors group"
            >
              <ShoppingBag className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-purple-600 rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/5 bg-[#0a0a0a]"
          >
            <div className="p-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  autoFocus
                  placeholder="ابحث عن المنتجات..."
                  onChange={(e) => onSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm transition-all text-right"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const location = useLocation();
  const { getItemsCount, openCart } = useCartStore();
  const itemsCount = getItemsCount();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      className="bg-white shadow-lg sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-yellow-400 text-black font-bold text-xl px-3 py-1 rounded">
              TL
            </div>
            <span className="font-bold text-xl text-gray-900">TrustyLads</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-yellow-500' : 'text-gray-700 hover:text-yellow-500'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className={`font-medium transition-colors ${
                isActive('/shop') ? 'text-yellow-500' : 'text-gray-700 hover:text-yellow-500'
              }`}
            >
              Shop
            </Link>
            <Link 
              to="/track" 
              className={`font-medium transition-colors ${
                isActive('/track') ? 'text-yellow-500' : 'text-gray-700 hover:text-yellow-500'
              }`}
            >
              Track Order
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-yellow-500 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            
            <button 
              onClick={openCart}
              className="relative text-gray-700 hover:text-yellow-500 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemsCount > 0 && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {itemsCount}
                </motion.span>
              )}
            </button>

            <Link 
              to="/admin" 
              className="text-gray-700 hover:text-yellow-500 transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>

            <button className="md:hidden text-gray-700">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
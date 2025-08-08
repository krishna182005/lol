import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-yellow-400 text-black font-bold text-xl px-3 py-1 rounded">
                TL
              </div>
              <span className="font-bold text-xl">TrustyLads</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Streetwear that screams YOU. Premium collection for the bold and confident.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://wa.me/919876543210" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="mailto:support@trustylads.com" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="text-gray-300 hover:text-yellow-400 transition-colors">Shop All</Link></li>
              <li><Link to="/shop?category=shirts" className="text-gray-300 hover:text-yellow-400 transition-colors">Shirts</Link></li>
              <li><Link to="/shop?category=watches" className="text-gray-300 hover:text-yellow-400 transition-colors">Watches</Link></li>
              <li><Link to="/shop?category=jewelry" className="text-gray-300 hover:text-yellow-400 transition-colors">Jewelry</Link></li>
              <li><Link to="/track" className="text-gray-300 hover:text-yellow-400 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Size Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Returns & Exchange</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">FAQ</a></li>
              <li><a href="https://wa.me/919876543210" className="text-gray-300 hover:text-yellow-400 transition-colors">WhatsApp Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 text-yellow-400" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-yellow-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-yellow-400" />
                <span>support@trustylads.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 TrustyLads. All rights reserved. Made with ❤️ in India.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
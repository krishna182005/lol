import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Headphones, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const categories = [
    {
      name: 'Shirts',
      slug: 'shirts',
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
      description: 'Premium streetwear shirts'
    },
    {
      name: 'Watches',
      slug: 'watches',
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
      description: 'Style that speaks time'
    },
    {
      name: 'Jewelry',
      slug: 'jewelry',
      image: 'https://images.pexels.com/photos/1213691/pexels-photo-1213691.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
      description: 'Bold accessories for bold souls'
    }
  ];

  const trustFeatures = [
    { icon: Truck, title: 'Free Shipping Over ₹999', description: 'Fast delivery across India' },
    { icon: Shield, title: '7-Day Returns', description: 'Hassle-free exchange policy' },
    { icon: Package, title: 'COD Available', description: 'Pay when you receive' },
    { icon: Headphones, title: 'WhatsApp Support', description: '24/7 customer care' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen bg-gradient-to-r from-black to-gray-800 flex items-center justify-center text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1)'
          }}
        ></div>
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            STREETWEAR THAT
            <span className="block text-yellow-400">SCREAMS YOU</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Premium collection for the bold and confident. Made in India, for India.
          </p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center bg-yellow-400 text-black font-bold text-lg px-8 py-4 rounded-full hover:bg-yellow-500 transition-colors group"
            >
              Shop the Vibe
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Find your style, express your vibe</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <Link to={`/shop?category=${category.slug}`}>
                  <div className="relative h-96 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-end">
                      <div className="p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                        <p className="text-gray-200">{category.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Order Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Track Your Order</h2>
            <p className="text-xl text-gray-300 mb-8">
              Enter your order ID to get real-time updates on your delivery
            </p>
            <Link
              to="/track"
              className="inline-flex items-center bg-yellow-400 text-black font-bold text-lg px-8 py-4 rounded-full hover:bg-yellow-500 transition-colors group"
            >
              Track Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">The TrustyLads Story</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Born from the streets of India, TrustyLads represents the fearless spirit of Gen Z. 
              We don't just make clothes—we create statements. Each piece is handpicked and designed 
              for those who dare to be different, who trust their instincts, and who wear their 
              confidence on their sleeve.
            </p>
            <div className="flex items-center justify-center space-x-8 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 fill-current" />
              ))}
            </div>
            <p className="text-lg text-gray-700 mt-4 font-medium">
              "Handpicked by TrustyLads" - Your trust, our promise.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
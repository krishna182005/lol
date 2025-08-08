import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const availableSize = product.sizes.find(size => size.stock > 0);
    
    if (!availableSize) {
      toast.error('Product is out of stock');
      return;
    }

    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
    
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      size: availableSize.size,
      quantity: 1,
      image: primaryImage?.url || '',
      category: product.category,
      maxStock: availableSize.stock
    });

    toast.success('Added to cart!');
  };

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <motion.div
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={primaryImage?.url || '/api/placeholder/300/400'}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercentage}%
            </div>
          )}
          
          {product.totalStock < 5 && product.totalStock > 0 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
              Only {product.totalStock} left!
            </div>
          )}
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center text-yellow-400">
              <Star className="h-3 w-3 fill-current" />
              <span className="ml-1 text-xs text-gray-600">
                {product.rating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice!.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 capitalize">{product.category}</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={product.totalStock === 0}
              className="flex-1 bg-yellow-400 text-black font-medium py-2 px-4 rounded hover:bg-yellow-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            >
              {product.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <Link
              to={`/product/${product._id}`}
              className="flex-1 bg-black text-white font-medium py-2 px-4 rounded hover:bg-gray-800 transition-colors text-sm text-center"
            >
              Order Now
            </Link>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
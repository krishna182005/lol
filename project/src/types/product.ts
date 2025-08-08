/**
 * Product-related TypeScript interfaces for TrustyLads e-commerce
 */

export interface ProductSize {
  size: string;
  stock: number;
  price?: number; // Optional: if different sizes have different prices
}

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
  order?: number; // For sorting images
}

export interface ProductSpecification {
  key: string;
  value: string;
  order?: number; // For sorting specifications
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number; // Price difference from base price
  images?: ProductImage[];
  stock?: number;
}

export interface ProductReview {
  _id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  verified: boolean; // Verified purchase
  helpful: number; // Number of helpful votes
  createdAt: string;
  updatedAt: string;
}

export interface ProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  slug: string;
}

export type ProductCategory = 'shirts' | 'watches' | 'jewelry';
export type ProductStatus = 'active' | 'inactive' | 'draft' | 'archived';

export interface Product {
  _id: string;
  productId: string; // Unique product identifier (e.g., TL_SHIRT_001)
  
  // Basic Information
  name: string;
  description: string;
  shortDescription?: string;
  
  // Pricing
  price: number;
  originalPrice?: number;
  costPrice?: number; // For profit calculation
  
  // Categorization
  category: ProductCategory;
  subcategory?: string;
  brand?: string;
  collection?: string;
  
  // Inventory
  sizes: ProductSize[];
  totalStock: number;
  lowStockThreshold?: number;
  trackInventory: boolean;
  
  // Media
  images: ProductImage[];
  videos?: string[];
  
  // Product Details
  specifications: ProductSpecification[];
  variants?: ProductVariant[];
  
  // Status & Visibility
  isActive: boolean;
  status: ProductStatus;
  featured: boolean;
  
  // SEO & Marketing
  seo?: ProductSEO;
  tags: string[];
  
  // Analytics
  rating: number;
  reviewCount: number;
  salesCount: number;
  viewCount: number;
  wishlistCount: number;
  
  // Shipping
  weight?: number; // in grams
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shippingClass?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ProductFilters {
  category?: ProductCategory;
  subcategory?: string;
  brand?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  inStock?: boolean;
  featured?: boolean;
  onSale?: boolean;
  rating?: number; // Minimum rating
  tags?: string[];
  search?: string;
  sortBy?: ProductSortOption;
  page?: number;
  limit?: number;
}

export type ProductSortOption = 
  | 'newest' 
  | 'oldest'
  | 'price-asc' 
  | 'price-desc' 
  | 'name-asc' 
  | 'name-desc'
  | 'rating' 
  | 'popular' 
  | 'featured';

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  filters: {
    categories: { name: string; count: number }[];
    brands: { name: string; count: number }[];
    priceRange: { min: number; max: number };
    sizes: { name: string; count: number }[];
  };
}

export interface CreateProductRequest {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  subcategory?: string;
  brand?: string;
  sizes: Omit<ProductSize, 'stock'>[];
  images: Omit<ProductImage, 'url'>[];
  specifications: ProductSpecification[];
  tags: string[];
  featured?: boolean;
  seo?: ProductSEO;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  isActive?: boolean;
  status?: ProductStatus;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  featuredProducts: number;
  totalValue: number; // Total inventory value
  averagePrice: number;
  topSellingProducts: Product[];
  recentProducts: Product[];
}

// Inventory Management
export interface StockUpdate {
  productId: string;
  size: string;
  quantity: number;
  type: 'add' | 'subtract' | 'set';
  reason: string;
  reference?: string; // Order ID, return ID, etc.
}

export interface StockHistory {
  _id: string;
  productId: string;
  size: string;
  previousStock: number;
  newStock: number;
  change: number;
  type: 'add' | 'subtract' | 'set';
  reason: string;
  reference?: string;
  createdAt: string;
  createdBy?: string;
}

// Product Analytics
export interface ProductAnalytics {
  productId: string;
  views: number;
  uniqueViews: number;
  addToCart: number;
  purchases: number;
  conversionRate: number;
  revenue: number;
  averageRating: number;
  reviewCount: number;
  returnRate: number;
  period: 'day' | 'week' | 'month' | 'year';
  date: string;
}

// Wishlist
export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Wishlist {
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

// Product Recommendations
export interface ProductRecommendation {
  productId: string;
  score: number;
  reason: 'similar' | 'frequently_bought_together' | 'trending' | 'personalized';
}

// Bulk Operations
export interface BulkProductOperation {
  action: 'activate' | 'deactivate' | 'delete' | 'update_price' | 'update_stock';
  productIds: string[];
  data?: any; // Additional data for the operation
}

export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: { productId: string; error: string }[];
}

// Import/Export
export interface ProductImportRow {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  sizes: string; // JSON string or comma-separated
  images: string; // Comma-separated URLs
  tags: string; // Comma-separated
  specifications: string; // JSON string
}

export interface ProductExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  fields: string[];
  filters?: ProductFilters;
}

// Product Comparison
export interface ProductComparison {
  products: Product[];
  comparisonFields: string[];
}

// Related Products
export interface RelatedProductsConfig {
  type: 'category' | 'tags' | 'price_range' | 'frequently_bought_together';
  limit: number;
  excludeOutOfStock?: boolean;
}

export default Product;
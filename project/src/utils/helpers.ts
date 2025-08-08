/**
 * General helper functions for TrustyLads e-commerce application
 */

/**
 * Format price in Indian Rupees
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format price without currency symbol
 */
export const formatPriceNumber = (price: number): string => {
  return new Intl.NumberFormat('en-IN').format(price);
};

/**
 * Validate Indian phone number
 */
export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid Indian mobile number
  // Should be 10 digits starting with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  
  return indianMobileRegex.test(cleanPhone);
};

/**
 * Format phone number for display
 */
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
  }
  
  return phone;
};

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Indian PIN code
 */
export const validatePinCode = (pinCode: string): boolean => {
  const pinCodeRegex = /^[1-9][0-9]{5}$/;
  return pinCodeRegex.test(pinCode);
};

/**
 * Format date in Indian format
 */
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  };
  
  return new Intl.DateTimeFormat('en-IN', { ...defaultOptions, ...options }).format(dateObj);
};

/**
 * Format date and time
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
};

/**
 * Generate random string
 */
export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate order ID
 */
export const generateOrderId = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TL${timestamp}${random}`;
};

/**
 * Slugify string for URLs
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitalize each word
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Remove HTML tags from string
 */
export const stripHtml = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: any): boolean => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate color from string (for avatars, etc.)
 */
export const generateColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Check if device is mobile
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

/**
 * Download file from URL
 */
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Scroll to element smoothly
 */
export const scrollToElement = (elementId: string, offset: number = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Get query parameters from URL
 */
export const getQueryParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

/**
 * Set query parameter in URL
 */
export const setQueryParam = (key: string, value: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState({}, '', url.toString());
};

/**
 * Remove query parameter from URL
 */
export const removeQueryParam = (key: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete(key);
  window.history.replaceState({}, '', url.toString());
};

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (originalPrice: number, salePrice: number): number => {
  if (originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * Calculate tax amount
 */
export const calculateTax = (amount: number, taxRate: number = 0.18): number => {
  return Math.round(amount * taxRate);
};

/**
 * Calculate shipping cost
 */
export const calculateShipping = (subtotal: number, freeShippingThreshold: number = 999): number => {
  return subtotal >= freeShippingThreshold ? 0 : 99;
};

/**
 * Validate form data
 */
export const validateForm = (data: Record<string, any>, rules: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  for (const field in rules) {
    const value = data[field];
    const rule = rules[field];
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field} is required`;
      continue;
    }
    
    if (value && rule.minLength && value.toString().length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
      continue;
    }
    
    if (value && rule.maxLength && value.toString().length > rule.maxLength) {
      errors[field] = `${field} must be no more than ${rule.maxLength} characters`;
      continue;
    }
    
    if (value && rule.pattern && !rule.pattern.test(value.toString())) {
      errors[field] = rule.message || `${field} format is invalid`;
      continue;
    }
    
    if (value && rule.email && !validateEmail(value.toString())) {
      errors[field] = `${field} must be a valid email address`;
      continue;
    }
    
    if (value && rule.phone && !validatePhone(value.toString())) {
      errors[field] = `${field} must be a valid phone number`;
      continue;
    }
  }
  
  return errors;
};

/**
 * Local storage helpers with error handling
 */
export const storage = {
  get: (key: string, defaultValue: any = null): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

export default {
  formatPrice,
  formatPriceNumber,
  validatePhone,
  formatPhone,
  validateEmail,
  validatePinCode,
  formatDate,
  formatDateTime,
  getRelativeTime,
  generateRandomString,
  generateOrderId,
  slugify,
  capitalize,
  capitalizeWords,
  truncateText,
  stripHtml,
  debounce,
  throttle,
  deepClone,
  isEmpty,
  getFileExtension,
  formatFileSize,
  generateColorFromString,
  getInitials,
  isMobile,
  copyToClipboard,
  downloadFile,
  scrollToElement,
  getQueryParams,
  setQueryParam,
  removeQueryParam,
  calculateDiscountPercentage,
  calculateTax,
  calculateShipping,
  validateForm,
  storage,
};
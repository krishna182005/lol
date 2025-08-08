/**
 * User and Admin-related TypeScript interfaces for TrustyLads e-commerce
 */

export type UserRole = 'admin' | 'manager' | 'staff' | 'customer';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  
  // Profile Information
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  
  // Preferences
  preferences: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
    language: string;
    currency: string;
    theme: 'light' | 'dark' | 'system';
  };
  
  // Authentication
  lastLogin?: string;
  loginCount: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface Admin extends User {
  role: 'admin' | 'manager' | 'staff';
  
  // Admin-specific fields
  permissions: AdminPermission[];
  department?: string;
  employeeId?: string;
  
  // Activity tracking
  lastActivity?: string;
  activityLog: AdminActivity[];
}

export interface AdminPermission {
  resource: string; // e.g., 'orders', 'products', 'users'
  actions: string[]; // e.g., ['read', 'write', 'delete']
}

export interface AdminActivity {
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface Customer extends User {
  role: 'customer';
  
  // Customer-specific fields
  addresses: CustomerAddress[];
  defaultAddressId?: string;
  
  // Shopping behavior
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  
  // Loyalty
  loyaltyPoints: number;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  memberSince: string;
  
  // Marketing
  acquisitionSource?: string;
  referralCode?: string;
  referredBy?: string;
}

export interface CustomerAddress {
  _id: string;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Authentication interfaces
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptTerms: boolean;
  newsletter?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Profile management
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
}

export interface UpdatePreferencesRequest {
  newsletter?: boolean;
  smsNotifications?: boolean;
  emailNotifications?: boolean;
  language?: string;
  currency?: string;
  theme?: 'light' | 'dark' | 'system';
}

// Admin management
export interface CreateAdminRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: AdminPermission[];
  department?: string;
  employeeId?: string;
}

export interface UpdateAdminRequest {
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'manager' | 'staff';
  permissions?: AdminPermission[];
  department?: string;
  status?: UserStatus;
}

// User filters and search
export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string; // Search by name, email, or phone
  dateFrom?: string;
  dateTo?: string;
  membershipTier?: string;
  hasOrders?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'lastLogin' | 'totalSpent' | 'totalOrders';
  sortOrder?: 'asc' | 'desc';
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// User statistics
export interface UserStats {
  totalUsers: number;
  totalCustomers: number;
  totalAdmins: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  userGrowthRate: number;
  averageOrderValue: number;
  topCustomers: Customer[];
  usersByTier: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
  };
}

// Session management
export interface UserSession {
  _id: string;
  userId: string;
  token: string;
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  lastUsedAt: string;
}

// Two-factor authentication
export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  token: string;
  backupCode?: string;
}

// Account verification
export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationConfirm {
  token: string;
}

export interface PhoneVerificationRequest {
  phone: string;
}

export interface PhoneVerificationConfirm {
  phone: string;
  otp: string;
}

// Social authentication
export interface SocialAuthProvider {
  provider: 'google' | 'facebook' | 'apple';
  providerId: string;
  email: string;
  name: string;
  avatar?: string;
}

// User activity tracking
export interface UserActivity {
  _id: string;
  userId: string;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

// Notification preferences
export interface NotificationPreferences {
  email: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
    security: boolean;
  };
  sms: {
    orderUpdates: boolean;
    promotions: boolean;
    security: boolean;
  };
  push: {
    orderUpdates: boolean;
    promotions: boolean;
    newProducts: boolean;
  };
}

// User export/import
export interface UserExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  fields: string[];
  filters?: UserFilters;
}

export interface UserImportRow {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  status?: string;
}

export default User;
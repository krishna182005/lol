import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { apiClient } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: any[];
  topProducts: any[];
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['admin-stats'],
    queryFn: () => apiClient.get('/api/admin/stats'),
    enabled: isAuthenticated,
  });

  // Fetch orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders', searchTerm, filterStatus],
    queryFn: () => apiClient.get(`/api/admin/orders?search=${searchTerm}&status=${filterStatus}`),
    enabled: isAuthenticated && activeTab === 'orders',
  });

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products', searchTerm],
    queryFn: () => apiClient.get(`/api/admin/products?search=${searchTerm}`),
    enabled: isAuthenticated && activeTab === 'products',
  });

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await apiClient.put(`/api/admin/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      // Refetch orders
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.delete(`/api/admin/products/${productId}`);
        toast.success('Product deleted successfully');
        // Refetch products
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400 text-black font-bold text-xl px-3 py-1 rounded">
                TL
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {statsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Package className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Customers</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalCustomers || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Orders */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                      {stats?.recentOrders?.slice(0, 5).map((order: any) => (
                        <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div>
                            <p className="font-medium">{order.orderId}</p>
                            <p className="text-sm text-gray-600">{order.customer.name || order.customer.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{order.total.toLocaleString()}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Products</h3>
                    <div className="space-y-4">
                      {stats?.topProducts?.slice(0, 5).map((product: any) => (
                        <div key={product._id} className="flex items-center space-x-3">
                          <img
                            src={product.images[0]?.url || '/api/placeholder/40/50'}
                            alt={product.name}
                            className="w-10 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-gray-600">{product.salesCount} sold</p>
                          </div>
                          <p className="font-semibold">₹{product.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button className="flex items-center space-x-2 bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {ordersLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders?.map((order: any) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.orderId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{order.customer.name || 'N/A'}</p>
                              <p className="text-sm text-gray-500">{order.customer.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{order.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className={`text-xs px-2 py-1 rounded-full border-0 ${
                                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Product Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>
                <button className="flex items-center space-x-2 bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product: any) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img
                      src={product.images[0]?.url || '/api/placeholder/300/400'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 capitalize">{product.category}</p>
                      <p className="font-bold text-gray-900 mb-3">₹{product.price.toLocaleString()}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.totalStock > 10 ? 'bg-green-100 text-green-800' :
                          product.totalStock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.totalStock} in stock
                        </span>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Management</h3>
            <p className="text-gray-600">Customer management features coming soon!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
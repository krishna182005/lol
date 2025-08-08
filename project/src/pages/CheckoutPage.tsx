import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, Building2, Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { CheckoutData } from '../types';
import { initiateRazorpayPayment } from '../utils/razorpay';
import { apiClient } from '../utils/api';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customer: { email: '', phone: '', name: '' },
    shipping: {
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      pinCode: '',
      country: 'India'
    },
    paymentMethod: 'razorpay'
  });

  const subtotal = getSubtotal();
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const steps = [
    { number: 1, title: 'Contact', completed: currentStep > 1 },
    { number: 2, title: 'Shipping', completed: currentStep > 2 },
    { number: 3, title: 'Payment', completed: currentStep > 3 },
    { number: 4, title: 'Review', completed: false }
  ];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(checkoutData.customer.email && checkoutData.customer.phone);
      case 2:
        return !!(checkoutData.shipping.firstName && checkoutData.shipping.address && 
                 checkoutData.shipping.city && checkoutData.shipping.state && checkoutData.shipping.pinCode);
      case 3:
        return !!checkoutData.paymentMethod;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/cart');
    }
  };

  const handlePinCodeChange = async (pinCode: string) => {
    setCheckoutData(prev => ({
      ...prev,
      shipping: { ...prev.shipping, pinCode }
    }));

    if (pinCode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
        const data = await response.json();
        
        if (data[0]?.Status === 'Success') {
          const { District, State } = data[0].PostOffice[0];
          setCheckoutData(prev => ({
            ...prev,
            shipping: { 
              ...prev.shipping, 
              city: District,
              state: State
            }
          }));
        }
      } catch (error) {
        console.error('Failed to fetch pincode data:', error);
      }
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      const orderData = {
        customer: checkoutData.customer,
        shipping: checkoutData.shipping,
        items,
        paymentMethod: checkoutData.paymentMethod,
        subtotal,
        shippingCost: shipping,
        tax,
        total
      };

      if (checkoutData.paymentMethod === 'razorpay') {
        // Create Razorpay order
        const response = await apiClient.post<any>('/api/payments/razorpay/create', {
          amount: total,
          orderId: `TL${Date.now()}`,
          customer: checkoutData.customer
        });

        await initiateRazorpayPayment(
          response.order,
          checkoutData,
          async (razorpayResponse) => {
            // Verify payment
            const verifyResponse = await apiClient.post('/api/payments/razorpay/verify', {
              ...razorpayResponse,
              orderId: response.order.receipt
            });

            if (verifyResponse) {
              clearCart();
              navigate(`/order-success/${response.order.receipt}`);
            }
          },
          (error) => {
            toast.error(`Payment failed: ${error.description || error.message}`);
            setLoading(false);
          }
        );
      } else {
        // COD Order
        const response = await apiClient.post<{ orderId: string }>('/api/orders', orderData);
        clearCart();
        navigate(`/order-success/${response.orderId}`);
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order placement error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={handleBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? 'Back to Cart' : 'Previous Step'}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      step.completed ? 'bg-green-500 border-green-500 text-white' :
                      currentStep === step.number ? 'bg-yellow-400 border-yellow-400 text-black' :
                      'bg-white border-gray-300 text-gray-500'
                    }`}>
                      {step.completed ? <Check className="h-4 w-4" /> : step.number}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      step.completed || currentStep === step.number ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`hidden md:block w-16 h-px mx-4 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Step Content */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {currentStep === 1 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={checkoutData.customer.email}
                        onChange={(e) => setCheckoutData(prev => ({
                          ...prev,
                          customer: { ...prev.customer, email: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={checkoutData.customer.phone}
                        onChange={(e) => setCheckoutData(prev => ({
                          ...prev,
                          customer: { ...prev.customer, phone: e.target.value }
                        }))}
                        pattern="[6-9]\d{9}"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        placeholder="9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={checkoutData.customer.name}
                        onChange={(e) => setCheckoutData(prev => ({
                          ...prev,
                          customer: { ...prev.customer, name: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutData.shipping.firstName}
                        onChange={(e) => setCheckoutData(prev => ({
                          ...prev,
                          shipping: { ...prev.shipping, firstName: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={checkoutData.shipping.lastName}
                        onChange={(e) => setCheckoutData(prev => ({
                          ...prev,
                          shipping: { ...prev.shipping, lastName: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutData.shipping.address}
                        onChange={(e) => setCheckoutData(prev => ({
                          ...prev,
                          shipping: { ...prev.shipping, address: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        placeholder="House number and street name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment, suite, etc.
                      </label>
                      <input
                        type="text"
                        value={checkoutData.shipping.apartment}
                        onChange={(e) => setCheckoutData(prev => ({
                          ...prev,
                          shipping: { ...prev.shipping, apartment: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutData.shipping.pinCode}
                        onChange={(e) => handlePinCodeChange(e.target.value)}
                        pattern="\d{6}"
                        maxLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        placeholder="400001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutData.shipping.city}
                        onChange={(e) => setCheckoutData(prev => ({
                          ...prev,
                          shipping: { ...prev.shipping, city: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutData.shipping.state}
                        onChange={(e) => setCheckoutData(prev => ({
                          ...prev,
                          shipping: { ...prev.shipping, state: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value="India"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-4">
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        checkoutData.paymentMethod === 'razorpay' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                      }`}
                      onClick={() => setCheckoutData(prev => ({ ...prev, paymentMethod: 'razorpay' }))}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="razorpay"
                          checked={checkoutData.paymentMethod === 'razorpay'}
                          onChange={() => {}}
                          className="h-4 w-4 text-yellow-400 focus:ring-yellow-400"
                        />
                        <CreditCard className="h-5 w-5 ml-3 mr-2 text-gray-600" />
                        <div>
                          <p className="font-medium">Online Payment</p>
                          <p className="text-sm text-gray-600">UPI, Cards, Net Banking via Razorpay</p>
                        </div>
                      </div>
                      {checkoutData.paymentMethod === 'razorpay' && (
                        <div className="mt-3 ml-9 flex items-center text-sm text-gray-600">
                          <Lock className="h-3 w-3 mr-1" />
                          Secured by Razorpay
                        </div>
                      )}
                    </div>

                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        checkoutData.paymentMethod === 'cod' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                      }`}
                      onClick={() => setCheckoutData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={checkoutData.paymentMethod === 'cod'}
                          onChange={() => {}}
                          className="h-4 w-4 text-yellow-400 focus:ring-yellow-400"
                        />
                        <Banknote className="h-5 w-5 ml-3 mr-2 text-gray-600" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-gray-600">Pay when you receive your order</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-2 border-gray-200 rounded-lg p-4 opacity-50">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="bank_transfer"
                          disabled
                          className="h-4 w-4 text-yellow-400 focus:ring-yellow-400"
                        />
                        <Building2 className="h-5 w-5 ml-3 mr-2 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-400">Bank Transfer</p>
                          <p className="text-sm text-gray-400">Coming soon</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h2 className="text-lg font-semibold mb-6">Review Your Order</h2>
                  
                  {/* Customer Details */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Contact Information</h3>
                    <p className="text-sm text-gray-600">{checkoutData.customer.email}</p>
                    <p className="text-sm text-gray-600">{checkoutData.customer.phone}</p>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="text-sm text-gray-600">
                      <p>{checkoutData.shipping.firstName} {checkoutData.shipping.lastName}</p>
                      <p>{checkoutData.shipping.address}</p>
                      {checkoutData.shipping.apartment && <p>{checkoutData.shipping.apartment}</p>}
                      <p>{checkoutData.shipping.city}, {checkoutData.shipping.state} - {checkoutData.shipping.pinCode}</p>
                      <p>{checkoutData.shipping.country}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {checkoutData.paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 
                       checkoutData.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                       'Bank Transfer'}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={`${item.productId}-${item.size}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.image || '/api/placeholder/50/60'}
                            alt={item.name}
                            className="w-12 h-15 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Note */}
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      📦 Your order will arrive in our signature neon yellow box!
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Estimated delivery: 5-7 business days
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                
                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </span>
                    ) : (
                      checkoutData.paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {items.slice(0, 3).map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex items-center space-x-3">
                    <img
                      src={item.image || '/api/placeholder/40/50'}
                      alt={item.name}
                      className="w-10 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-sm text-gray-500">+{items.length - 3} more items</p>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
import { CheckoutData } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (
  orderData: any,
  checkoutData: CheckoutData,
  onSuccess: (response: any) => void,
  onError: (error: any) => void
) => {
  try {
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'TrustyLads',
      description: `Order #${orderData.receipt}`,
      image: '/logo.png',
      order_id: orderData.id,
      handler: onSuccess,
      prefill: {
        name: `${checkoutData.shipping.firstName} ${checkoutData.shipping.lastName}`,
        email: checkoutData.customer.email,
        contact: checkoutData.customer.phone,
      },
      notes: {
        address: checkoutData.shipping.address,
      },
      theme: {
        color: '#FFE135',
      },
      modal: {
        ondismiss: () => {
          console.log('Payment cancelled');
        },
      },
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', (response: any) => {
      onError(response.error);
    });
    
    rzp.open();
  } catch (error) {
    onError(error);
  }
};
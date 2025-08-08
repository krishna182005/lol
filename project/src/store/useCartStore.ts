import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemsCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (newItem: CartItem) => set((state) => {
        const existingItem = state.items.find(
          item => item.productId === newItem.productId && item.size === newItem.size
        );
        
        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + newItem.quantity, newItem.maxStock);
          return {
            items: state.items.map(item =>
              item.productId === newItem.productId && item.size === newItem.size
                ? { ...item, quantity: newQuantity }
                : item
            )
          };
        } else {
          return {
            items: [...state.items, newItem]
          };
        }
      }),
      
      updateQuantity: (productId: string, size: string, quantity: number) => set((state) => ({
        items: quantity <= 0
          ? state.items.filter(item => !(item.productId === productId && item.size === size))
          : state.items.map(item =>
              item.productId === productId && item.size === size
                ? { ...item, quantity: Math.min(quantity, item.maxStock) }
                : item
            )
      })),
      
      removeItem: (productId: string, size: string) => set((state) => ({
        items: state.items.filter(item => !(item.productId === productId && item.size === size))
      })),
      
      clearCart: () => set({ items: [] }),
      
      openCart: () => set({ isOpen: true }),
      
      closeCart: () => set({ isOpen: false }),
      
      getItemsCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'trustylads-cart',
    }
  )
);
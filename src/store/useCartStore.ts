import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === (product._id || product.id));

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity <= existingItem.stock) {
            set({
              items: items.map((item) =>
                item.id === (product._id || product.id)
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            });
          }
        } else {
          set({
            items: [
              ...items,
              {
                id: product._id || product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images[0],
                quantity: quantity,
                stock: product.stock,
              },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.id === id);
        
        if (item && quantity > 0 && quantity <= item.stock) {
          set({
            items: items.map((i) => (i.id === id ? { ...i, quantity } : i)),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

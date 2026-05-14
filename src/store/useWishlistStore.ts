import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { toast } from 'sonner';

interface WishlistStore {
  wishlist: any[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      isLoading: false,
      fetchWishlist: async () => {
        set({ isLoading: true });
        try {
          const response = await axios.get('/api/wishlist');
          set({ wishlist: response.data.wishlist, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
        }
      },
      toggleWishlist: async (productId: string) => {
        try {
          const response = await axios.post('/api/wishlist', { productId });
          const { message, wishlist } = response.data;
          
          // Re-fetch or update local state
          // For simplicity, we just update with what server returns if it populates, 
          // but our POST returns IDs mostly or updated user object.
          // Let's re-fetch to get populated products if we are on wishlist page, 
          // or just update IDs.
          
          // If we want to show heart filled immediately:
          await get().fetchWishlist();
          toast.success(message);
        } catch (error: any) {
          toast.error(error.response?.data?.error || 'Failed to update wishlist');
        }
      },
      isInWishlist: (productId: string) => {
        return get().wishlist.some((item: any) => 
          (typeof item === 'string' ? item : item._id) === productId
        );
      },
      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ wishlist: state.wishlist }),
    }
  )
);

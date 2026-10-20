import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  priceMinor: number;
  currency: string;
  image: string | null;
  quantity: number;
  stockQty: number;
  maxQuantity?: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getItemCount: (productId: string) => number;
  getItemIdByProductId: (productId: string) => string | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId
          );

          if (existingIndex >= 0) {
            const updatedItems = [...state.items];
            const newQuantity = Math.min(
              updatedItems[existingIndex].quantity + newItem.quantity,
              updatedItems[existingIndex].stockQty
            );
            updatedItems[existingIndex].quantity = newQuantity;
            return { items: updatedItems };
          }

          const itemWithId: CartItem = {
            ...newItem,
            id: `${newItem.productId}-${Date.now()}`,
            maxQuantity: newItem.stockQty,
          };
          return { items: [...state.items, itemWithId] };
        });
        get().openCart();
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          const item = state.items.find((i) => i.id === itemId);
          if (!item) return state;

          const newQuantity = Math.max(1, Math.min(quantity, item.stockQty));
          return {
            items: state.items.map((i) =>
              i.id === itemId ? { ...i, quantity: newQuantity } : i
            ),
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.priceMinor * item.quantity,
          0
        );
      },

      getItemCount: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        return item?.quantity ?? 0;
      },

      getItemIdByProductId: (productId) => {
        return get().items.find((i) => i.productId === productId)?.id;
      },
    }),
    {
      name: 'loudwell-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const STORAGE_KEY = "template-cart-store";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const parsedQuantity = Math.max(1, Number(quantity) || 1);
        const existing = get().items.find(
          (item) => Number(item.product.id) === Number(product.id),
        );

        if (existing) {
          set({
            items: get().items.map((item) =>
              Number(item.product.id) === Number(product.id)
                ? { ...item, quantity: item.quantity + parsedQuantity }
                : item,
            ),
          });
          return;
        }

        set({ items: [...get().items, { product, quantity: parsedQuantity }] });
      },

      updateItemQuantity: (id, quantity) => {
        const parsedQuantity = Number(quantity) || 0;
        if (parsedQuantity <= 0) {
          set({
            items: get().items.filter(
              (item) => Number(item.product.id) !== Number(id),
            ),
          });
          return;
        }

        set({
          items: get().items.map((item) =>
            Number(item.product.id) === Number(id)
              ? { ...item, quantity: parsedQuantity }
              : item,
          ),
        });
      },

      incrementItem: (id) => {
        const item = get().items.find(
          (cartItem) => Number(cartItem.product.id) === Number(id),
        );
        if (!item) return;
        get().updateItemQuantity(id, item.quantity + 1);
      },

      decrementItem: (id) => {
        const item = get().items.find(
          (cartItem) => Number(cartItem.product.id) === Number(id),
        );
        if (!item) return;
        get().updateItemQuantity(id, item.quantity - 1);
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(
            (item) => Number(item.product.id) !== Number(id),
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + Number(item.quantity), 0),

      getTotalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + Number(item.product.price) * Number(item.quantity),
          0,
        ),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCartStore;

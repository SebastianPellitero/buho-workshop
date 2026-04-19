import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from "../cartSlice";
import type { CartItem, CartState } from "@/types";

const makeItem = (variantId: string, quantity = 1): CartItem => ({
  variantId,
  productName: "Owl Figurine",
  color: "Red",
  size: "M",
  price: 14,
  quantity,
  image: "/img.jpg",
});

const empty: CartState = { items: [] };

describe("cartSlice", () => {
  describe("addItem", () => {
    it("adds a new item to empty cart", () => {
      const state = cartReducer(empty, addItem(makeItem("v1")));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].variantId).toBe("v1");
    });

    it("merges quantity when the same variantId is added again", () => {
      let state = cartReducer(empty, addItem(makeItem("v1", 2)));
      state = cartReducer(state, addItem(makeItem("v1", 3)));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(5);
    });

    it("adds a second distinct item", () => {
      let state = cartReducer(empty, addItem(makeItem("v1")));
      state = cartReducer(state, addItem(makeItem("v2")));
      expect(state.items).toHaveLength(2);
    });
  });

  describe("removeItem", () => {
    it("removes an item by variantId", () => {
      let state = cartReducer(empty, addItem(makeItem("v1")));
      state = cartReducer(state, removeItem("v1"));
      expect(state.items).toHaveLength(0);
    });

    it("leaves other items untouched", () => {
      let state = cartReducer(empty, addItem(makeItem("v1")));
      state = cartReducer(state, addItem(makeItem("v2")));
      state = cartReducer(state, removeItem("v1"));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].variantId).toBe("v2");
    });
  });

  describe("updateQuantity", () => {
    it("updates quantity of existing item", () => {
      let state = cartReducer(empty, addItem(makeItem("v1", 1)));
      state = cartReducer(state, updateQuantity({ variantId: "v1", quantity: 4 }));
      expect(state.items[0].quantity).toBe(4);
    });

    it("removes item when quantity is set to 0", () => {
      let state = cartReducer(empty, addItem(makeItem("v1", 2)));
      state = cartReducer(state, updateQuantity({ variantId: "v1", quantity: 0 }));
      expect(state.items).toHaveLength(0);
    });

    it("removes item when quantity is negative", () => {
      let state = cartReducer(empty, addItem(makeItem("v1", 2)));
      state = cartReducer(state, updateQuantity({ variantId: "v1", quantity: -1 }));
      expect(state.items).toHaveLength(0);
    });

    it("does nothing for unknown variantId", () => {
      const state = cartReducer(empty, updateQuantity({ variantId: "ghost", quantity: 5 }));
      expect(state.items).toHaveLength(0);
    });
  });

  describe("clearCart", () => {
    it("empties the cart", () => {
      let state = cartReducer(empty, addItem(makeItem("v1")));
      state = cartReducer(state, addItem(makeItem("v2")));
      state = cartReducer(state, clearCart());
      expect(state.items).toHaveLength(0);
    });

    it("is a no-op on an already empty cart", () => {
      const state = cartReducer(empty, clearCart());
      expect(state.items).toHaveLength(0);
    });
  });
});

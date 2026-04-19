import { configureStore } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import { productsApi } from "./api/productsApi";
import { ordersApi } from "./api/ordersApi";

const STORAGE_KEY = "buho_cart";

const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  if (typeof window !== "undefined") {
    const state = store.getState() as RootState;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart.items));
  }
  return result;
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productsApi.middleware)
      .concat(ordersApi.middleware)
      .concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

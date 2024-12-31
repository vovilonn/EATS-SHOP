import { createSlice } from '@reduxjs/toolkit';
import { ICartItem } from '@/shared/interfaces/cart-item.interface';
import {
  addCart,
  deleteCartItem,
  getCart,
  editCartCount,
  checkPromocode,
} from './requests';
import {PromocodeTypeValue} from "@/shared/interfaces/promocode.interface";

interface ICartInitialState {
  cart_items: ICartItem[];
  total_cost: number;
  total_cart: number;
  discount: number;
  typePromocode: PromocodeTypeValue | null;
  promocode_id: number | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ICartInitialState = {
  cart_items: [],
  total_cost: 0,
  total_cart: 0,
  discount: 0,
  typePromocode: null,
  promocode_id: null,
  loading: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetDiscount: (state) => {
      state.discount = 0;
      state.typePromocode = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getCart.fulfilled, (state, action) => {
        state.cart_items = action.payload.cart_items;
        state.total_cost = action.payload.total_cost;
        state.total_cart = action.payload.total_cart;
        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(getCart.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch cart info';
      })

      .addCase(deleteCartItem.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.cart_items = state.cart_items.filter((item) => item.id !== id);

        state.total_cost = state.cart_items.reduce(
          (total, item) => total + item.count * item.model_options.price,
          0
        );
        state.total_cart = state.cart_items.length;
        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to delete cart item';
      })

      .addCase(addCart.fulfilled, (state, action) => {
        const newItem = action.payload;

        const existingItem = state.cart_items.find(
          (item) =>
            item.model_menu.id === newItem.cart_items[0].model_menu.id &&
            item.option_id === newItem.cart_items[0].option_id
        );

        if (existingItem) {
          existingItem.count = newItem.cart_items[0].count;
          state.total_cart = newItem.cart_items[0].count;
        } else {
          state.cart_items.push(newItem.cart_items[0]);
        }

        state.total_cost = state.cart_items.reduce(
          (total, item) => total + item.count * item.model_options.price,
          0
        );
        state.total_cart = state.cart_items.reduce(
          (total, item) => total + item.count,
          0
        );

        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(addCart.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(addCart.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to add cart item';
      })

      .addCase(editCartCount.fulfilled, (state, action) => {
        const { id, count } = action.meta.arg;

        const existingItem = state.cart_items.find((item) => item.id === id);

        if (existingItem) {
          existingItem.count = count;
        }

        state.total_cost = state.cart_items.reduce(
          (total, item) => total + item.count * item.model_options.price,
          0
        );
        state.total_cart = state.cart_items.length;
        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(editCartCount.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(editCartCount.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to edit cart count';
      })

      .addCase(checkPromocode.fulfilled, (state, action) => {
        state.discount = action.payload.value;
        state.typePromocode = action.payload.type_value;
        state.promocode_id = action.payload.id;
        state.error = null;
      })
      .addCase(checkPromocode.rejected, (state) => {
        state.error = 'Проверьте правильность кода!';
      });
  },
});

export default cartSlice;

import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '@/shared/utils/axios.utility';

import { ICartItem } from '@/shared/interfaces/cart-item.interface';

interface IIngredients {
  menu_ingredients_id: number;
  count: number;
}

interface ICartData {
  menu_id: number;
  option_id: number;
  count: number;
  ingredients: IIngredients[];
}

interface ICartResponse {
  cart_items: ICartItem[];
  total_cost: number;
  total_cart: number;
}

export const getCart = createAsyncThunk<ICartResponse>('cart/all', async () => {
  return (
    await Axios({
      method: 'get',
      url: '/menu/cart/view',
    })
  ).data;
});

export const addCart = createAsyncThunk<ICartResponse, ICartData>(
  'cart/add',
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await Axios({
        method: 'post',
        url: '/menu/cart/add',
        data: cartData,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to add to cart');
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/delete',
  async (id: number) => {
    await Axios({
      method: 'delete',
      url: '/menu/cart/delete',
      data: {
        cart_id: id,
      },
    });
  }
);

export const editCartCount = createAsyncThunk(
  'cart/edit-count',
  async ({ id, count }: { id: number; count: number }) => {
    const response = await Axios({
      method: 'post',
      url: '/menu/cart/change_count',
      data: {
        cart_id: id,
        count,
      },
    });
    return response.data;
  }
);

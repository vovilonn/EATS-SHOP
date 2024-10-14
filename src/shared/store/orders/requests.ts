import { createAsyncThunk } from '@reduxjs/toolkit';

import Axios from '@/shared/utils/axios.utility';
import {
  IOrderCreate,
  IOrderOption,
  IOrdersHistory,
} from '@/shared/interfaces/order.interface';

export const getOrderOption = createAsyncThunk<IOrderOption>(
  'orders/option',
  async () => {
    return (await Axios({ method: 'get', url: '/menu/order/option' })).data;
  }
);

export const getOrdersHistory = createAsyncThunk<IOrdersHistory[]>(
  'orders/history',
  async () => {
    return (await Axios({ method: 'get', url: '/menu/order/view' })).data;
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (order: IOrderCreate) => {
    return await Axios({
      method: 'post',
      url: '/menu/order/create',
      data: order,
    });
  }
);

export const repeatPayment = createAsyncThunk(
  'orders/repeat',
  async (id: number) => {
    return await Axios({
      method: 'post',
      url: '/menu/order/payment_repeate',
      data: {
        order_id: id,
      },
    });
  }
);

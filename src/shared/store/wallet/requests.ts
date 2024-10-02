import { createAsyncThunk } from '@reduxjs/toolkit';

import Axios from '@/shared/utils/axios.utility';

import { IWallet } from '@/shared/interfaces/wallet.interface';

export const createReplenishment = createAsyncThunk<IWallet, number>(
  'replenishment/create',
  async (amount: number) => {
    return (
      await Axios({
        method: 'post',
        url: '/balance/payment/create',
        data: {
          amount,
        },
      })
    ).data;
  }
);

export const getHistoryReplenishment = createAsyncThunk<IWallet[]>(
  'replenishment/all',
  async () => {
    return (
      await Axios({
        method: 'get',
        url: '/balance/history/view',
      })
    ).data;
  }
);

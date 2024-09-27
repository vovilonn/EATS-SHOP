import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '@/shared/utils/axios.utility';

import IAccountInfo from '@/shared/interfaces/accountInfo.interface';

export const getAccountInfo = createAsyncThunk<IAccountInfo>(
  'accountInfo/get',
  async (_) => {
    return (
      await Axios({
        method: 'get',
        url: '/account/my_info',
      })
    ).data;
  }
);

export const updateAccountInfo = createAsyncThunk<void, FormData>(
  'accountInfo/update',
  async (formData) => {
    await Axios({
      method: 'post',
      url: '/account/edit',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
);

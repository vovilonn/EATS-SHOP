import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '@/shared/utils/axios.utility';

import IBrand from '@/shared/interfaces/brand.interface';

export const getBrands = createAsyncThunk<IBrand[]>(
  'brand/all',
  async () => {
    return (await Axios({ method: 'get', url: '/menu/branded_store/view' })).data;
  }
);

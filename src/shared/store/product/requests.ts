import Axios from '@/shared/utils/axios.utility';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSearchProducts = createAsyncThunk(
  'products/search',
  async (query: string) => {
    console.log(query);

    return (
      await Axios({ method: 'get', url: `/menu/view?page=1&search=${query}` })
    ).data;
  }
);

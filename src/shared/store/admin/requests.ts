import IBrand from '@/shared/interfaces/brand.interface';
import ICity from '@/shared/interfaces/city.interface';
import IProduct from '@/shared/interfaces/product.interface';
import Axios from '@/shared/utils/axios.utility';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCities = createAsyncThunk<ICity[]>(
  'admin/cities',
  async () => {
    return (await Axios({ method: 'get', url: '/city/view' })).data;
  }
);

export const fetchBrands = createAsyncThunk<IBrand[]>(
  'admin/brands',
  async () => {
    return (await Axios({ method: 'get', url: '/menu/branded_store/view' }))
      .data;
  }
);

export const fetchProducts = createAsyncThunk<IProduct[], number>(
  'admin/products',
  async (brand_id) => {
    const response = await Axios({
      method: 'get',
      url: `/menu/view?branded_store_id=${brand_id}`,
    });
    return response.data;
  }
);

export const fetchOneProduct = createAsyncThunk<IProduct[], number>(
  'admin/oneProduct',
  async (product_id) => {
    const response = await Axios({
      method: 'get',
      url: `/menu/view?menu_id=${product_id}`,
    });
    return response.data;
  }
);

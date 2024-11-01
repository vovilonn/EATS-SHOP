import { createSlice } from '@reduxjs/toolkit';
import { loginAdmin } from './auth/requests';
import ICity from '@/shared/interfaces/city.interface';
import {
  fetchBrands,
  fetchCities,
  fetchOneProduct,
  fetchProducts,
} from './requests';
import IBrand from '@/shared/interfaces/brand.interface';
import IProduct from '@/shared/interfaces/product.interface';

export interface IInitialState {
  tokenAdmin: string | null;
  cities: ICity[];
  brands: IBrand[];
  products: IProduct[];
  oneProduct: IProduct | null;
}

const initialState: IInitialState = {
  tokenAdmin: null,
  cities: [],
  brands: [],
  products: [],
  oneProduct: null,
};

const adminSlice = createSlice({
  name: 'adminPanel',
  initialState,
  reducers: {
    setAdminLogout: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
      state.tokenAdmin = null;
    },
    setTokenAdmin: (state, action) => {
      state.tokenAdmin = action.payload;
    },
  },
  extraReducers: (build) => {
    build.addCase(loginAdmin.fulfilled, (state, response) => {
      const { token } = response.payload.data;
      localStorage.setItem('authToken', token);
      state.tokenAdmin = token;
    });
    build.addCase(fetchCities.fulfilled, (state, action) => {
      state.cities = action.payload;
    });
    build.addCase(fetchBrands.fulfilled, (state, action) => {
      state.brands = action.payload;
    });
    build.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    build.addCase(fetchOneProduct.fulfilled, (state, action) => {
      state.oneProduct = action.payload[0];
    });
  },
});

export default adminSlice;

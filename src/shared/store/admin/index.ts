import { IProviderCategory } from './../../interfaces/category.interface';
import { createSlice } from '@reduxjs/toolkit';

import { loginAdmin, loginProvider } from './auth/requests';
import {
  blockProvider,
  createGeneralCategory,
  deletePromocode,
  deleteProvider,
  fetchAllClients,
  fetchAllPromocodes,
  fetchAllProviders,
  fetchBrands,
  fetchCities,
  fetchGeneralCategories,
  fetchOneProduct,
  fetchProducts,
} from './requests';
import {
  createNewBrand,
  createNewCategory,
  createNewIngredient,
  createNewProduct,
  deleteBrand,
  deleteCategory,
  deleteIngredient,
  deleteProduct,
  editCategory,
  editIngredient,
  editProduct,
  editProviderBrand,
  fetchProviderBrands,
  fetchProviderCategories,
  fetchProviderGeneralCategories,
  fetchProviderIngredients,
  fetchProviderOrders,
  fetchProviderProducts,
} from './provider/requests';

import ICity from '@/shared/interfaces/city.interface';
import IBrand from '@/shared/interfaces/brand.interface';
import IProduct from '@/shared/interfaces/product.interface';
import { IOrdersHistory } from '@/shared/interfaces/order.interface';
import ICategory from '@/shared/interfaces/category.interface';
import IComponent from '@/shared/interfaces/component.interface';
import IProvider from '@/shared/interfaces/provider.interface';
import IAccountInfo from '@/shared/interfaces/accountInfo.interface';
import { IPromocode } from '@/shared/interfaces/promocode.interface';

export interface IInitialState {
  authToken: string | null;
  cities: ICity[];
  brands: IBrand[];
  products: IProduct[];
  categories: IProviderCategory[];
  ingredients: IComponent[];
  providers: IProvider[];
  clients: IAccountInfo[];
  generalCategories: ICategory[];
  promocodes: IPromocode[];
  oneProduct: IProduct | null;
  role: 'ADMIN' | 'PROVIDER' | null;
  orders: IOrdersHistory[];
}

const initialState: IInitialState = {
  authToken: null,
  cities: [],
  brands: [],
  products: [],
  categories: [],
  ingredients: [],
  providers: [],
  clients: [],
  generalCategories: [],
  promocodes: [],
  oneProduct: null,
  role:
    typeof window !== 'undefined'
      ? (localStorage.getItem('role') as 'ADMIN' | 'PROVIDER' | null)
      : null,
  orders: [],
};

const adminSlice = createSlice({
  name: 'adminPanel',
  initialState,
  reducers: {
    setAdminLogout: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
      }
      state.authToken = null;
      state.role = null;
    },
    setTokenAdmin: (state, action) => {
      state.authToken = action.payload;
    },
  },
  extraReducers: (build) => {
    build.addCase(loginAdmin.fulfilled, (state, response) => {
      const { token, role } = response.payload.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('role', role);
      state.authToken = token;
      state.role = role;
    });
    build.addCase(loginProvider.fulfilled, (state, response) => {
      const { token, role } = response.payload.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('role', role);
      state.authToken = token;
      state.role = role;
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

    build.addCase(fetchProviderBrands.fulfilled, (state, action) => {
      state.brands = action.payload;
    });
    build.addCase(createNewBrand.fulfilled, (state, action) => {
      state.brands.push(action.payload);
    });
    build.addCase(editProviderBrand.fulfilled, (state, action) => {
      state.brands = state.brands.map((brand) => {
        if (brand.id === action.payload.id) return action.payload;
        return brand;
      });
    });
    build.addCase(deleteBrand.fulfilled, (state, action) => {
      const id = action.meta.arg;
      state.brands = state.brands.filter((brand) => brand.id !== id);
    });

    build.addCase(fetchProviderCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    build.addCase(createNewCategory.fulfilled, (state, action) => {
      state.categories.push(action.payload);
    });
    build.addCase(deleteCategory.fulfilled, (state, action) => {
      const id = action.meta.arg;
      state.categories = state.categories.filter(
        (category) => category.id !== id
      );
    });
    build.addCase(editCategory.fulfilled, (state, action) => {
      const { category_id, name } = action.meta.arg;
      const category = state.categories.find(
        (category) => category?.id === category_id
      );

      if (category) {
        category.name = name;
      }
    });

    build.addCase(fetchProviderOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
    build.addCase(fetchProviderIngredients.fulfilled, (state, action) => {
      state.ingredients = action.payload;
    });
    build.addCase(createNewIngredient.fulfilled, (state, action) => {
      state.ingredients.push(action.payload);
    });
    build.addCase(deleteIngredient.fulfilled, (state, action) => {
      const { menu_ingredients_id } = action.meta.arg;
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== menu_ingredients_id
      );
    });
    build.addCase(editIngredient.fulfilled, (state, action) => {
      state.ingredients = state.ingredients.map((item) => {
        if (item.id === action.payload.id) return action.payload;
        return item;
      });
    });

    build.addCase(fetchAllProviders.fulfilled, (state, action) => {
      state.providers = action.payload;
    });
    build.addCase(blockProvider.fulfilled, (state, action) => {
      const { is_block, id_user } = action.meta.arg;
      const provider = state.providers.find((item) => item.id === id_user);
      if (provider) {
        provider.is_block = is_block;
      }
    });
    build.addCase(deleteProvider.fulfilled, (state, action) => {
      const providerId = action.meta.arg;
      state.providers = state.providers.filter(
        (provider) => provider.id !== providerId
      );
    });

    build.addCase(fetchAllClients.fulfilled, (state, action) => {
      state.clients = action.payload;
    });

    build.addCase(fetchProviderGeneralCategories.fulfilled, (state, action) => {
      state.generalCategories = action.payload;
    });

    build.addCase(fetchGeneralCategories.fulfilled, (state, action) => {
      state.generalCategories = action.payload;
    });

    build.addCase(fetchProviderProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    build.addCase(createNewProduct.fulfilled, (state, action) => {
      const product = state.products.find(
        (product) => product.id === action.payload.id
      );
      if (!product) {
        state.products.unshift(action.payload);
      }
    });
    build.addCase(deleteProduct.fulfilled, (state, action) => {
      const product = state.products.find(
        (item) => item.id === action.meta.arg.productId
      );
      if (product) {
        state.products = state.products.filter(
          (item) => item.id !== product.id
        );
      }
    });
    build.addCase(editProduct.fulfilled, (state, action) => {
      const productIndex = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (productIndex !== -1) {
        state.products[productIndex] = action.payload;
      }
    });

    build.addCase(fetchAllPromocodes.fulfilled, (state, action) => {
      state.promocodes = action.payload;
    });
    build.addCase(deletePromocode.fulfilled, (state, action) => {
      const id = action.meta.arg;
      state.promocodes = state.promocodes.filter((promo) => promo.id !== id);
    });
  },
});

export default adminSlice;

import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '@/shared/utils/axios.utility';

import IAccountInfo from '@/shared/interfaces/accountInfo.interface';
import IBrand from '@/shared/interfaces/brand.interface';
import ICategory from '@/shared/interfaces/category.interface';
import ICity from '@/shared/interfaces/city.interface';
import IProduct from '@/shared/interfaces/product.interface';
import {
  IPromocode,
  IPromocodeCreateOrUpd,
} from '@/shared/interfaces/promocode.interface';
import IProvider from '@/shared/interfaces/provider.interface';

export const fetchCities = createAsyncThunk<ICity[]>(
  'admin/cities',
  async () => {
    return (await Axios({ method: 'get', url: '/city/view' })).data;
  }
);

export const fetchBrands = createAsyncThunk<IBrand[]>(
  'admin/brands',
  async () => {
    return (
      await Axios({
        method: 'get',
        url: '/menu/branded_store/view',
        dontNeedToken: true,
      })
    ).data;
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

export const fetchAllProviders = createAsyncThunk<IProvider[]>(
  'admin/providers',
  async () => {
    const response = await Axios({
      method: 'get',
      url: '/admin/provider/view',
      useLocalStorage: true,
    });
    return response.data;
  }
);

export const createNewProvider = createAsyncThunk<
  void,
  { name: string; number: number }
>('provider/categories/create', async (obj) => {
  await Axios({
    method: 'post',
    url: '/admin/provider/create',
    data: obj,
    useLocalStorage: true,
  });
});

export const blockProvider = createAsyncThunk<
  void,
  { is_block: boolean; id_user: number }
>('admin/providers/block', async ({ is_block, id_user }) => {
  await Axios({
    method: 'post',
    url: '/admin/provider/block',
    data: {
      is_block,
      id_user,
    },
    useLocalStorage: true,
  });
});

export const deleteProvider = createAsyncThunk(
  'admin/providers/delete',
  async (id: number) => {
    await Axios({
      method: 'delete',
      url: '/admin/provider/delete',
      data: {
        id_provider: id,
      },
      useLocalStorage: true,
    });
  }
);

export const fetchAllClients = createAsyncThunk<IAccountInfo[]>(
  'admin/clients',
  async () => {
    const { data } = await Axios({
      method: 'get',
      url: '/admin/user/view',
      useLocalStorage: true,
    });

    return data;
  }
);

export const fetchGeneralCategories = createAsyncThunk<ICategory[]>(
  'admin/general-categories',
  async () => {
    const { data } = await Axios({
      method: 'get',
      url: '/menu/general_categories/view',
      dontNeedToken: true,
    });

    return data;
  }
);

export const fetchAllPromocodes = createAsyncThunk<IPromocode[]>(
  'admin/promocodes',
  async () => {
    const { data } = await Axios({
      method: 'get',
      url: '/admin/promo_code/view',
      useLocalStorage: true,
    });

    return data;
  }
);

export const createPromocode = createAsyncThunk<void, IPromocodeCreateOrUpd>(
  'admin/promocodes/create',
  async ({ type, count, is_active, code }) => {
    await Axios({
      method: 'post',
      url: '/admin/promo_code/create',
      data: {
        type,
        count,
        is_active,
        code,
      },
      useLocalStorage: true,
    });
  }
);

export const deletePromocode = createAsyncThunk<void, number>(
  'admin/promocodes/delete',
  async (promo_code_id) => {
    await Axios({
      method: 'delete',
      url: '/admin/promo_code/delete',
      data: {
        promo_code_id,
      },
      useLocalStorage: true,
    });
  }
);

export const editPromocode = createAsyncThunk<void, IPromocodeCreateOrUpd>(
  'admin/promocodes/edit',
  async ({ promo_code_id, count, code, is_active, type }) => {
    await Axios({
      method: 'put',
      url: '/admin/promo_code/edit',
      data: {
        promo_code_id,
        count,
        type,
        code,
        is_active,
      },
      useLocalStorage: true,
    });
  }
);

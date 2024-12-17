import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '@/shared/utils/axios.utility';

import IBrand from '@/shared/interfaces/brand.interface';
import { IOrdersHistory } from '@/shared/interfaces/order.interface';
import ICategory, {
  IProviderCategory,
} from '@/shared/interfaces/category.interface';
import IComponent from '@/shared/interfaces/component.interface';
import IProduct from '@/shared/interfaces/product.interface';

export const fetchProviderBrands = createAsyncThunk<IBrand[]>(
  'provider/brands',
  async () => {
    return (
      await Axios({
        method: 'get',
        url: '/provider/branded_store/view',
        useLocalStorage: true,
      })
    ).data;
  }
);

export const createNewBrand = createAsyncThunk<IBrand, FormData>(
  'provider/brands/create',
  async (formData) => {
    const { data } = await Axios({
      method: 'post',
      url: '/provider/branded_store/create',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      useLocalStorage: true,
    });

    return data;
  }
);

export const editProviderBrand = createAsyncThunk<IBrand, FormData>(
  'provider/brands/edit',
  async (formData) => {
    const { data } = await Axios({
      method: 'put',
      url: '/provider/branded_store/edit',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      useLocalStorage: true,
    });

    return data;
  }
);

export const deleteBrand = createAsyncThunk(
  'provider/brands/delete',
  async (id: number) => {
    await Axios({
      method: 'delete',
      url: '/provider/branded_store/delete',
      data: {
        id_store: id,
      },
      useLocalStorage: true,
    });
  }
);

export const fetchProviderCategories = createAsyncThunk<
  IProviderCategory[],
  number
>('provider/categories', async (brandId) => {
  return (
    await Axios({
      method: 'post',
      url: '/menu/branded_store_categories/view',
      data: {
        branded_store_id: brandId,
      },
      useLocalStorage: true,
    })
  ).data;
});

export const createNewCategory = createAsyncThunk<
  IProviderCategory,
  { name: string; branded_store_id: number }
>('provider/categories/create', async (obj) => {
  const { data } = await Axios({
    method: 'post',
    url: '/provider/branded_store/category',
    data: obj,
    useLocalStorage: true,
  });

  return data;
});

export const deleteCategory = createAsyncThunk(
  'provider/categories/delete',
  async (id: number) => {
    await Axios({
      method: 'delete',
      url: '/provider/branded_store/category',
      data: {
        category_id: id,
      },
      useLocalStorage: true,
    });
  }
);

export const editCategory = createAsyncThunk<
  void,
  { name: string; category_id: number }
>('provider/categories/edit', async (obj) => {
  await Axios({
    method: 'put',
    url: '/provider/branded_store/category',
    data: obj,
    useLocalStorage: true,
  });
});

export const fetchProviderOrders = createAsyncThunk<IOrdersHistory[]>(
  'provider/orders',
  async () => {
    return (
      await Axios({
        method: 'get',
        url: '/provider/branded_store/oder/view',
        useLocalStorage: true,
      })
    ).data;
  }
);

export const fetchProviderIngredients = createAsyncThunk<IComponent[], number>(
  'provider/ingredients',
  async (brandId: number) => {
    return (
      await Axios({
        method: 'post',
        url: 'provider/branded_store/menu_ingredients/view',
        data: {
          branded_store_id: brandId,
        },
        useLocalStorage: true,
      })
    ).data;
  }
);

export const createNewIngredient = createAsyncThunk<IComponent, FormData>(
  'provider/ingredients/create',
  async (formData) => {
    const { data } = await Axios({
      method: 'post',
      url: '/provider/branded_store/menu_ingredients/create',
      data: formData,
      useLocalStorage: true,
    });

    return data;
  }
);

export const deleteIngredient = createAsyncThunk<
  IComponent,
  { menu_ingredients_id: number; branded_store_id: number }
>('provider/ingredients/delete', async (obj) => {
  const { data } = await Axios({
    method: 'delete',
    url: '/provider/branded_store/menu_ingredients/delete',
    data: obj,
    useLocalStorage: true,
  });

  return data;
});

export const editIngredient = createAsyncThunk<IComponent, FormData>(
  'provider/ingredients/edit',
  async (formData) => {
    const { data } = await Axios({
      method: 'put',
      url: '/provider/branded_store/menu_ingredients/upd',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      useLocalStorage: true,
    });

    return data;
  }
);

export const fetchProviderProducts = createAsyncThunk<IProduct[], number>(
  'provider/products',
  async (brand_id: number) => {
    const { data } = await Axios({
      method: 'get',
      url: `/provider/branded_store/menu/view?page=1&limit=1000000000000&branded_store_id=${brand_id}`,
      useLocalStorage: true,
    });

    return data;
  }
);

export const createNewProduct = createAsyncThunk<IProduct, FormData>(
  'provider/products/create',
  async (formData) => {
    const { data } = await Axios({
      method: 'post',
      url: '/provider/branded_store/menu/create',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      useLocalStorage: true,
    });

    return data;
  }
);

export const deleteProduct = createAsyncThunk<
  void,
  { productId: number; brandId: number }
>('provider/products/delete', async ({ productId, brandId }) => {
  await Axios({
    method: 'delete',
    url: '/provider/branded_store/menu/delete',
    data: {
      menu_id: productId,
      branded_store_id: brandId,
    },
    useLocalStorage: true,
  });
});

export const editProduct = createAsyncThunk<IProduct, FormData>(
  'provider/products/edit',
  async (formData) => {
    const { data } = await Axios({
      method: 'patch',
      url: '/provider/branded_store/menu/edit',
      data: formData,
      useLocalStorage: true,
    });

    return data;
  }
);

export const fetchProviderGeneralCategories = createAsyncThunk<ICategory[]>(
  'provider/general-categories',
  async () => {
    const { data } = await Axios({
      method: 'get',
      url: '/menu/general_categories/view',
      dontNeedToken: true,
    });

    return data;
  }
);

export const editPositionForProduct = createAsyncThunk<
  void,
  { menu_id: number; position: number }
>('provider/edit-position', async ({ menu_id, position }) => {
  await Axios({
    method: 'post',
    url: '/provider/branded_store/menu/position',
    data: {
      menu_id,
      position,
    },
    useLocalStorage: true,
  });
});

export const editOrderStatus = createAsyncThunk<
  void,
  { order_id: number; status: string }
>('provider/edit_order_status', async (obj) => {
  await Axios({
    method: 'put',
    url: '/provider/branded_store/oder/status',
    data: obj,
    useLocalStorage: true,
  });
});

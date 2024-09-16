import { createAsyncThunk } from '@reduxjs/toolkit'

import Axios from '@/shared/utils/axios.utility'

import IProduct from '@/shared/interfaces/product.interface'

export const getFavorites = createAsyncThunk<IProduct[]>(
  'favorite/all',
  async () => {
    return (await Axios({ method: 'get', url: '/menu/favorite/view' })).data
  }
)

export const addToFavorite = createAsyncThunk(
  'favorite/add',
  async (productId: number) => {
    return await Axios({
      method: 'post',
      url: '/menu/favorite',
      data: { menu_id: productId },
    })
  }
)

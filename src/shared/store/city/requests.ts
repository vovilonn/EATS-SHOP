import { createAsyncThunk } from '@reduxjs/toolkit'

import Axios from '@/shared/utils/axios.utility'

import ICity from '@/shared/interfaces/city.interface'

export const getCities = createAsyncThunk<ICity[]>(
  'city/all',
  async (_, { getState }) => {
    const state: any = getState()

    if (!state.city.cities.length) {
      return (await Axios({ method: 'get', url: '/city/view' })).data
    }
  }
)

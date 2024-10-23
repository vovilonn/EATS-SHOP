import { createSlice } from '@reduxjs/toolkit';
import * as cookies from 'cookies-next';

import {sendNumberCodeAdmin, loginAdmin} from "./requests"
import { message } from 'antd';

export interface IInitialState {
  tokenAdmin: string | null;
}

const initialState: IInitialState = {
  tokenAdmin: null,
};

const authAdminSlice = createSlice({
  name: 'authAdmin',
  initialState,
  reducers: {
  },
  extraReducers: (build) => {
    build.addCase(sendNumberCodeAdmin.fulfilled, () => {});
    build.addCase(loginAdmin.fulfilled, (state, response) => {
      const token = response.payload.data.token;
      state.tokenAdmin = token;
    });
  },
});

export default authAdminSlice;

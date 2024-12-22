import Axios from '@/shared/utils/axios.utility';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface ISendNumberCodeProps {
  numberPhone: string;
}

export const sendNumberCodeAdmin = createAsyncThunk(
  'admin/sendNumberCode',
  async (props: ISendNumberCodeProps, { rejectWithValue }) => {
    const response = await Axios({
      url: '/admin/auth/send_number_code',
      method: 'post',
      data: { number: props.numberPhone },
    });
    return response.data;
  }
);

export const sendNumberCodeProvider = createAsyncThunk(
  'provider/sendNumberCode',
  async (props: ISendNumberCodeProps, { rejectWithValue }) => {
    const response = await Axios({
      url: '/provider/auth/send_number_code',
      method: 'post',
      data: { number: props.numberPhone },
    });
    return response.data;
  }
);

interface ILoginProps {
  numberPhone: string;
  code?: number;
  password?: string;
}

export const loginAdmin = createAsyncThunk(
  'admin/login',
  (props: ILoginProps) => {
    return Axios({
      url: '/admin/auth/login',
      method: 'post',
      data: { number: props.numberPhone, password: props.password },
    });
  }
);

export const loginProvider = createAsyncThunk(
  'provider/login',
  (props: ILoginProps) => {
    return Axios({
      url: '/provider/auth/login',
      method: 'post',
      data: {
        number: props.numberPhone,
        password: props.password,
        code: props.code,
      },
    });
  }
);

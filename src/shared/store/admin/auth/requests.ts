import Axios from '@/shared/utils/axios.utility';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface ISendNumberCodeProps {
  numberPhone: string;
}

export const sendNumberCodeAdmin = createAsyncThunk(
  'admin/sendNumberCode',
  (props: ISendNumberCodeProps) => {
    return Axios({
      url: '/admin/auth/send_number_code',
      method: 'post',
      data: { number: props.numberPhone },
    });
  }
);

interface ILoginProps {
  numberPhone: string;
  code: number;
}

export const loginAdmin = createAsyncThunk(
  'admin/login',
  (props: ILoginProps) => {
    return Axios({
      url: '/admin/auth/login',
      method: 'post',
      data: { number: props.numberPhone, code: props.code },
    });
  }
);

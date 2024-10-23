import Axios from '@/shared/utils/axios.utility';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface IAdminDataProps {
  // Дополните интерфейс необходимыми свойствами
}

interface IUpdateAdminSettingsProps {
  settings: any; // Замените 'any' на конкретный тип настроек
}

// Получение данных администратора
export const fetchAdminData = createAsyncThunk(
  'admin/fetchAdminData',
  async (props?: IAdminDataProps) => {
    const response = await Axios({
      url: '/admin/data',
      method: 'get',
    });
    return response.data;
  }
);

// Обновление настроек администратора
export const updateAdminSettings = createAsyncThunk(
  'admin/updateAdminSettings',
  async (props: IUpdateAdminSettingsProps) => {
    const response = await Axios({
      url: '/admin/settings',
      method: 'post',
      data: props.settings,
    });
    return response.data;
  }
);

// Отправка кода на номер администратора
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

// Вход администратора
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

// Заполнение профиля администратора
interface IFillingProfileProps {
  name: string;
  referralCode: number | null;
  cityId: number;
}

export const fillingProfileAdmin = createAsyncThunk(
  'admin/fillingProfile',
  (props: IFillingProfileProps) => {
    return Axios({
      url: '/admin/auth/filling_profile',
      method: 'post',
      data: {
        name: props.name,
        referral_code: props.referralCode,
        city_id: props.cityId,
      },
    });
  }
);

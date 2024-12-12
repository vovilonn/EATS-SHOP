import { FC, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fillingProfile } from '@/shared/store/auth/requests';
import { TypeDispatch } from '@/shared/store';

import FormInput from '../../../form/form-input';
import SelectCity from '../../../select-city';
import Button from '../../../button';

import style from './style.module.scss';

interface IPopupPersonalInfoProps {
  onSubmit: () => void;
}

const PopupPersonalInfo: FC<IPopupPersonalInfoProps> = (props) => {
  const dispatch = useDispatch<TypeDispatch>();
  const [name, setName] = useState<string>('');
  const [referralCode, setReferralCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const isValidField: boolean = Boolean(name.length);

  const handleInputChange = (field: 'name' | 'referralCode', value: string) => {
    if (field === 'name') {
      setName(value);
    } else if (field === 'referralCode') {
      setReferralCode(value);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidField) return;

    try {
      setLoading(true);

      const response = await dispatch(
        fillingProfile({
          cityId: 1,
          referralCode: Number(referralCode) || null,
          name,
        })
      );

      if (response.payload?.status === 'OK') {
        props.onSubmit();
      }
    } catch (error) {
      console.log('error =>', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={style.personal} onSubmit={(e) => onSubmit(e)}>
      <p className={style.text}>Вкажіть ваше ім’я та місто</p>
      <FormInput
        placeholder="Ім’я"
        onChange={(e) => handleInputChange('name', e.target.value)}
        valid={Boolean(name.length)}
        large
      />
      <FormInput
        className={style.number}
        placeholder="Реферальний номер"
        onChange={(e) => handleInputChange('referralCode', e.target.value)}
        valid={Boolean(referralCode.length)}
        large
      />
      {/* <SelectCity onChange={(id) => setCityId(id)} large /> */}
      <Button
        className={style.btn}
        type="submit"
        disabled={!isValidField || loading}
        basket
        large
      >
        Продовжити
      </Button>
    </form>
  );
};

export default PopupPersonalInfo;

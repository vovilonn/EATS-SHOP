import { FC, FormEvent, useEffect, useState } from 'react';
import useDigitInput from 'react-digit-input';
import { useDispatch } from 'react-redux';

import { login, sendNumberCode } from '@/shared/store/auth/requests';
import { TypeDispatch } from '@/shared/store';

import FormInput from '../../../form/form-input';
import Button from '../../../button';

import style from './style.module.scss';

interface IPopupLoginProps {
  numberPhone: string;
  onSubmit: (userdata: { [key: string]: string }) => void;
  setVisiblePhoneNumber: (value: boolean) => void;
  setVisibleLogin: (value: boolean) => void;
}

const PopupLogin: FC<IPopupLoginProps> = (props) => {
  const dispatch = useDispatch<TypeDispatch>();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  const digitInput = useDigitInput({
    acceptedCharacters: /\d/,
    length: 4,
    value: code,
    onChange: setCode,
  });

  const isValidCode = !digitInput.map((input) => input.value).includes('');
  const firstDigit = digitInput[0];
  const secondDigit = digitInput[1];
  const thirdDigit = digitInput[2];
  const fourthDigit = digitInput[3];

  useEffect(() => {
    if (props.numberPhone) {
      setTimer(60); // Сбрасываем таймер при смене номера телефона или показе формы
    }
  }, [props.numberPhone]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidCode) return;

    try {
      setLoading(true);

      const response = await dispatch(
        login({
          numberPhone: props.numberPhone.replace(/ /g, ''),
          code: Number(code),
        })
      );

      if (response.payload?.status === 'OK') {
        props.onSubmit(response.payload.data);
      }
    } catch (error) {
      console.log('error =>', error);
    } finally {
      setLoading(false);
    }
  };

  const resendCode = () => {
    if (canResend) {
      setTimer(60); // Сбрасываем таймер на 60 секунд
      setCanResend(false);
      dispatch(
        sendNumberCode({ numberPhone: props.numberPhone.replace(/ /g, '') })
      );
      console.log('Код отправлен повторно');
    }
  };

  const onChangeNumber = () => {
    props.setVisibleLogin(false);
    props.setVisiblePhoneNumber(true);
  };

  return (
    <form className={style.login} onSubmit={(e) => onSubmit(e)}>
      <p className={style.text}>
        Введіть 4-х значний код, відправлений на номер телефону
      </p>
      <p className={style.number}>{props.numberPhone}</p>
      <button className={style.change} type="button" onClick={onChangeNumber}>
        Змінити номер
      </button>
      <div className={style.row}>
        <FormInput
          digitAttr={firstDigit}
          valid={Boolean(firstDigit.value)}
          large
          code
        />
        <FormInput
          digitAttr={secondDigit}
          valid={Boolean(secondDigit.value)}
          large
          code
        />
        <FormInput
          digitAttr={thirdDigit}
          valid={Boolean(thirdDigit.value)}
          large
          code
        />
        <FormInput
          digitAttr={fourthDigit}
          valid={Boolean(fourthDigit.value)}
          large
          code
        />
      </div>
      <Button
        className={style.btn}
        disabled={!isValidCode || loading}
        type="submit"
        basket
        large
      >
        Продовжити
      </Button>

      <button className={style.again} type="button" onClick={resendCode}>
        {canResend ? `Відправити код повторно` : `${timer} сек`}
      </button>
    </form>
  );
};

export default PopupLogin;

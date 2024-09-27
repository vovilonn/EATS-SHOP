import { FC, useState } from 'react';
import { useMask } from '@react-input/mask';
import { useDispatch } from 'react-redux';
import FormInput from '@/shared/components/ui/form/form-input';
import FormCheckbox from '@/shared/components/ui/form/form-checkbox';
import Button from '@/shared/components/ui/button';

import style from './style.module.scss';
import { updateAccountInfo } from '@/shared/store/account/requests';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

const PersonalInfoUpdate: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { accountInfo } = useTypedSelector((state) => state.accountInfo);
  console.log(accountInfo);

  const optionGenderList = [{ name: 'Чоловік' }, { name: 'Жінка' }];
  const [selectedGender, setGender] = useState<string>(
    optionGenderList[0].name
  );
  const [formData, setFormData] = useState({
    name: accountInfo?.name ?? '',
    email: accountInfo?.email ?? '',
    phone: accountInfo?.number ?? '',
    date_birthday: accountInfo?.date_birthday ?? '',
  });
  const [isSubscribed, setIsSubscribed] = useState(false);

  const dateInputRef = useMask({
    mask: 'рррр-мм-дд',
    replacement: { д: /\d/, м: /\d/, р: /\d/ },
  });

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = () => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('date_birthday', formData.date_birthday);
    data.append('gender', selectedGender);

    dispatch(updateAccountInfo(data));
  };

  const renderingOptionGender = optionGenderList.map((gender) => {
    const onSelectOption = () => {
      setGender(gender.name);
    };

    const classNameOption = `
      ${style.gender}
      ${selectedGender === gender.name && style.active}
    `;

    return (
      <button
        key={gender.name}
        className={classNameOption}
        onClick={onSelectOption}
      >
        {gender.name}
      </button>
    );
  });

  return (
    <form className={style.form} onSubmit={(e) => e.preventDefault()}>
      <div className={style.fields}>
        <div className={style.field}>
          <label className={style.label} htmlFor="name">
            Ім’я
          </label>
          <FormInput
            placeholder="Ім’я"
            onChange={(value: string) => handleInputChange('name', value)}
            large
          />
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor="email">
            Пошта
          </label>
          <FormInput
            placeholder="Пошта"
            onChange={(value: string) => handleInputChange('email', value)}
            large
          />
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor="phone">
            Телефон
          </label>
          <FormInput
            placeholder="Телефон"
            onChange={(value: string) => handleInputChange('phone', value)}
            large
          />
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor="birth">
            Дата народження
          </label>
          <FormInput
            reference={dateInputRef}
            placeholder="рррр-мм-дд"
            onChange={(value: string) =>
              handleInputChange('date_birthday', value)
            }
            large
          />
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor="gender">
            Стать
          </label>
          <div className={style.genders}>{renderingOptionGender}</div>
        </div>
        <div className={style.checkbox}>
          <FormCheckbox onChange={() => setIsSubscribed(!isSubscribed)}>
            Хочу отримувати пропозиції, щодо <br /> новин та акцій
          </FormCheckbox>
        </div>
      </div>

      <Button className={style.btn} basket onClick={handleFormSubmit}>
        Зберегти
      </Button>
    </form>
  );
};

export default PersonalInfoUpdate;

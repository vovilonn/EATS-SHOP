import { FC, useState, useEffect } from 'react';
import { useMask } from '@react-input/mask';
import { useDispatch } from 'react-redux';
import FormInput from '@/shared/components/ui/form/form-input';
import FormCheckbox from '@/shared/components/ui/form/form-checkbox';
import Button from '@/shared/components/ui/button';

import style from './style.module.scss';
import { updateAccountInfo } from '@/shared/store/account/requests';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

interface PersonalInfoUpdateProps {
  previewImage: File | null;
}

const PersonalInfoUpdate: FC<PersonalInfoUpdateProps> = (props) => {
  const dispatch = useDispatch<TypeDispatch>();
  const { accountInfo } = useTypedSelector((state) => state.accountInfo);

  const optionGenderList = [{ name: 'Чоловік' }, { name: 'Жінка' }];
  const [selectedGender, setGender] = useState<string>(
    optionGenderList[0].name
  );

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    date_birthday: string;
    photo: File | null;
  }>({
    name: '',
    email: '',
    phone: '',
    date_birthday: '',
    photo: null,
  });

  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (accountInfo) {
      setFormData({
        name: accountInfo.name || '',
        email: accountInfo.email || '',
        phone: accountInfo.number || '',
        date_birthday: accountInfo.date_birthday || '',
        photo: props.previewImage || null,
      });
      setGender(accountInfo.gender || optionGenderList[0].name);
    }
  }, [accountInfo]);

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

    if (props.previewImage) {
      data.append('photo', props.previewImage);
    }

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
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            large
          />
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor="email">
            Пошта
          </label>
          <FormInput
            placeholder="Пошта"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            large
          />
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor="phone">
            Телефон
          </label>
          <FormInput
            placeholder="Телефон"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            large
          />
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor="birth">
            Дата народження
          </label>
          <FormInput
            reference={dateInputRef}
            value={formData.date_birthday}
            placeholder="рррр-мм-дд"
            onChange={(e) => handleInputChange('date_birthday', e.target.value)}
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

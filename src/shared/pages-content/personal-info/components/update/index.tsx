import { FC, useState, useEffect } from 'react';
import { useMask } from '@react-input/mask';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import FormInput from '@/shared/components/ui/form/form-input';
import Button from '@/shared/components/ui/button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import style from './style.module.scss';
import { updateAccountInfo } from '@/shared/store/account/requests';
import { TypeDispatch } from '@/shared/store';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { toast } from 'react-toastify';

interface PersonalInfoUpdateProps {
  previewImage: File | null;
}

const PersonalInfoUpdate: FC<PersonalInfoUpdateProps> = (props) => {
  const dispatch = useDispatch<TypeDispatch>();
  const router = useRouter();
  const { accountInfo } = useTypedSelector((state) => state.accountInfo);

  const optionGenderList = [{ name: 'Чоловік' }, { name: 'Жінка' }];

  const [selectedGender, setGender] = useState<string>(
    accountInfo?.gender ?? optionGenderList[0].name
  );
  const [formData, setFormData] = useState({
    name: accountInfo?.name ?? '',
    email: accountInfo?.email ?? '',
    phone: accountInfo?.number ?? '',
    date_birthday: accountInfo?.date_birthday
      ? new Date(accountInfo.date_birthday)
      : null,
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    date_birthday: ''

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
>>>>>>> main
  });

  useEffect(() => {
    setFormData({
      name: accountInfo?.name ?? '',
      email: accountInfo?.email ?? '',
      phone: accountInfo?.number ?? '',
      date_birthday: accountInfo?.date_birthday
        ? new Date(accountInfo.date_birthday)
        : null,
    });
    setGender(accountInfo?.gender ?? optionGenderList[0].name);
  }, [accountInfo]);

  const handleInputChange = (id: string, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' })); 
  };

  const validateForm = () => {
    const newErrors = { name: '', email: '', phone: '', date_birthday: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Будь ласка, введіть ваше ім’я';
      isValid = false;
    } else if (/\d/.test(formData.name)) {
      newErrors.name = 'Ім’я не повинно містити цифри';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Будь ласка, введіть вашу пошту';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Невірний формат електронної пошти';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Будь ласка, введіть ваш телефон';
      isValid = false;
    } else if (!/^\+?\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Невірний формат телефону';
      isValid = false;
    }

    if (!formData.date_birthday) {
      newErrors.date_birthday = 'Будь ласка, оберіть дату народження';
      isValid = false;
    } else if (formData.date_birthday > new Date()) {
      newErrors.date_birthday = 'Дата народження не може бути в майбутньому';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append(
      'date_birthday',
      formData.date_birthday?.toISOString().split('T')[0] || ''
    );
    data.append('gender', selectedGender);

    try {
      await dispatch(updateAccountInfo(data)).unwrap();
      toast.success('Дані успішно оновлено');
      router.push('/profile');
    } catch (error) {
      toast.error('Сталася помилка при оновленні даних');
    }
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
        type="button"
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
          {errors.name && <p className={style.error}>{errors.name}</p>}
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
          {errors.email && <p className={style.error}>{errors.email}</p>}
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
          {errors.phone && <p className={style.error}>{errors.phone}</p>}
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor="birth">
            Дата народження
          </label>
          <DatePicker
            selected={formData.date_birthday}
            onChange={(date: string | Date | null) => handleInputChange('date_birthday', date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Оберіть дату"
            className={style.datePicker}
            maxDate={new Date()}
          <FormInput
            reference={dateInputRef}
            value={formData.date_birthday}
            placeholder="рррр-мм-дд"
            onChange={(e) => handleInputChange('date_birthday', e.target.value)}
            large
          />
          {errors.date_birthday && (
            <p className={style.error}>{errors.date_birthday}</p>
          )}
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor="gender">
            Стать
          </label>
          <div className={style.genders}>{renderingOptionGender}</div>
        </div>
      </div>

      <Button className={style.btn} basket onClick={handleFormSubmit}>
        Зберегти
      </Button>
    </form>
  );
};

export default PersonalInfoUpdate;

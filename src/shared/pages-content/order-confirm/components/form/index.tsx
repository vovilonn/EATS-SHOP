import { FC, useState } from 'react';
import Link from 'next/link';

import optionsRenderingUtility from '@/shared/utils/options-rendering.utility';
import Institution from '@/shared/components/institution';
import Button from '@/shared/components/ui/button';
import FormInput from '@/shared/components/ui/form/form-input';
import Map from '@/shared/components/map';
import FormCheckbox from '@/shared/components/ui/form/form-checkbox';

import style from './style.module.scss';

const OrderConfirmForm: FC = () => {
  const deliveryList = [{ name: 'Доставка' }, { name: 'Самовивіз' }];
  const [selectedOption, setOption] = useState<string>('Доставка');
  const [cashPayment, setCashPayment] = useState<boolean>(false);
  const [cardPayment, setCardPayment] = useState<boolean>(false);
  
  const [address, setAddress] = useState<string>('');
  const [approach, setApproach] = useState<string>('');
  const [floor, setFloor] = useState<string>('');
  const [apartment, setApartment] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formError, setFormError] = useState<string>(''); // Состояние для общей ошибки

  const onSelectOption = (option: any) => {
    setOption(option.name);
  };

  const optionsDeliveryRendering = optionsRenderingUtility({
    style,
    options: deliveryList,
    onSelectOption,
    selectedOption,
  });

  const handleCashChange = () => {
    setCashPayment(true);   
    setCardPayment(false);   
  };

  const handleCardChange = () => {
    setCardPayment(true);   
    setCashPayment(false);   
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    setFormError(''); // Сброс общей ошибки при отправке

    if (selectedOption === 'Доставка' && !address) {
      newErrors.address = 'Адреса доставки обов\'язкова';
    }
    if (selectedOption === 'Доставка' && !approach) {
      newErrors.approach = 'Під’їзд обов\'язковий';
    }
    if (selectedOption === 'Доставка' && !floor) {
      newErrors.floor = 'Поверх обов\'язковий';
    }
    if (selectedOption === 'Доставка' && !apartment) {
      newErrors.apartment = 'Квартира обов\'язкова';
    }
    if (!cashPayment && !cardPayment) {
      newErrors.payment = 'Виберіть спосіб оплати';
    }
    if (promoCode && promoCode !== 'ваш_действительный_промокод') {
      newErrors.promoCode = 'Неправильний промокод';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Отправить данные формы
      console.log('Форма отправлена');
    } else {
      setFormError('Ви не заповнили всі обов’язкові поля'); // Установка общего сообщения об ошибке
    }
  };

  const handleNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (!/^\d*$/.test(value)) {
      e.currentTarget.value = value.replace(/\D/g, ''); // Заменяет все, кроме цифр
    }
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className={style.delivery}>
        <h1 className={style.title}>Доставка</h1>
        <div className={style.tabs}>{optionsDeliveryRendering}</div>
        {selectedOption === 'Доставка' && (
          <div className={style.address}>
            <div className={style.field}>
              <label className={style.label} htmlFor='address'>
                Адрес доставки
              </label>
              <FormInput
                className={`${style.input} ${errors.address ? style.errorBorder : ''}`} // Условное добавление класса
                id='address'
                value={address}
                onChange={(e) => setAddress(e.target.value)} // Используйте e.target.value
                large
              />
              {errors.address && <span className={style.error}>{errors.address}</span>}
            </div>
            <Button className={style.select} basket>
              Обрати на карті
            </Button>
            <div className={style.map}>
              <Link className={style.change} href=''>
                Змінити адрес
              </Link>
              <Map className={style.iframe} />
              <div className={style.detailed}>
                <div className={style.field}>
                  <label className={style.label} htmlFor='approach'>
                    Під’їзд
                  </label>
                  <FormInput
                    className={`${style.input} ${errors.approach ? style.errorBorder : ''}`} // Условное добавление класса
                    id='approach'
                    type='number' // Устанавливаем тип number
                    value={approach}
                    onChange={(e) => setApproach(e.target.value)} // Используйте e.target.value
                    onInput={handleNumberInput} // Добавляем обработчик для валидации ввода
                    large
                  />
                  {errors.approach && <span className={style.error}>{errors.approach}</span>}
                </div>
                <div className={style.field}>
                  <label className={style.label} htmlFor='floor'>
                    Поверх
                  </label>
                  <FormInput
                    className={`${style.input} ${errors.floor ? style.errorBorder : ''}`} // Условное добавление класса
                    id='floor'
                    type='number' // Устанавливаем тип number
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)} // Используйте e.target.value
                    onInput={handleNumberInput} // Добавляем обработчик для валидации ввода
                    large
                  />
                  {errors.floor && <span className={style.error}>{errors.floor}</span>}
                </div>
                <div className={style.field}>
                  <label className={style.label} htmlFor='apartment'>
                    Квартира
                  </label>
                  <FormInput
                    className={`${style.input} ${errors.apartment ? style.errorBorder : ''}`} // Условное добавление класса
                    id='apartment'
                    type='number' // Устанавливаем тип number
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)} // Используйте e.target.value
                    onInput={handleNumberInput} // Добавляем обработчик для валидации ввода
                    large
                  />
                  {errors.apartment && <span className={style.error}>{errors.apartment}</span>}
                </div>
              </div>
            </div>
            <div className={style.institution}>
              <Button className={style.select} basket>
                Обрати заклад
              </Button>
              <Link className={style.change} href=''>
                Змінити адрес
              </Link>
              <Institution />
            </div>
          </div>
        )}
        
        <div className={style.call}>
          <FormCheckbox onChange={() => {}} large>
            Не передзвонювати
          </FormCheckbox>
        </div>
        <div className={style.payment}>
          <h2 className={style.title}>Спосіб оплати</h2>
          <FormCheckbox onChange={handleCashChange} large checked={cashPayment}>
            Готівка
          </FormCheckbox>
          <FormCheckbox 
            className={style.cart} 
            onChange={handleCardChange} 
            large 
            checked={cardPayment} 
            disabled={cashPayment} 
          >
            Карткою онлайн
          </FormCheckbox>
          {errors.payment && <span className={style.error}>{errors.payment}</span>}
        </div>
        {cashPayment && (
          <div className={style.field}>
            <label className={style.label} htmlFor='ready'>
              Підготувати решту з
            </label>
            <FormInput
              className={`${style.input} ${errors.ready ? style.errorBorder : ''}`} // Условное добавление класса
              id='ready'
              type='number' // Устанавливаем тип number
              onChange={() => {}}
              onInput={handleNumberInput} // Добавляем обработчик для валидации ввода
              large
            />
          </div>
        )}
      </div>
      <div className={style.comment}>
        <h1 className={style.title}>Коментар</h1>
        <textarea className={style.textarea}></textarea>
        <div className={style.coin}>
          <p className={style.label}>У вас 100 eatscoin</p>

          <div className={style.activate}>
            <input
              className={`${style.input} ${errors.promoCode ? style.errorBorder : ''}`} // Условное добавление класса
              type='text'
              placeholder='Промокод'
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)} // Используйте e.target.value
            />
            {errors.promoCode && <span className={style.error}>{errors.promoCode}</span>}
          </div>
          <div className={style.activate}>
            <input
              className={style.input}
              type='text'
              placeholder='Бонусні eatscoin'
              onInput={handleNumberInput} // Добавляем обработчик для валидации ввода
            />
          </div>
        </div>
        <div className={style.info}>
          <div className={style.list}>
            <p className={style.text}>
              <span>Вартість замовлення</span>
              <span>595 грн</span>
            </p>
            <p className={style.text}>
              <span>Використані eatscoin</span>
              <span>0 e</span>
            </p>
            <p className={style.text}>
              <span>Знижка</span>
              <span>0 грн</span>
            </p>
            <p className={style.text}>
              <span>Вартість доставки</span>
              <span>60 грн</span>
            </p>
          </div>

          <p className={style.total}>
            <span>Загальна вартість</span>
            <span>595 грн</span>
          </p>
        </div>
        <Button className={style.checkout} basket type='submit'>
          Оформити
        </Button>
        {formError && <span className={style.error}>{formError}</span>} {/* Сообщение об ошибке формы */}
      </div>
    </form>
  );
};

export default OrderConfirmForm;

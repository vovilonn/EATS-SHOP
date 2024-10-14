import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

import optionsRenderingUtility from '@/shared/utils/options-rendering.utility';
import Institution from '@/shared/components/institution';
import Button from '@/shared/components/ui/button';
import FormInput from '@/shared/components/ui/form/form-input';
import Map from '@/shared/components/map';
import FormCheckbox from '@/shared/components/ui/form/form-checkbox';

import style from './style.module.scss';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { getCart } from '@/shared/store/cart/requests';
import { createOrder, getOrderOption } from '@/shared/store/orders/requests';
import { getAccountInfo } from '@/shared/store/account/requests';
import { IOrderCreate } from '@/shared/interfaces/order.interface';

const OrderConfirmForm: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const { accountInfo } = useTypedSelector((state) => state.accountInfo);
  const { total_cost } = useTypedSelector((state) => state.cart);
  const { delivery_price, min_delivery_not_price } = useTypedSelector(
    (state) => state.orders.orderOption
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const deliveryList = [{ name: 'Доставка' }, { name: 'Самовивіз' }];
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [selectedOption, setOption] = useState<string>('Доставка');
  const [cashPayment, setCashPayment] = useState<boolean>(false);
  const [cardPayment, setCardPayment] = useState<boolean>(false);

  const [address, setAddress] = useState<string>('');
  const [approach, setApproach] = useState<string>('');
  const [floor, setFloor] = useState<string>('');
  const [isCallback, setIsCallback] = useState<boolean>(false);
  const [eatsCoins, setEatsCoins] = useState<number>(0);
  const [apartment, setApartment] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [comment, setComment] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formError, setFormError] = useState<string>('');

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

  const handleNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (!/^\d*$/.test(value)) {
      e.currentTarget.value = value.replace(/\D/g, '');
    }
    setEatsCoins(Number(e.currentTarget.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    setFormError('');

    if (selectedOption === 'Доставка' && !address) {
      newErrors.address = "Адреса доставки обов'язкова";
    }
    if (selectedOption === 'Доставка' && !approach) {
      newErrors.approach = "Під’їзд обов'язковий";
    }
    if (selectedOption === 'Доставка' && !floor) {
      newErrors.floor = "Поверх обов'язковий";
    }
    if (selectedOption === 'Доставка' && !apartment) {
      newErrors.apartment = "Квартира обов'язкова";
    }
    if (!cashPayment && !cardPayment) {
      newErrors.payment = 'Виберіть спосіб оплати';
    }
    if (promoCode && promoCode !== 'ваш_действительный_промокод') {
      newErrors.promoCode = 'Неправильний промокод';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsSubmitting(true);
        setSubmitError(null);

        const orderData: IOrderCreate = {
          address,
          entrance: approach,
          call_back: isCallback,
          floor,
          apartment,
          type_payment: cashPayment ? 'CASH' : 'ONLINE',
          type_delivery:
            selectedOption === 'Доставка' ? 'DELIVERY' : 'SELF-DELIVERY',
          count_eats_coin: eatsCoins,
          comment: comment,
          promo_code_id: promoCode,
          prepare_rest: null,
        };

        await dispatch(createOrder(orderData)).unwrap();
      } catch (error) {
        setSubmitError('Помилка при оформленні замовлення. Спробуйте ще раз.');
        console.error('Ошибка при создании заказа:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFormError('Ви не заповнили всі обов’язкові поля');
    }
  };

  useEffect(() => {
    dispatch(getCart());
    dispatch(getOrderOption());
    dispatch(getAccountInfo());
    setDeliveryPrice(total_cost >= min_delivery_not_price ? delivery_price : 0);
  }, []);

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className={style.delivery}>
        <h1 className={style.title}>Доставка</h1>
        <div className={style.tabs}>{optionsDeliveryRendering}</div>
        {selectedOption === 'Доставка' && (
          <div className={style.address}>
            <div className={style.field}>
              <label className={style.label} htmlFor="address">
                Адрес доставки
              </label>
              <FormInput
                className={`${style.input} ${
                  errors.address ? style.errorBorder : ''
                }`}
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                large
              />
              {errors.address && (
                <span className={style.error}>{errors.address}</span>
              )}
            </div>
            <Button className={style.select} basket>
              Обрати на карті
            </Button>
            <div className={style.map}>
              <Link className={style.change} href="">
                Змінити адрес
              </Link>
              <Map className={style.iframe} />
              <div className={style.detailed}>
                <div className={style.field}>
                  <label className={style.label} htmlFor="approach">
                    Під’їзд
                  </label>
                  <FormInput
                    className={`${style.input} ${
                      errors.approach ? style.errorBorder : ''
                    }`}
                    id="approach"
                    type="number"
                    value={approach}
                    onChange={(e) => setApproach(e.target.value)}
                    onInput={handleNumberInput}
                    large
                  />
                  {errors.approach && (
                    <span className={style.error}>{errors.approach}</span>
                  )}
                </div>
                <div className={style.field}>
                  <label className={style.label} htmlFor="floor">
                    Поверх
                  </label>
                  <FormInput
                    className={`${style.input} ${
                      errors.floor ? style.errorBorder : ''
                    }`} // Условное добавление класса
                    id="floor"
                    type="number" // Устанавливаем тип number
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)} // Используйте e.target.value
                    onInput={handleNumberInput} // Добавляем обработчик для валидации ввода
                    large
                  />
                  {errors.floor && (
                    <span className={style.error}>{errors.floor}</span>
                  )}
                </div>
                <div className={style.field}>
                  <label className={style.label} htmlFor="apartment">
                    Квартира
                  </label>
                  <FormInput
                    className={`${style.input} ${
                      errors.apartment ? style.errorBorder : ''
                    }`}
                    id="apartment"
                    type="number"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    onInput={handleNumberInput}
                    large
                  />
                  {errors.apartment && (
                    <span className={style.error}>{errors.apartment}</span>
                  )}
                </div>
              </div>
            </div>
            <div className={style.institution}>
              <Button className={style.select} basket>
                Обрати заклад
              </Button>
              <Link className={style.change} href="">
                Змінити адрес
              </Link>
              <Institution />
            </div>
          </div>
        )}

        <div className={style.call}>
          <FormCheckbox
            onChange={() => setIsCallback(!isCallback)}
            large
            checked={isCallback}
          >
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
          {errors.payment && (
            <span className={style.error}>{errors.payment}</span>
          )}
        </div>
        {cashPayment && (
          <div className={style.field}>
            <label className={style.label} htmlFor="ready">
              Підготувати решту з
            </label>
            <FormInput
              className={`${style.input} ${
                errors.ready ? style.errorBorder : ''
              }`}
              id="ready"
              type="number"
              onChange={() => {}}
              onInput={handleNumberInput}
              large
            />
          </div>
        )}
      </div>
      <div className={style.comment}>
        <h1 className={style.title}>Коментар</h1>
        <textarea
          className={style.textarea}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className={style.coin}>
          <p className={style.label}>У вас {accountInfo?.balance} eatscoin</p>

          <div className={style.activate}>
            <input
              className={`${style.input} ${
                errors.promoCode ? style.errorBorder : ''
              }`}
              type="text"
              placeholder="Промокод"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            {errors.promoCode && (
              <span className={style.error}>{errors.promoCode}</span>
            )}
          </div>
          <div className={style.activate}>
            <input
              className={style.input}
              type="text"
              placeholder="Бонусні eatscoin"
              onInput={handleNumberInput}
            />
          </div>
        </div>
        <div className={style.info}>
          <div className={style.list}>
            <p className={style.text}>
              <span>Вартість замовлення</span>
              <span>{total_cost} грн</span>
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
              <span>{deliveryPrice} грн</span>
            </p>
          </div>

          <p className={style.total}>
            <span>Загальна вартість</span>
            <span>{total_cost + deliveryPrice} грн</span>
          </p>
        </div>
        <Button
          className={style.checkout}
          basket
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Оформлення...' : 'Оформити'}
        </Button>
        {formError && <span className={style.error}>{formError}</span>}
        {submitError && <span className={style.error}>{submitError}</span>}
      </div>
    </form>
  );
};

export default OrderConfirmForm;

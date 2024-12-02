'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';

import { getCart } from '@/shared/store/cart/requests';
import { createOrder, getOrderOption } from '@/shared/store/orders/requests';
import { getAccountInfo } from '@/shared/store/account/requests';

import { IOrderCreate } from '@/shared/interfaces/order.interface';

import Institution from '@/shared/components/institution';
import Button from '@/shared/components/ui/button';
import FormInput from '@/shared/components/ui/form/form-input';
import FormCheckbox from '@/shared/components/ui/form/form-checkbox';
import Map from '@/shared/components/map';

import style from './style.module.scss';
import AddressMapPicker from '@/shared/components/map';

const OrderConfirmForm: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();

  const { accountInfo } = useTypedSelector((state) => state.accountInfo);
  const { total_cost } = useTypedSelector((state) => state.cart);
  const { delivery_price, min_delivery_not_price } = useTypedSelector(
    (state) => state.orders.orderOption
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [deliveryPrice, setDeliveryPrice] = useState(0);
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

  useEffect(() => {
    dispatch(getCart());
    dispatch(getOrderOption());
    dispatch(getAccountInfo());
    setDeliveryPrice(total_cost >= min_delivery_not_price ? 0 : delivery_price);
  }, []);

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

    if (!address) {
      newErrors.address = "Адреса доставки обов'язкова";
    }
    if (!approach) {
      newErrors.approach = "Під’їзд обов'язковий";
    }
    if (!floor) {
      newErrors.floor = "Поверх обов'язковий";
    }
    if (!apartment) {
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
          type_delivery: 'DELIVERY',
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

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className={style.delivery}>
        <h1 className={style.title}>Доставка</h1>
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
          {/* <Button className={style.select} basket>
            Обрати на карті
          </Button> */}
          <div className={style.map}>
            {/* <Link className={style.change} href="">
              Змінити адрес
            </Link> */}
            {/* <Map /> TODO */}

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
                  }`}
                  id="floor"
                  type="number"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  onInput={handleNumberInput}
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
            {/* <Button className={style.select} basket>
              Обрати заклад
            </Button> */}
            {/* <Link className={style.change} href="">
              Змінити адрес
            </Link> */}
            {/* <Institution /> */}
          </div>
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
        {cardPayment && (
          <div className={style.call}>
            <FormCheckbox
              onChange={() => setIsCallback(!isCallback)}
              large
              checked={isCallback}
            >
              Не передзвонювати
            </FormCheckbox>
          </div>
        )}
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
          <p className={style.label}>У вас {accountInfo?.balance} eatscoin</p>
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

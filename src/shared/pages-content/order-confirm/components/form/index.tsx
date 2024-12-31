'use client';

import { FC, MouseEvent, useEffect, useState } from 'react';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';
import { useDispatch } from 'react-redux';
import { useActions } from '@/shared/hooks/use-actions';
import { TypeDispatch } from '@/shared/store';

import { checkPromocode, getCart } from '@/shared/store/cart/requests';
import { createOrder, getOrderOption } from '@/shared/store/orders/requests';
import { getAccountInfo } from '@/shared/store/account/requests';

import { IOrderCreate } from '@/shared/interfaces/order.interface';

import Button from '@/shared/components/ui/button';
import FormInput from '@/shared/components/ui/form/form-input';
import FormCheckbox from '@/shared/components/ui/form/form-checkbox';

import { Form, message } from 'antd';
import InfoIcon from '@/shared/assets/icons/info-icon.svg';

import style from './style.module.scss';
import { useForm } from 'antd/es/form/Form';
import useDebounce from '@/shared/hooks/use-debounce';
import {useRouter} from "next/router";
import {PromocodeTypeValue} from "@/shared/interfaces/promocode.interface";
// import Map from "@/shared/components/map";

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const OrderConfirmForm: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const actions = useActions();
  const { push } = useRouter();

  const { accountInfo } = useTypedSelector((state) => state.accountInfo);
  const { total_cost, discount, promocode_id, typePromocode, cart_items } =
    useTypedSelector((state) => state.cart);
  const { delivery_price, min_delivery_not_price } = useTypedSelector(
    (state) => state.orders.orderOption
  );

  useEffect(() => {
    dispatch(getCart());
    dispatch(getOrderOption());
    dispatch(getAccountInfo());
  }, []);

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
  const [eatsCoinApprove, setEatsCoinApprove] = useState(false);
  const [apartment, setApartment] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formError, setFormError] = useState<string>('');
  const [cash, setCash] = useState<string>('');

  useEffect(() => {
    if (cart_items.length > 0) {
      if (total_cost <= min_delivery_not_price && total_cost !== 0) {
        setDeliveryPrice(delivery_price);
      } else {
        setDeliveryPrice(0);
      }
    }
  }, [total_cost, delivery_price]);

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

  const checkTotalSumm = () => {
    let total = total_cost + deliveryPrice;

    if (typePromocode === PromocodeTypeValue.MONEY) {
      total -= discount;
    } else if (typePromocode === PromocodeTypeValue.PERCENTAGE) {
      total -= (total_cost * discount) / 100;
    }

    if (eatsCoinApprove) {
      total = total - eatsCoins;
    }

    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    setFormError('');
    let windowReference = null;

    if (cardPayment) {
      windowReference = window.open();
    }

    if (!address) {
      newErrors.address = "Адреса доставки обов'язкова";
    }
    if (!cashPayment && !cardPayment) {
      newErrors.payment = 'Виберіть спосіб оплати';
    }

    if (cash && Number(cash) < checkTotalSumm()) {
      console.log('cash', cash);
      newErrors.cash = 'Введіть відповідну суму';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsSubmitting(true);
        setSubmitError(null);

        const orderData: IOrderCreate = {
          address,
          entrance: approach || '-',
          call_back: isCallback,
          floor: floor || '-',
          apartment: apartment || '-',
          type_payment: cashPayment ? 'CASH' : 'ONLINE',
          type_delivery: 'DELIVERY',
          count_eats_coin: eatsCoinApprove ? eatsCoins : 0,
          comment: comment ? comment : null,
          promo_code_id: promocode_id ? `${promocode_id}` : null,
          prepare_rest: null,
        };

        const { data } = await dispatch(createOrder(orderData)).unwrap();
        await dispatch(getCart());

        if (data.payment_url) {
          if (windowReference) {
            windowReference.location = data.payment_url;
          }
        }

        actions.resetDiscount();

        push('/profile/orders');

        setAddress('');
        setApproach('');
        setFloor('');
        setIsCallback(false);
        setApartment('');
        setEatsCoins(0);
        setEatsCoinApprove(false);
        setPromoCode('');
        setComment('');
        setErrors({});
        setFormError('');
        setCashPayment(false);
        setCardPayment(false);

        message.success('Замовлення успішно оформлене');
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

  const handleCheckPromocode = async () => {
    try {
      await dispatch(checkPromocode(promoCode)).unwrap();
      message.success('Промокод успешно активирован!');
    } catch (error) {
      message.error('Проверьте правильность кода!');
    }
  };

  const handleCheckEatsCoins = () => {
    if (accountInfo?.balance && accountInfo?.balance >= eatsCoins) {
      message.success('Eats Coin успешно активированы!');
      setEatsCoinApprove(true);
    } else {
      message.error('У вас недостаточно Eats Coin');
      setEatsCoinApprove(false);
    }
  };

  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const toggleInfoVisibility = () => {
    setIsInfoVisible((prev) => !prev);
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className={style.delivery}>
        <h1 className={style.title}>Доставка</h1>
        <div className={style.infoBlock}>
            <p className={style.info}>Доставка до 5го поверху, якщо ліфт не працює</p>
        </div>
        <div className={style.address}>
          <div className={style.field}>
            <label className={style.label} htmlFor="address">
              Адресa доставки
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
            {/*<Map /> TODO */}

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
          <h3 className={style.title}>Спосіб оплати</h3>
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
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              large
            />
            {errors.cash && <span className={style.error}>{errors.cash}</span>}
          </div>
        )}
        <div className={style.comment}>
          <h3 className={style.title}>Коментар</h3>
          <textarea
            className={style.textarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className={style.right}>
        <div className={style.coin}>
          <h3 className={style.label}>У вас {accountInfo?.balance} eatscoin</h3>
          <div className={style.activate}>
            <input
              className={style.input}
              type="text"
              placeholder="Бонусні eatscoin"
              onInput={handleNumberInput}
            />
            <span className={style.activateText} onClick={handleCheckEatsCoins}>
              Активувати
            </span>
          </div>
          <div className={style.activate}>
            <div className={style.activateContent}>
              <input
                className={`${style.input} ${
                  errors.promoCode ? style.errorBorder : ''
                }`}
                type="text"
                placeholder="Промокод"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <span
                className={style.activateText}
                onClick={handleCheckPromocode}
              >
                Активувати
              </span>
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
                <span>{eatsCoinApprove ? eatsCoins : 0} e</span>
              </p>
              <p className={style.text}>
                <span>Знижка</span>
                <span>
                  {typePromocode === PromocodeTypeValue.PERCENTAGE ? (total_cost * discount) / 100 : discount} грн
                  {typePromocode === PromocodeTypeValue.PERCENTAGE && ` (${discount}%)`}
                </span>
              </p>
              <p
                className={style.text}
                onClick={(e: MouseEvent<HTMLParagraphElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Вартість доставки
                  <button className={style.infoButton}>
                    <InfoIcon
                      onClick={toggleInfoVisibility}
                      style={{ width: '18px', height: '18px' }}
                    />
                  </button>
                </span>
                <span>{deliveryPrice} грн</span>
              </p>
              <span
                className={style.deliveryInfo}
                style={{ display: isInfoVisible ? 'flex' : 'none' }}
              >
                Безкоштовна доставка від 500 грн
              </span>
            </div>
            <div>
              <p className={style.total}>
                <span>Загальна вартість</span>
                <span>{checkTotalSumm()} грн</span>
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
        </div>
      </div>
    </form>
  );
};

export default OrderConfirmForm;

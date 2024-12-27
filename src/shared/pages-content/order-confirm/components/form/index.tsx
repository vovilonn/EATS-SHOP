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
// import Map from "@/shared/components/map";

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const OrderConfirmForm: FC = () => {
  const dispatch = useDispatch<TypeDispatch>();
  const actions = useActions();

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
  const [addressSelected, setAddressSelected] = useState(false);
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

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const debouncedAddress = useDebounce(address, 500);

  useEffect(() => {
    if (cart_items.length > 0) {
      if (total_cost <= min_delivery_not_price) {
        setDeliveryPrice(delivery_price);
      } else {
        setDeliveryPrice(0);
      }
    }
  }, [total_cost, delivery_price]);

  const fetchSuggestions = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Ошибка при загрузке подсказок:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedAddress?.length > 2 && !addressSelected) {
      fetchSuggestions(debouncedAddress);
    }
  }, [debouncedAddress, addressSelected]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setAddress(inputValue);
    setAddressSelected(false);

    if (inputValue.trim() === '') {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    setAddressSelected(true);
    setAddress(suggestion.display_name);
    setSuggestions([]);
  };

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
          count_eats_coin: eatsCoinApprove ? eatsCoins : 0,
          comment: comment ? comment : null,
          promo_code_id: promocode_id ? `${promocode_id}` : null,
          prepare_rest: null,
        };

        const { data } = await dispatch(createOrder(orderData)).unwrap();
        await dispatch(getCart());

        if (data.payment_url) {
          window.open(data.payment_url, '_blank');
        }

        actions.resetDiscount();

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

  const checkTotalSumm = () => {
    let total = total_cost + deliveryPrice;

    if (typePromocode === 'MONEY') {
      total -= discount;
    } else if (typePromocode === 'PERCENTAGE') {
      total -= (total_cost * discount) / 100;
    }

    if (eatsCoinApprove) {
      total = total - eatsCoins;
    }

    return total;
  };

  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const toggleInfoVisibility = () => {
    setIsInfoVisible((prev) => !prev);
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className={style.delivery}>
        <h1 className={style.title}>Доставка</h1>
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
              // onBlur={() => setSuggestions([])}
              onChange={handleInputChange}
              large
            />
            {suggestions.length > 0 && (
              <ul className={style.suggestions}>
                {isLoading && <li className={style.loading}>Загрузка...</li>}
                {!isLoading &&
                  suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className={style.suggestionItem}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
              </ul>
            )}
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
              onChange={() => {}}
              onInput={handleNumberInput}
              large
            />
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
                <span>{discount} грн</span>
              </p>
              <p
                className={style.text}
                onClick={(e: MouseEvent<HTMLParagraphElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <span>
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

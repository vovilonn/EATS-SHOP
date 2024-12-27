import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useActions } from '@/shared/hooks/use-actions';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

import { addToFavorite } from '@/shared/store/favorite/requests';
import { addCart, getCart } from '@/shared/store/cart/requests';

import IProduct, { IOption } from '@/shared/interfaces/product.interface';

import optionsRenderingUtility from '@/shared/utils/options-rendering.utility';
import totalPriceUtility from '@/shared/utils/total-price.utility';

import Title from '@/shared/components/title';
import Button from '@/shared/components/ui/button';
import AmountToggle from '@/shared/components/ui/amount-toggle';

import LikeIcon from '@/shared/assets/icons/like-icon.svg';
import RemoveIcon from '@/shared/assets/icons/remove-icon.svg';

import style from './style.module.scss';
import { message } from 'antd';

interface IProductActionProps extends IProduct {}

const ProductAction: FC<IProductActionProps> = (props) => {
  const dispatch = useDispatch<TypeDispatch>();
  const stateAuth = useTypedSelector((state) => state.auth);
  const productCount = useTypedSelector((state) =>
    state.product.productsCount.find((item) => item.product_id === props.id)
  );
  const ingredients = useTypedSelector(
    (state) =>
      state.product.productIngredientsCount.find(
        (item) => item.product_id === props.id
      )?.ingredients
  );

  const actions = useActions();
  const [price, setPrice] = useState<number>(props.options[0].price);
  const [amount, setAmount] = useState<number>(
    productCount?.product_count ?? 1
  );
  const [weight, setWeight] = useState<number>(props.options[0].weight);
  const [selectedOption, setOption] = useState<string>(props.options[0].name);
  const [isFavorite, setFavorite] = useState<boolean>(props.is_favorite);

  const totalPrice = totalPriceUtility({ amount, price });

  const onToggleToFavorite = async () => {
    try {
      if (stateAuth.isAuth) {
        const response = await dispatch(addToFavorite(props.id));

        if (response.payload?.status === 'OK') {
          setFavorite((prev) => !prev);

          if (isFavorite) {
            actions.removeProduct(props.id);
          }
        }
      } else {
        actions.setNeedAuth(true);
      }
    } catch (error) {
      console.log('error =>', error);
    }
  };

  const onSelectOption = (option: IOption) => {
    setPrice(option.price);
    setOption(option.name);
    setWeight(option.weight);
  };

  const optionsRendering = optionsRenderingUtility({
    style,
    options: props.options,
    onSelectOption,
    selectedOption,
  });

  const onBasket = async () => {
    if (stateAuth.isAuth) {
      await dispatch(
        addCart({
          menu_id: props.id,
          option_id:
            props.options.find((item) => item.name === selectedOption)?.id ?? 1,
          count: amount,
          ingredients: ingredients ?? [],
        })
      );
      await dispatch(getCart());

      actions.clearProductCount(props.id);
      actions.clearProductIngredientsCount(props.id);

      message.success('Продукт успішно додано до кошика');
    } else {
      actions.setNeedAuth(true);
    }
  };

  return (
    <article className={style.action}>
      <header className={style.header}>
        <Title large>{props.name}</Title>
        <span className={style.icon} onClick={onToggleToFavorite}>
          {isFavorite && <RemoveIcon />}
          {!isFavorite && <LikeIcon />}
        </span>
      </header>
      {props.composition && (
        <p className={style.composition}>
          <b>Склад:</b> {props.composition}
        </p>
      )}
      {weight && (
        <p className={style.weight}>
          <b>Вага:</b> {weight} г
        </p>
      )}
      <div className={style.options}>{optionsRendering}</div>
      <footer className={style.footer}>
        <h2 className={style.price}>{totalPrice} грн</h2>
        <AmountToggle
          productId={props.id}
          setAmount={setAmount}
          amount={amount}
          minAmount={1}
          full
        />
        <Button className={style.btn} onClick={onBasket} basket>
          В кошик
        </Button>
      </footer>
    </article>
  );
};

export default ProductAction;

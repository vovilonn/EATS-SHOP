import {FC, MouseEvent, useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { TypeDispatch } from '@/shared/store';
import { useActions } from '@/shared/hooks/use-actions';
import { useTypedSelector } from '@/shared/hooks/use-typed-selector';

import Link from 'next/link';

import sliceTextUtility from '@/shared/utils/slice-text.utility';
import optionsRenderingUtility from '@/shared/utils/options-rendering.utility';
import totalPriceUtility from '@/shared/utils/total-price.utility';
import totalCartPrice from '@/shared/utils/total-cart-price.utility';

import AmountToggle from '../ui/amount-toggle';
import Button from '@/shared/components/ui/button';

import { addToFavorite } from '@/shared/store/favorite/requests';
import { deleteCartItem, getCart } from '@/shared/store/cart/requests';
import { addCart } from '@/shared/store/cart/requests';

import IProduct, { IOption } from '@/shared/interfaces/product.interface';
import { IModelMenuIngredientsCart } from '@/shared/interfaces/cart-item.interface';

import LikeIcon from '@/shared/assets/icons/like-icon.svg';
import RemoveIcon from '@/shared/assets/icons/remove-icon.svg';

import style from './style.module.scss';
import { useRouter } from 'next/router';
import { message } from 'antd';

interface IProductCardProps extends IProduct {
  cart_id?: number;
  basket?: boolean;
  toggleAmountFull?: boolean;
  minAmount?: number;
  model_options?: IOption;
  count?: number;
  item_cost?: number;
  model_menu_ingredients_cart?: IModelMenuIngredientsCart[];
}

const ProductCard: FC<IProductCardProps> = (props) => {
  const actions = useActions();
  const dispatch = useDispatch<TypeDispatch>();
  const stateAuth = useTypedSelector((state) => state.auth);
  const productCount = useTypedSelector((state) =>
    state.product.productsCount.find((item) => item.product_id === props.id)
  );

  const [price, setPrice] = useState<number>(
    props.basket
      ? props.item_cost ?? 0
      : props.options?.[0].price ?? 0
  );

  useEffect(() => {
    if (props.basket) {
      setPrice(props.item_cost ?? 0);
    }
  }, [props.basket, props.item_cost]);

  const [amount, setAmount] = useState<number>(
    props.basket ? props.count ?? 1 : productCount?.product_count ?? 1
  );

  const [selectedOption, setOption] = useState<string>(
    props.options?.[0].name ?? ''
  );
  const [isFavorite, setFavorite] = useState<boolean>(props.is_favorite);

  const totalPrice = totalPriceUtility({ amount: props.basket ? undefined : amount, price });
  // const cartTotalPrice = totalCartPrice(
  //   props.model_menu_ingredients_cart ?? []
  // );

  const router = useRouter();
  const isBasketPage =
    router.pathname === '/profile/basket' ||
    router.pathname === '/profile/basket/order-confirm';

  const classNameProduct: string = `
    ${style.product}
    ${props.basket && style.basket}
  `;

  const onToggleToIcon = async (id: number) => {
    try {
      if (stateAuth.isAuth) {
        if (props.basket) {
          actions.clearProductCount(id);
          actions.clearProductIngredientsCount(id);
          await dispatch(deleteCartItem(id));
        } else {
          const response = await dispatch(addToFavorite(props.id));

          if (response.payload?.status === 'OK') {
            setFavorite((prev) => !prev);

            if (isFavorite) {
              actions.removeProduct(props.id);
            }
          }
        }
      } else {
        actions.setNeedAuth(true);
      }
    } catch (error) {
      console.log('error =>', error);
    }
  };

  const onSelectOption = (option: any) => {
    setPrice(option.price);
    setOption(option.name);
  };

  const optionsRendering = optionsRenderingUtility({
    style,
    options: props.basket ? [props.model_options] : props.options,
    onSelectOption,
    selectedOption,
  });

  const ingredients = useTypedSelector(
    (state) =>
      state.product.productIngredientsCount.find(
        (item) => item.product_id === props.id
      )?.ingredients
  );

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
    <article className={classNameProduct}>
      <div className={style.wrapper}>
        <Link
          href={`/product/${props.id}`}
          className={style.header}
          style={{ backgroundImage: `url(${props.picture[0]})` }}
          />
        <div className={style.containerWrapper}>
          <Link href={`/product/${props.id}`}>
            <div className={style.container}>
              <div className={style.row}>
                <h1 className={style.title}>
                  {sliceTextUtility(props.name, 25)}
                </h1>
                {(isFavorite || props.basket) && (
                  <div
                    onClick={(e: MouseEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <RemoveIcon
                      className={`${style.icon} ${style.deleteIcon}`}
                      onClick={() =>
                        onToggleToIcon(
                          props.basket ? props.cart_id ?? 0 : props.id
                        )
                      }
                    />
                  </div>
                )}
                {!props.basket && !isFavorite && (
                  <div
                    onClick={(e: MouseEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <LikeIcon
                      className={style.icon}
                      onClick={() => onToggleToIcon(props.id)}
                    />
                  </div>
                )}
              </div>

              {!props.basket && props.composition && (
                <p className={style.composition}>
                  Склад: {sliceTextUtility(props.composition, 35)}
                </p>
              )}

              {props.basket && (
                <>
                  <p className={style.composition}>
                    {props.model_options?.name ? `(${props.model_options?.name})` : ''}{props.model_options?.weight ? `, ${props.model_options?.weight} гр.` : ''}
                  </p>
                  {props.model_menu_ingredients_cart &&
                    props.model_menu_ingredients_cart.map((ingredient, i) => (
                      <p className={style.components}>
                        + {ingredient.count} шт{' '}
                        {ingredient.model_menu_ingredients.name} (
                        {ingredient.model_menu_ingredients.price *
                          ingredient.count}{' '}
                        грн)
                      </p>
                    ))}
                </>
              )}
            </div>
          </Link>
          {!props.basket && (
            <div className={style.options}>{optionsRendering}</div>
          )}
          <footer className={style.footer}>
            <div className={style.actions}>
              <h2 className={style.price}>
                {totalPrice} грн
              </h2>
              {/* {props.basket && <button className={style.edit}>Змінити</button>} TODO */}
              <AmountToggle
                cartId={props.cart_id}
                productId={props.id}
                setAmount={setAmount}
                amount={amount}
                basket={props.basket}
                minAmount={props.minAmount}
                full={props.toggleAmountFull}
              />
            </div>
          </footer>
        </div>
      </div>
      {!isBasketPage && ( // Скрываем кнопку на странице корзины
        <Button className={style.btn} onClick={onBasket} basket>
          В кошик
        </Button>
      )}
    </article>
  );
};

export default ProductCard;
